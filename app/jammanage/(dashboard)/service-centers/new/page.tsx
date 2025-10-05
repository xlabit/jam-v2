import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { ServiceCenterForm } from '@/components/jammanage/ServiceCenterForm';

export const metadata = {
  title: 'New Service Center | Jain Automart Admin',
};

export default async function NewServiceCenterPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'owner') {
    redirect('/jammanage');
  }

  return (
    <div className="container-fixed">
      <ServiceCenterForm />
    </div>
  );
}
