
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementList from './AnnouncementList';
import AnnouncementTabs from './AnnouncementTabs';
import { announcementData } from './announcementData';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
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
  
  const pendingCount = announcementData.filter(a => a.status === 'pending').length;

  const handleSubmitAnnouncement = (title: string, content: string) => {
    // In a real app, this would call an API to create a new announcement
    console.log('New announcement:', { title, content });
    
    toast.success('Announcement submitted for approval!');
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
        
        <AnnouncementForm onSubmit={handleSubmitAnnouncement} />
      </div>
      
      <AnnouncementTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
        isAdmin={isAdmin}
      />
      
      <AnnouncementList 
        announcements={filteredAnnouncements} 
        isAdmin={isAdmin} 
      />
    </div>
  );
};

export default DashboardPage;
