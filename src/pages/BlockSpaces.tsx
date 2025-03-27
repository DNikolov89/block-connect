import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBlockSpaces } from '@/hooks/useBlockSpaces';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Search, Plus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const blockSpaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  total_flats: z.number().min(1, 'Must have at least 1 flat'),
  total_floors: z.number().min(1, 'Must have at least 1 floor'),
});

type BlockSpaceFormValues = z.infer<typeof blockSpaceSchema>;

export default function BlockSpaces() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { blockSpaces, isLoading, createBlockSpace, updateBlockSpace, deleteBlockSpace } = useBlockSpaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<BlockSpaceFormValues>({
    resolver: zodResolver(blockSpaceSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      total_flats: 1,
      total_floors: 1,
    },
  });

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const filteredBlockSpaces = blockSpaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (values: BlockSpaceFormValues) => {
    try {
      await createBlockSpace({ input: values, userId: user.id });
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to create block space');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this block space?')) {
      try {
        await deleteBlockSpace(id);
      } catch (error) {
        toast.error('Failed to delete block space');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Block Spaces</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search block spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Block Space
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Block Space</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="total_flats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Flats</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="total_floors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Floors</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Block Space
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Flats</TableHead>
              <TableHead>Floors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlockSpaces.map((space) => (
              <TableRow key={space.id}>
                <TableCell>{space.name}</TableCell>
                <TableCell>{space.address}</TableCell>
                <TableCell>{space.total_flats}</TableCell>
                <TableCell>{space.total_floors}</TableCell>
                <TableCell className="capitalize">{space.status}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDelete(space.id)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 