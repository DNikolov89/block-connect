
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, User, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  unreadCount?: number;
}

interface ChatGroup {
  id: string;
  name: string;
  avatar?: string;
  members: number;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isOwn: boolean;
}

// Mock data
const chatUsers: ChatUser[] = [
  {
    id: '1',
    name: 'Admin User',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Admin',
    status: 'online',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Owner User',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'Owner',
    status: 'away',
    lastSeen: '5 min ago',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Tenant User',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'Tenant',
    status: 'online',
    unreadCount: 0
  },
  {
    id: '4',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'Tenant',
    status: 'offline',
    lastSeen: '2 hours ago',
    unreadCount: 0
  },
  {
    id: '5',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=6',
    role: 'Owner',
    status: 'online',
    unreadCount: 5
  }
];

const chatGroups: ChatGroup[] = [
  {
    id: '1',
    name: 'Building Announcements',
    members: 25,
    unreadCount: 3,
    lastMessage: 'New maintenance schedule posted',
    lastMessageTime: '15 min ago'
  },
  {
    id: '2',
    name: 'Floor 3 Residents',
    members: 8,
    unreadCount: 0,
    lastMessage: 'Does anyone have a vacuum I can borrow?',
    lastMessageTime: '2 hours ago'
  },
  {
    id: '3',
    name: 'Community Events',
    members: 15,
    unreadCount: 1,
    lastMessage: 'The pool party is on Saturday at 2pm',
    lastMessageTime: 'Yesterday'
  },
  {
    id: '4',
    name: 'Maintenance Committee',
    members: 5,
    unreadCount: 0,
    lastMessage: 'Meeting postponed to next Tuesday',
    lastMessageTime: '3 days ago'
  }
];

const chatMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      text: 'Hi there! How can I help you today?',
      sender: {
        id: '1',
        name: 'Admin User',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      timestamp: '10:32 AM',
      isOwn: false
    },
    {
      id: '2',
      text: 'I have a question about the recent maintenance notice.',
      sender: {
        id: '3',
        name: 'Tenant User',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      timestamp: '10:33 AM',
      isOwn: true
    },
    {
      id: '3',
      text: 'Sure, what would you like to know?',
      sender: {
        id: '1',
        name: 'Admin User',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      timestamp: '10:35 AM',
      isOwn: false
    },
    {
      id: '4',
      text: 'Will the water be shut off during the maintenance?',
      sender: {
        id: '3',
        name: 'Tenant User',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      timestamp: '10:36 AM',
      isOwn: true
    },
    {
      id: '5',
      text: 'Yes, the water will be shut off from 10 AM to 2 PM on Tuesday. We recommend storing some water in advance if needed.',
      sender: {
        id: '1',
        name: 'Admin User',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      timestamp: '10:38 AM',
      isOwn: false
    }
  ],
  '3': [
    {
      id: '1',
      text: 'Hey, have you heard about the community BBQ next weekend?',
      sender: {
        id: '3',
        name: 'Tenant User',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      timestamp: '9:15 AM',
      isOwn: true
    },
    {
      id: '2',
      text: 'Yes! I\'m definitely going. Are you planning to attend?',
      sender: {
        id: '2',
        name: 'Owner User',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      timestamp: '9:18 AM',
      isOwn: false
    },
    {
      id: '3',
      text: 'Absolutely! I\'m thinking of bringing my homemade potato salad. What do you think?',
      sender: {
        id: '3',
        name: 'Tenant User',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      timestamp: '9:20 AM',
      isOwn: true
    }
  ]
};

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('direct');
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  
  // Filter chat lists based on search query
  const filteredUsers = chatUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredGroups = chatGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get active chat messages
  const activeMessages = selectedChat ? (chatMessages[selectedChat] || []) : [];
  
  // Get chat details based on ID and active tab
  const getActiveChatDetails = () => {
    if (!selectedChat) return null;
    
    if (activeTab === 'direct') {
      return chatUsers.find(u => u.id === selectedChat);
    } else {
      return chatGroups.find(g => g.id === selectedChat);
    }
  };
  
  const activeChatDetails = getActiveChatDetails();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat) return;
    
    // In a real app, this would send a message to the API
    console.log('Sending message:', newMessage, 'to chat:', selectedChat);
    
    setNewMessage('');
    
    // Mock a new message for demo purposes
    if (!chatMessages[selectedChat]) {
      chatMessages[selectedChat] = [];
    }
    
    chatMessages[selectedChat].push({
      id: Date.now().toString(),
      text: newMessage,
      sender: {
        id: user?.id || '',
        name: user?.name || '',
        avatar: user?.avatar
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    });
    
    // Force a re-render
    setSelectedChat(selectedChat);
  };
  
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName) {
      toast.error('Please enter a group name');
      return;
    }
    
    // In a real app, this would call an API to create a new group
    console.log('Creating group:', groupName);
    
    toast.success(`Group "${groupName}" created successfully!`);
    setCreateGroupOpen(false);
    setGroupName('');
  };
  
  // Get status color based on user status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div className="animate-fade-in h-[calc(100vh-9rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Chat</h1>
          <p className="text-muted-foreground">
            Connect with residents and groups in your community
          </p>
        </div>
        
        <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateGroup}>
              <DialogHeader>
                <DialogTitle>Create Group Chat</DialogTitle>
                <DialogDescription>
                  Create a new group chat for your community. You'll be able to add members after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="input-focus"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateGroupOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Group</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-1 gap-4 h-full">
        <Card className="w-80 flex flex-col">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search chats..."
                className="pl-9 input-focus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="direct" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="direct" className="flex-1">Direct Messages</TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="direct" className="mt-0">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  <div className="space-y-1">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((chatUser) => (
                        <button
                          key={chatUser.id}
                          className={`w-full flex items-center p-3 rounded-md transition-colors text-left ${selectedChat === chatUser.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                          onClick={() => setSelectedChat(chatUser.id)}
                        >
                          <div className="relative flex-shrink-0">
                            <Avatar>
                              <AvatarImage src={chatUser.avatar} alt={chatUser.name} />
                              <AvatarFallback>{chatUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(chatUser.status)}`}></span>
                          </div>
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{chatUser.name}</span>
                              {chatUser.unreadCount ? (
                                <Badge variant="default" className="ml-auto">
                                  {chatUser.unreadCount}
                                </Badge>
                              ) : null}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {chatUser.status === 'online' ? (
                                'Online'
                              ) : (
                                `Last seen ${chatUser.lastSeen}`
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="groups" className="mt-0">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  <div className="space-y-1">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <button
                          key={group.id}
                          className={`w-full flex items-center p-3 rounded-md transition-colors text-left ${selectedChat === group.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                          onClick={() => setSelectedChat(group.id)}
                        >
                          <Avatar>
                            <AvatarFallback>
                              <Users className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{group.name}</span>
                              {group.unreadCount ? (
                                <Badge variant="default" className="ml-auto">
                                  {group.unreadCount}
                                </Badge>
                              ) : null}
                            </div>
                            <div className="text-xs text-muted-foreground flex justify-between">
                              <span className="truncate">{group.lastMessage}</span>
                              <span className="text-xs ml-1 whitespace-nowrap">{group.lastMessageTime}</span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No groups found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
        
        <Card className="flex-1 flex flex-col">
          {selectedChat && activeChatDetails ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={activeChatDetails.avatar} />
                    <AvatarFallback>
                      {activeTab === 'direct' ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="font-medium">{activeChatDetails.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {activeTab === 'direct' ? (
                        <span className="flex items-center">
                          <span className={`h-2 w-2 rounded-full mr-1 ${getStatusColor((activeChatDetails as ChatUser).status)}`}></span>
                          {(activeChatDetails as ChatUser).status.charAt(0).toUpperCase() + (activeChatDetails as ChatUser).status.slice(1)}
                        </span>
                      ) : (
                        <span>{(activeChatDetails as ChatGroup).members} members</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {activeTab === 'groups' && (
                  <Button variant="ghost" size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Member
                  </Button>
                )}
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeMessages.length > 0 ? (
                    activeMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex ${message.isOwn ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[80%]`}>
                          {!message.isOwn && (
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={message.sender.avatar} />
                              <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`rounded-xl p-3 ${message.isOwn ? 'bg-primary text-primary-foreground rounded-tr-none mr-2' : 'bg-muted rounded-tl-none'}`}>
                            <p>{message.text}</p>
                            <p className={`text-xs ${message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'} text-right mt-1`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation by sending a message</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="input-focus"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-4">
              <div>
                <div className="bg-muted rounded-full p-6 inline-flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a chat to start messaging</h3>
                <p className="text-muted-foreground max-w-sm">
                  Choose a direct message or group chat from the list to start or continue a conversation
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
