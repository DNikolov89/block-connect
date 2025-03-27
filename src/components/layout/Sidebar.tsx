
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Settings, 
  Users, 
  BookOpen,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  
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
    <aside 
      className={cn(
        "fixed top-16 bottom-0 left-0 lg:translate-x-0 z-40 transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64 bg-sidebar border-r border-sidebar-border"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6 px-4">
          <div className="mb-8">
            <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-2 px-2">
              Main Menu
            </div>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          
          {user?.role === 'admin' && (
            <div>
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-2 px-2">
                Admin Controls
              </div>
              <div className="bg-sidebar-accent rounded-md p-3 space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span>Pending Approvals</span>
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">4</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span>New Users</span>
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">2</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center absolute -right-4 top-8 h-8 w-8 bg-sidebar-accent border border-sidebar-border rounded-full"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center px-2">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {user?.role.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
              <p className="text-xs text-muted-foreground">Block ID: {user?.blockId}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
