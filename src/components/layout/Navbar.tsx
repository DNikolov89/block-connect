import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Navbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme } = useTheme();

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-6">
      <nav className={cn(
        'rounded-xl h-12 px-4 flex items-center justify-between',
        theme === 'dark'
          ? 'bg-[#1a1f2e]/60 backdrop-blur-sm border border-white/[0.06]'
          : 'bg-white/60 backdrop-blur-sm border border-black/[0.06]'
      )}>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-md h-8 w-8 flex items-center justify-center text-white font-bold">B</div>
            <span className="text-xl font-semibold hidden md:block">Block-connect</span>
          </Link>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center space-x-3">
            <div className={`transition-all duration-300 ${searchOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-full rounded-full bg-background/50 px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/30 ${searchOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                />
                {searchOpen && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {!searchOpen && (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem className="py-2 flex flex-col items-start cursor-pointer">
                    <span className="font-medium">New announcement</span>
                    <span className="text-sm text-muted-foreground">Admin posted a new announcement</span>
                    <span className="text-xs text-muted-foreground mt-1">2 minutes ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 flex flex-col items-start cursor-pointer">
                    <span className="font-medium">Document approved</span>
                    <span className="text-sm text-muted-foreground">Your document was approved by admin</span>
                    <span className="text-xs text-muted-foreground mt-1">1 hour ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 flex flex-col items-start cursor-pointer">
                    <span className="font-medium">New message</span>
                    <span className="text-sm text-muted-foreground">You have a new message from Tenant User</span>
                    <span className="text-xs text-muted-foreground mt-1">Yesterday</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {!isAuthenticated && (
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
