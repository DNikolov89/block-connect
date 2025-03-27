import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBlockSpaces } from '@/hooks/useBlockSpaces';

// Schema for block space creation (admin + block space)
const blockSpaceCreationSchema = z.object({
  // Admin account details
  adminName: z.string().min(1, 'Name is required'),
  adminEmail: z.string().email('Invalid email address'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  // Block space details
  blockSpaceName: z.string().min(1, 'Block space name is required'),
  address: z.string().min(1, 'Address is required'),
  totalFlats: z.number().min(1, 'Must have at least 1 flat'),
  totalFloors: z.number().min(1, 'Must have at least 1 floor'),
  description: z.string().optional(),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for regular user registration
const userRegistrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['owner', 'tenant']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type BlockSpaceCreationValues = z.infer<typeof blockSpaceCreationSchema>;
type UserRegistrationValues = z.infer<typeof userRegistrationSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const { createBlockSpace } = useBlockSpaces();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is creating a block space
  const isBlockSpaceCreation = searchParams.get('role') === 'admin';

  const blockSpaceForm = useForm<BlockSpaceCreationValues>({
    resolver: zodResolver(blockSpaceCreationSchema),
    defaultValues: {
      adminName: '',
      adminEmail: '',
      adminPassword: '',
      confirmPassword: '',
      blockSpaceName: '',
      address: '',
      totalFlats: 1,
      totalFloors: 1,
      description: '',
    },
  });

  const userForm = useForm<UserRegistrationValues>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'tenant',
    },
  });

  const handleBlockSpaceCreation = async (values: BlockSpaceCreationValues) => {
    try {
      setIsLoading(true);
      // First, register the admin user
      const adminResult = await register({
        name: values.adminName,
        email: values.adminEmail,
        password: values.adminPassword,
        role: 'admin',
      });

      if (adminResult.data) {
        // Then create the block space
        const blockSpaceResult = await createBlockSpace({
          input: {
            name: values.blockSpaceName,
            address: values.address,
            total_flats: values.totalFlats,
            total_floors: values.totalFloors,
            description: values.description,
          },
          userId: adminResult.data.id,
        });

        if (blockSpaceResult.data) {
          toast.success('Block space created successfully');
          navigate('/login');
        }
      }
    } catch (error) {
      toast.error('Failed to create block space');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRegistration = async (values: UserRegistrationValues) => {
    try {
      setIsLoading(true);
      const result = await register(values);
      if (result.data) {
        toast.success('Registration successful. You can now apply to join a block space.');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isBlockSpaceCreation) {
    return (
      <div className="container max-w-lg mx-auto py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Create Block Space</h1>
            <p className="text-muted-foreground">
              Set up your block space and create your administrator account
            </p>
          </div>

          <Form {...blockSpaceForm}>
            <form onSubmit={blockSpaceForm.handleSubmit(handleBlockSpaceCreation)} className="space-y-6">
              {/* Administrator Account Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Administrator Account</h2>
                <FormField
                  control={blockSpaceForm.control}
                  name="adminName"
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
                  control={blockSpaceForm.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={blockSpaceForm.control}
                  name="adminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={blockSpaceForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Block Space Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Block Space Details</h2>
                <FormField
                  control={blockSpaceForm.control}
                  name="blockSpaceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Block Space Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={blockSpaceForm.control}
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
                    control={blockSpaceForm.control}
                    name="totalFlats"
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
                    control={blockSpaceForm.control}
                    name="totalFloors"
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

                <FormField
                  control={blockSpaceForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
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

          <div className="text-center text-sm">
            Already managing a block space?{' '}
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Regular user registration form
  return (
    <div className="container max-w-lg mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Join your block's community as an owner or tenant
          </p>
        </div>

        <Form {...userForm}>
          <form onSubmit={userForm.handleSubmit(handleUserRegistration)} className="space-y-4">
            <FormField
              control={userForm.control}
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
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={userForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={userForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={userForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="tenant">Tenant</option>
                      <option value="owner">Owner</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Select your role in the block space. You'll need to be approved by an administrator.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
