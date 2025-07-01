import React, { useState, useEffect } from 'react';
import { User, LogOut, Plus, Edit, Trash2, Save, X, Menu, Home, FolderOpen, CheckSquare, Settings, Calendar, Clock, AlertCircle, CheckCircle, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

// API configuration
const API_BASE_URL = 'http://localhost:5000';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired (decode payload)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, remove it
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token:', error);
    localStorage.removeItem('token');
    return false;
  }
};

// Helper function to create headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Enhanced API service functions with better error handling
const apiService = {
  async makeAuthenticatedRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        }
      });

      // Handle different types of authentication errors
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Authentication error:', errorData);
        
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/signin';
        throw new Error('Authentication failed. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async fetchTasks() {
    try {
      return await this.makeAuthenticatedRequest(`${API_BASE_URL}/tasks`);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async fetchProjects() {
    try {
      return await this.makeAuthenticatedRequest(`${API_BASE_URL}/projects`);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async fetchUsers() {
    try {
      return await this.makeAuthenticatedRequest(`${API_BASE_URL}/users`);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async verifyAuth() {
    try {
      return await this.makeAuthenticatedRequest(`${API_BASE_URL}/auth/verify`);
    } catch (error) {
      console.error('Error verifying auth:', error);
      throw error;
    }
  }
};

// Dashboard Component
const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalUsers: 0
  });
  
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [authChecked, setAuthChecked] = useState(false);
  

  // Check authentication before loading dashboard
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // First check if token exists and is valid format
        if (!isAuthenticated()) {
          setError('Please log in to access the dashboard');
          setLoading(false);
          return;
        }

        // Verify token with server
        await apiService.verifyAuth();
        setAuthChecked(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Authentication failed. Please log in again.');
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Get project status icon and color
  const getProjectStatusInfo = (status) => {
    const statusMap = {
      'Active': { icon: Play, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
      'in_progress': { icon: Clock, color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
      'on_hold': { icon: Pause, color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
      'completed': { icon: CheckCircle, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' }
    };
    return statusMap[status] || { icon: AlertCircle, color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' };
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.username : 'Unassigned';
  };

  // Get project name by ID
  const getProjectName = (projectId) => {
    const foundProject = projects.find(p => p.id === projectId);
    return foundProject ? foundProject.name : 'No Project';
  };

  // Fetch all data after authentication is verified
  useEffect(() => {
    if (!authChecked) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching dashboard data...');
        
        const [tasksData, projectsData, usersData] = await Promise.all([
          apiService.fetchTasks(),
          apiService.fetchProjects(),
          apiService.fetchUsers()
        ]);

        console.log('Data fetched:', { tasksData, projectsData, usersData });

        setTasks(tasksData);
        setProjects(projectsData);
        setUsers(usersData);

        // Calculate comprehensive stats
        const activeProjects = projectsData.filter(p => p.status === 'Active').length;
        const completedProjects = projectsData.filter(p => p.status === 'completed').length;
        
        // For tasks, we'll assume tasks without completion status are pending
        // You might want to add a status field to tasks table later
        const completedTasks = Math.floor(tasksData.length * 0.3); // Mock 30% completion rate
        const pendingTasks = tasksData.length - completedTasks;

        setStats({
          totalProjects: projectsData.length,
          totalTasks: tasksData.length,
          completedTasks,
          pendingTasks,
          activeProjects,
          completedProjects,
          totalUsers: usersData.length
        });

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(`Failed to load dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authChecked]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || user?.username || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">Here's a comprehensive overview of your project management system.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <FolderOpen className="h-10 w-10 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
              <p className="text-xs text-gray-400">{stats.activeProjects} active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <CheckSquare className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
              <p className="text-xs text-gray-400">{stats.completedTasks} completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <User className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-gray-400">Total users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-400">{stats.pendingTasks} pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Team Members ({users.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => {
                  const statusInfo = getProjectStatusInfo(project.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div key={project.id} className={`p-4 rounded-lg border ${statusInfo.bgColor}`}>
                      <Link to={`/projects/${project.id}`} className="block">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <StatusIcon className="h-4 w-4" />
                              <h4 className="font-medium text-gray-900">{project.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {project.description || 'No description available'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>ID: {project.id}</span>
                              <span>Created: {formatDate(project.created_at)}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                            {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
                {projects.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No projects found</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <Link to={`/tasks/${task.id}`} className="block">
                    <div  key={task.id} className="p-4 rounded-lg border bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {task.description || 'No description available'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>ID: {task.id}</span>
                            <span>Project: {getProjectName(task.project_id)}</span>
                            <span>Assigned: {getUserName(task.user_id)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {tasks.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No tasks found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">All Projects</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => {
                    const statusInfo = getProjectStatusInfo(project.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{project.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {project.description || 'No description'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                            {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(project.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {projects.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">All Tasks</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {task.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{task.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {task.description || 'No description'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {getProjectName(task.project_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {getUserName(task.user_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(task.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((member) => {
                const userTasks = tasks.filter(task => task.user_id === member.id);
                const userProjects = new Set(userTasks.map(task => task.project_id)).size;
                
                return (
                  <div key={member.id} className="p-6 border rounded-lg bg-gray-50">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">{member.username}</h4>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">User ID:</span>
                        <span className="font-medium">{member.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Active Tasks:</span>
                        <span className="font-medium">{userTasks.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Projects:</span>
                        <span className="font-medium">{userProjects}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {users.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No team members found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;