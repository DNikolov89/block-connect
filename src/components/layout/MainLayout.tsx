import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '../../lib/utils';
import '@/styles/glass.css';

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { theme } = useTheme();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="bg-primary rounded-2xl h-16 w-16 flex items-center justify-center text-white text-2xl font-bold mb-4 shimmer">
            B
          </div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className={cn(
      'min-h-screen w-full bg-gradient-to-br',
      theme === 'dark' 
        ? 'from-gray-900 via-gray-800 to-gray-900' 
        : 'from-gray-50 via-white to-gray-100'
    )}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-0 left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-40 right-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex relative z-10 pt-24 px-4">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={cn(
          "flex-1 transition-all duration-300 pb-6",
          "lg:ml-16", // Base margin for collapsed state
          sidebarOpen && "lg:ml-64" // Additional margin when expanded
        )}>
          <div className={cn(
            'mx-auto max-w-[1200px] rounded-2xl min-h-[calc(100vh-7rem)]',
            theme === 'dark' ? 'glass-dark' : 'glass'
          )}>
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
