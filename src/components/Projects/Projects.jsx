/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { User, LogOut, Plus, Edit, Trash2, Save, X, Menu, Home, FolderOpen, CheckSquare, Settings, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
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

// API Service
const projectAPI = {
  // Get all projects
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`,{
      method: 'GET',
      headers: getAuthHeaders()
  });
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Get single project
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  // Delete project
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
  },
};

// Error Alert Component
const ErrorAlert = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <div className="flex">
      <AlertCircle className="h-5 w-5 text-red-400" />
      <div className="ml-3">
        <p className="text-sm text-red-800">{message}</p>
      </div>
      <div className="ml-auto pl-3">
        <button
          onClick={onClose}
          className="inline-flex text-red-400 hover:text-red-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Main Projects Component
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectAPI.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Please check if the server is running.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        setError(null);
        await projectAPI.delete(project.id);
        setProjects(projects.filter(p => p.id !== project.id));
      } catch (err) {
        setError('Failed to delete project');
        console.error('Error deleting project:', err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || styles.active;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link
          to="/projects/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Link>
      </div>

      {error && (
        <ErrorAlert 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <Link
              to="/projects/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <Link to={`/projects/${project.id}`}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {project.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                            {project.status ? project.status.replace('_', ' ') : 'active'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {project.description || 'No description'}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Created {formatDate(project.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-4 flex items-center space-x-2">
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="cursor-pointer text-blue-600 hover:text-blue-900"
                      title="Edit project"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project)}
                      className="text-red-600 cursor-pointer hover:text-red-900"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Projects;