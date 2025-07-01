/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate ,useParams} from 'react-router-dom';
import Header from './components/includes/Header';
import Footer from './components/includes/Footer';
import SignIn from './components/Login/SignIn';
import SignUp from './components/Login/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Projects from './components/Projects/Projects';
import CreateProject from './components/Projects/CreateProject';
import EditProject from './components/Projects/EditProject';
import Tasks from './components/Tasks/Tasks';
import CreateTask from './components/Tasks/CreateTask';
import EditTask from './components/Tasks/EditTask';
import Profile from './components/Users/Profile';
import ProjectDetails from './components/Projects/ProjectDetails';
import TaskDetails from './components/Tasks/TaskDetails';
import Portfolio from './components/Portfolio';

// Helper component for redirecting with dynamic params
function RedirectWithParam({ from, to, suffix = "" }) {
  const { id } = useParams();
  return <Navigate to={`/${to}/${id}${suffix}`} replace />;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (localStorage token)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow">
          <Routes>
            {/* Portfolio Landing Page - No Header/Footer */}
            <Route 
              path="/" 
              element={<Portfolio onLogin={login} />} 
            />
            
            {/* Public Routes - No Header/Footer */}
            <Route 
              path="/signin" 
              element={!user ? <SignIn onLogin={login} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <SignUp onLogin={login} /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Protected Dashboard Routes - With Header/Footer */}
            <Route 
              path="/dashboard/*" 
              element={
                user ? (
                  <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Header user={user} onLogout={logout} />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Dashboard user={user} />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="projects/create" element={<CreateProject />} />
                        <Route path="projects/:id/edit" element={<EditProject />} />
                        <Route path="projects/:id" element={<ProjectDetails />} />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="tasks/create" element={<CreateTask />} />
                        <Route path="tasks/:id/edit" element={<EditTask />} />
                        <Route path="tasks/:id" element={<TaskDetails />} />
                        <Route path="profile" element={<Profile user={user} onUserUpdate={setUser} />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            {/* Redirects for legacy or public routes */}
            <>
              <Route path="/projects" element={<Navigate to="/dashboard/projects" />} />
              <Route path="/projects/create" element={<Navigate to="/dashboard/projects/create" />} />
              <Route
                path="/projects/:id"
                element={
                  <RedirectWithParam from="projects" to="dashboard/projects" />
                }
              />
              <Route
                path="/projects/:id/edit"
                element={
                  <RedirectWithParam from="projects" to="dashboard/projects" suffix="/edit" />
                }
              />
              <Route path="/tasks" element={<Navigate to="/dashboard/tasks" />} />
              <Route path="/tasks/create" element={<Navigate to="/dashboard/tasks/create" />} />
              <Route
                path="/tasks/:id"
                element={
                  <RedirectWithParam from="tasks" to="dashboard/tasks" />
                }
              />
              <Route
                path="/tasks/:id/edit"
                element={
                  <RedirectWithParam from="tasks" to="dashboard/tasks" suffix="/edit" />
                }
              />
              <Route path="/profile" element={<Navigate to="/dashboard/profile" />} />
              <Route path="/projects/:id" element={<Navigate to="/dashboard/projects/:id" />} />
              <Route path="/projects/:id/edit" element={<Navigate to="/dashboard/projects/:id/edit" />} />
              <Route path="/tasks" element={<Navigate to="/dashboard/tasks" />} />
              <Route path="/tasks/create" element={<Navigate to="/dashboard/tasks/create" />} />
              <Route path="/tasks/:id" element={<Navigate to="/dashboard/tasks/:id" />} />
              <Route path="/tasks/:id/edit" element={<Navigate to="/dashboard/tasks/:id/edit" />} />
              <Route path="/profile" element={<Navigate to="/dashboard/profile" />} />
            </>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;