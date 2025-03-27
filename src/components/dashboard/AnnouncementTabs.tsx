
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnnouncementProps } from './Announcement';

interface AnnouncementTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  pendingCount: number;
  isAdmin: boolean;
}

const AnnouncementTabs: React.FC<AnnouncementTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  pendingCount,
  isAdmin 
}) => {
  if (!isAdmin) return null;
  
  return (
    <Tabs 
      defaultValue="all" 
      className="mb-6" 
      value={activeTab} 
      onValueChange={onTabChange}
    >
      <TabsList>
        <TabsTrigger value="all">All Announcements</TabsTrigger>
        <TabsTrigger value="pending" className="flex items-center">
          Pending Approval
          <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
            {pendingCount}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AnnouncementTabs;
