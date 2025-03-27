import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Settings, 
  Users, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { navigationItems } from '@/config/navigation';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin', 'owner', 'tenant'],
    },
    {
      name: 'Forum',
      icon: BookOpen,
      path: '/forum',
      roles: ['admin', 'owner', 'tenant'],
    },
    {
      name: 'Chat',
      icon: MessageSquare,
      path: '/chat',
      roles: ['admin', 'owner', 'tenant'],
    },
    {
      name: 'Documents',
      icon: FileText,
      path: '/documents',
      roles: ['admin', 'owner', 'tenant'],
    },
    {
      name: 'Users',
      icon: Users,
      path: '/users',
      roles: ['admin'],
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      roles: ['admin', 'owner', 'tenant'],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role as any)
  );

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-screen w-64 transition-transform',
      theme === 'dark' ? 'glass-dark' : 'glass'
    )}>
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="mb-8 flex items-center justify-center">
            <Link to="/" className="flex items-center">
              <span className="gradient-text text-2xl font-bold">Block Gather</span>
            </Link>
          </div>

          <nav className="space-y-2">
            {navigationItems
              .filter(item => !item.roles || item.roles.includes(user?.role))
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300',
                    'hover:bg-accent/50',
                    location.pathname === item.path && 'glass-button'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
          </nav>
        </div>

        <div className="space-y-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-start gap-3"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-5 w-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-start gap-3 hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
