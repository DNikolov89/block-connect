import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegistration } from '@/hooks/useRegistration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function Register() {
  const { register, registerWithBlockSpace, loading, error } = useRegistration();
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');

  // Join existing block space form state
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joinFullName, setJoinFullName] = useState('');
  const [joinPhone, setJoinPhone] = useState('');
  const [joinBlockSpaceId, setJoinBlockSpaceId] = useState('');

  // Create new block space form state
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createFullName, setCreateFullName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [blockSpaceName, setBlockSpaceName] = useState('');
  const [blockSpaceAddress, setBlockSpaceAddress] = useState('');
  const [blockSpaceDescription, setBlockSpaceDescription] = useState('');

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email: joinEmail,
        password: joinPassword,
        fullName: joinFullName,
        phone: joinPhone,
        blockSpaceId: joinBlockSpaceId,
        role: 'tenant',
      });
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      toast.error(error || 'Registration failed. Please try again.');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerWithBlockSpace(
        {
          email: createEmail,
          password: createPassword,
          fullName: createFullName,
          phone: createPhone,
        },
        {
          name: blockSpaceName,
          address: blockSpaceAddress,
          description: blockSpaceDescription,
        }
      );
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      toast.error(error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto max-w-md py-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'join' | 'create')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="join">Join Block Space</TabsTrigger>
          <TabsTrigger value="create">Create Block Space</TabsTrigger>
        </TabsList>

        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>Join a Block Space</CardTitle>
              <CardDescription>
                Enter your details to join an existing block space
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleJoinSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="join-email">Email</Label>
                  <Input
                    id="join-email"
                    type="email"
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-password">Password</Label>
                  <Input
                    id="join-password"
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-full-name">Full Name</Label>
                  <Input
                    id="join-full-name"
                    value={joinFullName}
                    onChange={(e) => setJoinFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-phone">Phone (optional)</Label>
                  <Input
                    id="join-phone"
                    type="tel"
                    value={joinPhone}
                    onChange={(e) => setJoinPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-block-space">Block Space ID</Label>
                  <Input
                    id="join-block-space"
                    value={joinBlockSpaceId}
                    onChange={(e) => setJoinBlockSpaceId(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a Block Space</CardTitle>
              <CardDescription>
                Set up your own block space and become an owner
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-full-name">Full Name</Label>
                  <Input
                    id="create-full-name"
                    value={createFullName}
                    onChange={(e) => setCreateFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-phone">Phone (optional)</Label>
                  <Input
                    id="create-phone"
                    type="tel"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-space-name">Block Space Name</Label>
                  <Input
                    id="block-space-name"
                    value={blockSpaceName}
                    onChange={(e) => setBlockSpaceName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-space-address">Block Space Address</Label>
                  <Input
                    id="block-space-address"
                    value={blockSpaceAddress}
                    onChange={(e) => setBlockSpaceAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-space-description">Description (optional)</Label>
                  <Input
                    id="block-space-description"
                    value={blockSpaceDescription}
                    onChange={(e) => setBlockSpaceDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Block Space'}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
