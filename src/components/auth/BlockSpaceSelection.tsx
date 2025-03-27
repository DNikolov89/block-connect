import { useState } from 'react';
import { useBlockSpaces } from '@/hooks/useBlockSpaces';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loader2, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

const blockSpaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  total_flats: z.number().min(1, 'Must have at least 1 flat'),
  total_floors: z.number().min(1, 'Must have at least 1 floor'),
});

type BlockSpaceFormValues = z.infer<typeof blockSpaceSchema>;

interface BlockSpaceSelectionProps {
  userId: string;
  onSelect: (blockSpaceId: string) => void;
}

export function BlockSpaceSelection({ userId, onSelect }: BlockSpaceSelectionProps) {
  const { blockSpaces, isLoading, createBlockSpace, createApplication } = useBlockSpaces();
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

  const filteredBlockSpaces = blockSpaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (values: BlockSpaceFormValues) => {
    try {
      const result = await createBlockSpace({ input: values, userId });
      if (result.data) {
        onSelect(result.data.id);
        setIsCreateDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      toast.error('Failed to create block space');
    }
  };

  const handleSelect = async (blockSpaceId: string) => {
    try {
      await createApplication({ userId, blockSpaceId });
      onSelect(blockSpaceId);
    } catch (error) {
      toast.error('Failed to apply for block space');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Select or Create Block Space</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Block Space
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search block spaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredBlockSpaces.map((space) => (
          <div
            key={space.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
            onClick={() => handleSelect(space.id)}
          >
            <div>
              <h3 className="font-medium">{space.name}</h3>
              <p className="text-sm text-muted-foreground">{space.address}</p>
            </div>
            <Button variant="outline">Select</Button>
          </div>
        ))}
      </div>
    </div>
  );
} 