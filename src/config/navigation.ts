import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Building2
} from 'lucide-react';

export const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'owner', 'tenant']
  },
  {
    name: 'Block Spaces',
    path: '/blocks',
    icon: Building2,
    roles: ['admin']
  },
  {
    name: 'Users',
    path: '/users',
    icon: Users,
    roles: ['admin']
  },
  {
    name: 'Forum',
    path: '/forum',
    icon: MessageSquare,
    roles: ['admin', 'owner', 'tenant']
  },
  {
    name: 'Documents',
    path: '/documents',
    icon: FileText,
    roles: ['admin', 'owner', 'tenant']
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: ['admin', 'owner', 'tenant']
  }
]; 