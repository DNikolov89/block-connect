
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MessageSquare, ThumbsUp, X } from 'lucide-react';

export interface AnnouncementProps {
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
  isAdmin?: boolean;
}

const Announcement: React.FC<AnnouncementProps> = ({
  id,
  title,
  content,
  author,
  date,
  likes,
  comments,
  status,
  isPinned = false,
  isAdmin = false,
}) => {
  // Get avatar fallback from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleApprove = () => {
    console.log('Approve announcement:', id);
    // In a real app, this would call an API to approve the announcement
  };

  const handleReject = () => {
    console.log('Reject announcement:', id);
    // In a real app, this would call an API to reject the announcement
  };

  const handleLike = () => {
    console.log('Like announcement:', id);
    // In a real app, this would call an API to like the announcement
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${status === 'pending' ? 'bg-muted/50' : ''} ${isPinned ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{author.name}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {author.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{date}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {status === 'pending' && (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
                <Clock className="mr-1 h-3 w-3" />
                Pending
              </Badge>
            )}
            {isPinned && (
              <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/10">
                Pinned
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg mt-3">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleLike}>
            <ThumbsUp className="mr-1 h-4 w-4" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <MessageSquare className="mr-1 h-4 w-4" />
            {comments}
          </Button>
        </div>
        
        {isAdmin && status === 'pending' && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-destructive" onClick={handleReject}>
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
            <Button variant="outline" size="sm" className="text-primary" onClick={handleApprove}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Announcement;
