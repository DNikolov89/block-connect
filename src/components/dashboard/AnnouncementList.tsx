
import React from 'react';
import Announcement, { AnnouncementProps } from './Announcement';

interface AnnouncementListProps {
  announcements: AnnouncementProps[];
  isAdmin: boolean;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ announcements, isAdmin }) => {
  return (
    <div className="space-y-6">
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
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
  );
};

export default AnnouncementList;
