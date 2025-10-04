import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Code, CheckCircle, Info } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Jain Automart Admin',
  description: 'Site owner dashboard',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <Alert>
          <AlertIcon>
            <CheckCircle className="size-5 text-success" />
          </AlertIcon>
          <div className="flex flex-col gap-1">
            <AlertTitle>Welcome, Site Owner</AlertTitle>
            <AlertDescription>
              You have successfully logged into the Jain Automart admin panel
            </AlertDescription>
          </div>
        </Alert>

        <Alert variant="info">
          <AlertIcon>
            <Info className="size-5" />
          </AlertIcon>
          <div className="flex flex-col gap-1">
            <AlertTitle>Secure Access Confirmed</AlertTitle>
            <AlertDescription>
              This dashboard is protected with secure authentication and rate limiting.
              All admin actions are logged for security purposes.
            </AlertDescription>
          </div>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-success-light">
                  <Shield className="size-5 text-success" />
                </div>
                <CardTitle className="text-base">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bcrypt password hashing with rate limiting enabled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary-light">
                  <Lock className="size-5 text-primary" />
                </div>
                <CardTitle className="text-base">Authentication</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                NextAuth with JWT sessions and middleware protection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Code className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-base">Framework</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Next.js 15 App Router with React 19
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
