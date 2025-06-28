'use client';

import Navbar from '@/components/Navbar';
import { useAuthLoading } from '@/context/AuthContext';

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthLoading();

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen" aria-busy="true" aria-live="polite">
        <p className="text-gray-600 text-lg" role="status">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
