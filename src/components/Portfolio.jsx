import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  Zap, 
  ArrowRight, 
  Play,
  Menu,
  X,
  Target,
  BarChart3,
  Clock,
  Star,
  ChevronRight,
  Laptop,
  Smartphone,
  Globe,
  User,
  LogOut
} from 'lucide-react';

const Portfolio = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Smart Task Management",
      description: "Create, organize, and track tasks with intelligent priority sorting and status updates.",
      demo: "View live task board with drag-and-drop functionality"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Assign tasks to team members, track progress, and communicate seamlessly.",
      demo: "See real-time team activity and member assignments"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Project Tracking",
      description: "Monitor project milestones, deadlines, and deliverables in one centralized dashboard.",
      demo: "Explore project analytics and progress visualization"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Insights",
      description: "Get detailed reports on productivity, task completion rates, and team performance.",
      demo: "Interactive charts showing project metrics"
    }
  ];

  const projects = [
    {
      name: "E-commerce Platform",
      status: "In Progress",
      tasks: 24,
      completed: 18,
      priority: "High",
      color: "bg-red-500"
    },
    {
      name: "Mobile App Development",
      status: "Planning",
      tasks: 15,
      completed: 3,
      priority: "Medium",
      color: "bg-yellow-500"
    },
    {
      name: "Brand Redesign",
      status: "Completed",
      tasks: 12,
      completed: 12,
      priority: "Low",
      color: "bg-green-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      company: "TechCorp",
      avatar: "SJ",
      quote: "This platform transformed how our team manages projects. Productivity increased by 40%!"
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      company: "StartupXYZ",
      avatar: "MC",
      quote: "The intuitive interface and powerful features make task management actually enjoyable."
    },
    {
      name: "Emma Rodriguez",
      role: "Design Director",
      company: "Creative Studio",
      avatar: "ER",
      quote: "Finally, a tool that adapts to our workflow instead of forcing us to adapt to it."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TaskFlow</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#projects" className="text-white/80 hover:text-white transition-colors">Projects</a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
              
              {user ? (
                // Show user info and dashboard link when logged in
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white/80">
                    <User className="w-4 h-4" />
                    <span>Welcome, {user.name}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                // Show sign in and get started when not logged in
                <>
                  <button 
                    onClick={() => navigate('/signin')}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#projects" className="block text-white/80 hover:text-white transition-colors">Projects</a>
              <a href="#testimonials" className="block text-white/80 hover:text-white transition-colors">Testimonials</a>
              
              {user ? (
                // Mobile user menu when logged in
                <>
                  <div className="flex items-center space-x-2 text-white/80 py-2">
                    <User className="w-4 h-4" />
                    <span>Welcome, {user.name}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                // Mobile auth buttons when not logged in
                <>
                  <button 
                    onClick={() => navigate('/signin')}
                    className="w-full bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Now with AI-powered task prioritization
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Manage Tasks
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Transform your productivity with our intuitive task management platform. 
              Create projects, assign tasks, track progress, and collaborate seamlessly with your team.
            </p>
            
            {/* Conditional CTA buttons based on login status */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                // Show dashboard button when logged in
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center group"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                // Show registration buttons when not logged in
                <>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center group"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto">
              Everything you need to manage projects and tasks efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeFeature === index 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                      : 'bg-white/10 backdrop-blur-md hover:bg-white/20'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeFeature === index ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                    }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80">{feature.description}</p>
                      <div className="mt-3 text-purple-300 text-sm flex items-center">
                        {feature.demo}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Demo */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-white rounded-lg p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Task Board</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 h-64">
                  {['To Do', 'In Progress', 'Done'].map((status, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-700 mb-3">{status}</h4>
                      <div className="space-y-2">
                        {[1, 2, 3].slice(0, 3 - idx).map((item) => (
                          <div key={item} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-800">Task {item}</span>
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Project Management</h2>
            <p className="text-white/80 text-xl">
              Organize your work into projects and track progress in real-time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-3 h-3 ${project.color} rounded-full`}></div>
                  <span className="text-xs text-white/60 uppercase tracking-wide">{project.priority}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-white/80 text-sm mb-4">{project.status}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Progress</span>
                    <span className="text-white">{project.completed}/{project.tasks} tasks</span>
                  </div>
                  
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${(project.completed / project.tasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center">
                  View Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-white/80 text-xl">
              Join thousands of satisfied teams worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-white/90 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/60 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Compatibility */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Access Anywhere</h2>
          <p className="text-white/80 text-xl mb-12">
            Use TaskFlow on any device, anywhere in the world
          </p>
          
          <div className="flex justify-center items-center space-x-12">
            <div className="flex flex-col items-center">
              <Laptop className="w-16 h-16 text-purple-400 mb-4" />
              <span className="text-white/80">Desktop</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-16 h-16 text-pink-400 mb-4" />
              <span className="text-white/80">Mobile</span>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="w-16 h-16 text-blue-400 mb-4" />
              <span className="text-white/80">Web</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for non-logged in users */}
      {!user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-white/80 text-xl mb-8">
              Join thousands of teams already using TaskFlow to manage their projects efficiently
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                Start Your Free Trial
              </button>
              <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                Contact Sales
              </button>
            </div>
            
            <p className="text-white/60 text-sm mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TaskFlow</span>
              </div>
              <p className="text-white/60">
                The ultimate task management platform for modern teams
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;