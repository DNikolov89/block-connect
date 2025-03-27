// User types
export type UserRole = 'admin' | 'owner' | 'tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  blockId: string;
  avatar?: string;
}

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  date: string;
  likes: number;
  comments: number;
  status: 'pending' | 'approved';
  isPinned?: boolean;
}

// Document types
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  size: string;
  category: string;
  uploadedBy: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  uploadDate: string;
  status: 'approved' | 'pending';
  description?: string;
}

// Forum types
export interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  date: string;
  category: string;
  replies: number;
  likes: number;
  lastReply?: {
    author: string;
    date: string;
  };
}

export interface ForumCategory {
  value: string;
  label: string;
  description: string;
  threads: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  pageSize: number;
} 