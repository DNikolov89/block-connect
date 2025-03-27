
import { AnnouncementProps } from "./Announcement";

// Mock announcement data
export const announcementData: AnnouncementProps[] = [
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
