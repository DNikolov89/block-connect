
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Announcement, { AnnouncementProps } from './Announcement';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock announcement data
const announcementData: AnnouncementProps[] = [
  {
    id: '1',
    title: 'Building Maintenance Schedule',
    content: 'The annual maintenance schedule has been updated. Please check the document section for details on when maintenance will be performed in your unit.',
    author: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    date: '2 hours ago',
    likes: 5,
    comments: 2,
    status: 'approved',
    isPinned: true
  },
  {
    id: '2',
    title: 'Community BBQ Next Saturday',
    content: 'We\'re hosting a community BBQ next Saturday at 2 PM in the common area. All residents are welcome! Please RSVP by replying to this announcement.',
    author: {
      id: '2',
      name: 'Owner User',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Owner'
    },
    date: 'Yesterday',
    likes: 12,
    comments: 8,
    status: 'approved'
  },
  {
    id: '3',
    title: 'Parking Regulations Reminder',
    content: 'Just a friendly reminder that guest parking is limited to 24 hours. Please register any overnight guests with the building management.',
    author: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    date: '3 days ago',
    likes: 3,
    comments: 1,
    status: 'approved'
  },
  {
    id: '4',
    title: 'Lost Keys Found',
    content: 'A set of keys was found in the lobby. If you\'ve lost your keys, please contact the building manager to claim them.',
    author: {
      id: '3',
      name: 'Tenant User',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Tenant'
    },
    date: '4 days ago',
    likes: 7,
    comments: 3,
    status: 'approved'
  },
  {
    id: '5',
    title: 'Proposal for New Gym Equipment',
    content: 'I would like to propose purchasing new gym equipment for our building\'s fitness center. The current equipment is outdated and needs replacement.',
    author: {
      id: '2',
      name: 'Owner User',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Owner'
    },
    date: 'Just now',
    likes: 0,
    comments: 0,
    status: 'pending'
  }
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const isAdmin = user?.role === 'admin';
  
  // Filter announcements based on active tab
  const filteredAnnouncements = announcementData.filter(announcement => {
    if (activeTab === 'pending') {
      return announcement.status === 'pending';
    }
    if (activeTab === 'all') {
      return announcement.status === 'approved';
    }
    return true;
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // In a real app, this would call an API to create a new announcement
    console.log('New announcement:', { title, content });
    
    toast.success('Announcement submitted for approval!');
    setOpen(false);
    setTitle('');
    setContent('');
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest announcements from your community
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Create a new announcement for your community. All announcements require admin approval before they're visible to everyone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter announcement details"
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
                <Button type="submit">Submit for Approval</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isAdmin && (
        <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Announcements</TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              Pending Approval
              <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                {announcementData.filter(a => a.status === 'pending').length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="space-y-6">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <Announcement
              key={announcement.id}
              {...announcement}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
