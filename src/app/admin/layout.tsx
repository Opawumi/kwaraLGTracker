import AdminLayoutShell from '@/components/admin/AdminLayoutShell';

export const metadata = {
  title: 'Admin Dashboard | kwaraLGTracker',
  description: 'Administrative portal for managing, verifying, and publishing Local Government Area allocation data.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
