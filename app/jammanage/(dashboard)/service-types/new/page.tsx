import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { ServiceTypeForm } from '@/components/jammanage/ServiceTypeForm';

export const metadata = {
  title: 'New Service Type | Jain Automart Admin',
};

export default async function NewServiceTypePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return (
    <div className="container-fixed">
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <h1 className="text-xl font-semibold text-foreground">
          New Service Type
        </h1>
        <ServiceTypeForm />
      </div>
    </div>
  );
}
