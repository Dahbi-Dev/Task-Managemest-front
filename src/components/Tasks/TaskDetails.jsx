/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Flag, 
  Folder,
  Edit,
  Trash2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

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

const TaskDetails = ({ onNavigate }) => {
  const { id } = useParams();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setTask(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch task details');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          if (onNavigate) {
            onNavigate('/tasks');
          } else {
            window.location.href = '/tasks';
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to delete task');
        }
      } catch (err) {
        setError('Network error occurred');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Task ID</h3>
          <p className="text-gray-600 mb-4">No task ID provided in the URL</p>
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Task</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onNavigate ? onNavigate('/tasks') : window.history.back()}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tasks
            </button>
            <div className="flex space-x-3">
              <Link
                to="/tasks/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Link>
              <Link
                to={`/tasks/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Task
              </button>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{task?.title}</h1>
          </div>

          <div className="px-6 py-6">
            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                {task?.description || 'No description provided'}
              </p>
            </div>

            {/* Task Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(task?.status)}`}>
                  {task?.status?.replace('_', ' ') || 'pending'}
                </span>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="flex items-center">
                  <Flag className={`w-4 h-4 mr-2 ${getPriorityColor(task?.priority)}`} />
                  <span className={`text-sm font-medium capitalize ${getPriorityColor(task?.priority)}`}>
                    {task?.priority || 'medium'}
                  </span>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(task?.created_at)}
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <div className="flex items-center bg-gray-50 p-4 rounded-md">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  {task?.assigned_user_name ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.assigned_user_name}</p>
                      <p className="text-sm text-gray-500">{task.assigned_user_email}</p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Unassigned</span>
                  )}
                </div>
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <div className="flex items-center bg-gray-50 p-4 rounded-md">
                  <Folder className="w-4 h-4 mr-2 text-gray-400" />
                  {task?.project_name ? (
                    <Link 
                      to={`/projects/${task.project_id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {task.project_name}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-500">No project assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;