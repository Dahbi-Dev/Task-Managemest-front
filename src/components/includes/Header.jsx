import React, { useState } from 'react';
import { User, LogOut, Plus, Edit, Trash2, Save, X, Menu, Home, FolderOpen, CheckSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

// Header Component
 const Header = ({ user, onLogout, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={'/'} className="text-xl font-bold text-gray-900">ProjectHub</Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
              <Link to={'/dashboard'}
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center  cursor-pointer px-3 py-2 text-sm font-medium ${
                  currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Home className="h-4 w-4 mr-2 " />
                Dashboard
              </Link>
            <Link to={'/projects'}
              onClick={() => onNavigate('projects')}
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === 'projects' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Projects
            </Link>
            <Link to={'/tasks'}
              onClick={() => onNavigate('tasks')}
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === 'tasks' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to={'/profile'}
              onClick={() => onNavigate('profile')}
              className="flex items-center text-sm text-gray-700 hover:text-gray-900"
            >
              <User className="h-4 w-4 mr-2" />
              {user.name}
            </Link>
            <Link 
              onClick={onLogout}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Link>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            <Link
              onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              onClick={() => { onNavigate('projects'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Projects
            </Link>
            <Link
              onClick={() => { onNavigate('tasks'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Tasks
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;