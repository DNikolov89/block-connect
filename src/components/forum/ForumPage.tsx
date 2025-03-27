
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MessageSquare, Plus, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ForumThread {
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

interface ForumCategory {
  value: string;
  label: string;
  description: string;
  threads: number;
}

// Mock forum data
const forumThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Issues with the elevator on floor 3',
    content: 'Has anyone else noticed that the elevator on floor 3 has been making strange noises lately? I\'m concerned it might need maintenance.',
    author: {
      id: '3',
      name: 'Tenant User',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Tenant'
    },
    date: '3 hours ago',
    category: 'maintenance',
    replies: 8,
    likes: 4,
    lastReply: {
      author: 'Admin User',
      date: '30 minutes ago'
    }
  },
  {
    id: '2',
    title: 'Planning the summer block party',
    content: 'I think we should start planning our annual summer block party. Who would be interested in helping organize it this year?',
    author: {
      id: '2',
      name: 'Owner User',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Owner'
    },
    date: 'Yesterday',
    category: 'social',
    replies: 15,
    likes: 12,
    lastReply: {
      author: 'Tenant User',
      date: '2 hours ago'
    }
  },
  {
    id: '3',
    title: 'New recycling guidelines',
    content: 'The city has updated their recycling guidelines. We should all make sure we\'re following the new rules to avoid fines.',
    author: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    date: '2 days ago',
    category: 'announcement',
    replies: 5,
    likes: 9,
    lastReply: {
      author: 'Owner User',
      date: '1 day ago'
    }
  },
  {
    id: '4',
    title: 'Noise complaint from unit 402',
    content: 'I\'ve been hearing loud music from unit 402 late at night. It\'s been difficult to sleep. Has anyone else experienced this?',
    author: {
      id: '3',
      name: 'Tenant User',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Tenant'
    },
    date: '1 week ago',
    category: 'complaint',
    replies: 11,
    likes: 6,
    lastReply: {
      author: 'Admin User',
      date: '3 days ago'
    }
  },
  {
    id: '5',
    title: 'Recommendations for local plumbers',
    content: 'I need to fix a leaky faucet in my bathroom. Does anyone have recommendations for reliable, affordable plumbers in the area?',
    author: {
      id: '2',
      name: 'Owner User',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Owner'
    },
    date: '2 weeks ago',
    category: 'question',
    replies: 7,
    likes: 3,
    lastReply: {
      author: 'Tenant User',
      date: '1 week ago'
    }
  }
];

const categories: ForumCategory[] = [
  { 
    value: 'all', 
    label: 'All Categories', 
    description: 'View threads from all categories',
    threads: forumThreads.length
  },
  { 
    value: 'announcement', 
    label: 'Announcements', 
    description: 'Official announcements from building management',
    threads: forumThreads.filter(t => t.category === 'announcement').length
  },
  { 
    value: 'maintenance', 
    label: 'Maintenance & Repairs', 
    description: 'Discussions about building maintenance and repairs',
    threads: forumThreads.filter(t => t.category === 'maintenance').length
  },
  { 
    value: 'social', 
    label: 'Social Events', 
    description: 'Plan and discuss community social events',
    threads: forumThreads.filter(t => t.category === 'social').length
  },
  { 
    value: 'complaint', 
    label: 'Complaints', 
    description: 'Report issues or complaints about the building',
    threads: forumThreads.filter(t => t.category === 'complaint').length
  },
  { 
    value: 'question', 
    label: 'Questions', 
    description: 'Ask questions about the building or community',
    threads: forumThreads.filter(t => t.category === 'question').length
  }
];

const ForumPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter threads based on selected category
  const filteredThreads = activeCategory === 'all' 
    ? forumThreads 
    : forumThreads.filter(thread => thread.category === activeCategory);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // In a real app, this would call an API to create a new thread
    console.log('New thread:', { title, content, category });
    
    toast.success('Thread created successfully!');
    setOpen(false);
    setTitle('');
    setContent('');
    setCategory('');
  };
  
  // Function to get badge color based on category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'announcement':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-50';
      case 'maintenance':
        return 'bg-amber-50 text-amber-600 hover:bg-amber-50';
      case 'social':
        return 'bg-green-50 text-green-600 hover:bg-green-50';
      case 'complaint':
        return 'bg-red-50 text-red-600 hover:bg-red-50';
      case 'question':
        return 'bg-purple-50 text-purple-600 hover:bg-purple-50';
      default:
        return '';
    }
  };
  
  // Function to format category name
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">
            Connect with your neighbors and discuss community matters
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Thread
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Thread</DialogTitle>
                <DialogDescription>
                  Start a new discussion thread in the community forum
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter thread title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="input-focus">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.value !== 'all').map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter thread content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className="input-focus"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Thread</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
              <CardDescription>Browse topics by category</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <ScrollArea className="h-96">
                <div className="flex flex-col">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      className={`flex justify-between items-center px-6 py-3 text-left transition-colors hover:bg-muted/50 ${activeCategory === cat.value ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                      onClick={() => setActiveCategory(cat.value)}
                    >
                      <div>
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-xs text-muted-foreground">{cat.description}</div>
                      </div>
                      <Badge variant="outline">{cat.threads}</Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Thread list */}
        <div className="md:col-span-3 space-y-4">
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <Card key={thread.id} className="card-hover overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
                        <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{thread.author.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {thread.author.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          {thread.date}
                        </p>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={getCategoryColor(thread.category)}>
                      {formatCategory(thread.category)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3 hover:text-primary transition-colors cursor-pointer">
                    {thread.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{thread.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      {thread.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {thread.replies}
                    </Button>
                  </div>
                  
                  {thread.lastReply && (
                    <div className="text-xs text-muted-foreground">
                      <span>Last reply by </span>
                      <span className="font-medium">{thread.lastReply.author}</span>
                      <span> · {thread.lastReply.date}</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No threads found in this category</p>
              <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
                Create the first thread
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
