import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Download,
  Eye,
  File,
  FileText,
  Filter,
  Image,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Document {
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

const documentsList: Document[] = [
  {
    id: '1',
    name: 'Building_Rules_2023.pdf',
    type: 'pdf',
    size: '2.4 MB',
    category: 'Rules & Regulations',
    uploadedBy: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    uploadDate: '2023-06-15',
    status: 'approved',
    description: 'Official building rules and regulations updated for 2023.'
  },
  {
    id: '2',
    name: 'Community_Meeting_Minutes_July.pdf',
    type: 'pdf',
    size: '1.8 MB',
    category: 'Meeting Minutes',
    uploadedBy: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    uploadDate: '2023-07-05',
    status: 'approved',
    description: 'Minutes from the July community meeting.'
  },
  {
    id: '3',
    name: 'Pool_Maintenance_Schedule.doc',
    type: 'doc',
    size: '820 KB',
    category: 'Maintenance',
    uploadedBy: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    uploadDate: '2023-05-20',
    status: 'approved',
    description: 'Schedule for pool maintenance throughout the year.'
  },
  {
    id: '4',
    name: 'Emergency_Contact_List.pdf',
    type: 'pdf',
    size: '1.2 MB',
    category: 'Emergency',
    uploadedBy: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    uploadDate: '2023-04-10',
    status: 'approved',
    description: 'List of emergency contacts for the building.'
  },
  {
    id: '5',
    name: 'Water_Damage_Report_Unit_403.pdf',
    type: 'pdf',
    size: '3.5 MB',
    category: 'Incident Reports',
    uploadedBy: {
      id: '2',
      name: 'Owner User',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Owner'
    },
    uploadDate: '2023-07-28',
    status: 'pending',
    description: 'Report of water damage in Unit 403.'
  },
  {
    id: '6',
    name: 'Building_Insurance_Policy.pdf',
    type: 'pdf',
    size: '4.2 MB',
    category: 'Insurance',
    uploadedBy: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Admin'
    },
    uploadDate: '2023-03-15',
    status: 'approved',
    description: 'Current insurance policy for the building.'
  },
  {
    id: '7',
    name: 'Summer_BBQ_Flyer.jpg',
    type: 'image',
    size: '1.7 MB',
    category: 'Events',
    uploadedBy: {
      id: '3',
      name: 'Tenant User',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Tenant'
    },
    uploadDate: '2023-07-01',
    status: 'approved',
    description: 'Flyer for the upcoming summer BBQ.'
  }
];

const categories = [
  'All Categories',
  'Rules & Regulations',
  'Meeting Minutes',
  'Maintenance',
  'Emergency',
  'Incident Reports',
  'Insurance',
  'Events',
  'Other'
];

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const filteredDocuments = documentsList.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All Categories' || doc.category === activeCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && doc.status === 'pending') || 
                      (activeTab === 'approved' && doc.status === 'approved');
    
    return matchesSearch && matchesCategory && matchesTab;
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentTitle || !documentCategory || !selectedFile) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }
    
    console.log('Uploading document:', {
      title: documentTitle,
      category: documentCategory,
      description: documentDescription,
      file: selectedFile
    });
    
    toast.success('Document uploaded successfully!');
    setUploadDialogOpen(false);
    setDocumentTitle('');
    setDocumentCategory('');
    setDocumentDescription('');
    setSelectedFile(null);
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'image':
        return <Image className="h-10 w-10 text-blue-500" />;
      case 'doc':
        return <FileText className="h-10 w-10 text-blue-600" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleDownload = (document: Document) => {
    console.log('Downloading document:', document.name);
    toast.success(`Downloading ${document.name}`);
  };
  
  const handleApprove = (document: Document) => {
    console.log('Approving document:', document.id);
    toast.success(`Document "${document.name}" approved`);
  };
  
  const handleDelete = (document: Document) => {
    console.log('Deleting document:', document.id);
    toast.success(`Document "${document.name}" deleted`);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Access and manage important documents for your community
          </p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleUpload}>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document to share with your community. {isAdmin ? 'It will be immediately available to all users.' : 'It will be reviewed by an admin before being published.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter document title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="input-focus"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={documentCategory} onValueChange={setDocumentCategory}>
                    <SelectTrigger id="category" className="input-focus">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'All Categories').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="Enter document description"
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="input-focus"
                    required
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected file: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Categories</h3>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9 input-focus"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-18rem)]">
                <div className="flex flex-col">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`flex justify-between items-center px-6 py-3 text-left transition-colors hover:bg-muted/50 ${activeCategory === category ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      <span>{category}</span>
                      <Badge variant="outline">
                        {category === 'All Categories'
                          ? documentsList.length
                          : documentsList.filter(doc => doc.category === category).length}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {isAdmin && (
            <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center">
                  Pending Approval
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                    {documentsList.filter(doc => doc.status === 'pending').length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document) => (
                <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center gap-4 space-y-0">
                    {getDocumentIcon(document.type)}
                    <div className="overflow-hidden">
                      <h3 className="font-medium truncate" title={document.name}>
                        {document.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {document.size}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex flex-col space-y-2">
                      <Badge className="self-start" variant="outline">
                        {document.category}
                      </Badge>
                      {document.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={document.uploadedBy.avatar} />
                            <AvatarFallback>{document.uploadedBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground ml-2">
                            {document.uploadedBy.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground ml-1">
                            {formatDate(document.uploadDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    {document.status === 'pending' && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
                        Pending Approval
                      </Badge>
                    )}
                    {document.status === 'approved' && (
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(document)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {document.status === 'approved' && (
                          <DropdownMenuItem onClick={() => handleDownload(document)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {isAdmin && document.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleApprove(document)}>
                            <Badge className="h-4 w-4 mr-2 bg-green-500" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {isAdmin && (
                          <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(document)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-muted inline-flex rounded-full p-6 mb-4">
                  <File className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? `No documents match your search "${searchQuery}"`
                    : 'No documents available in this category'}
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
