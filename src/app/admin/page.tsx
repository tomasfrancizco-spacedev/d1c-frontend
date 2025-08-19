"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminStatus } from "@/lib/auth-utils";
import { useSIWS } from "@/hooks/useSIWS";

const FeeManagement = dynamic(() => import("@/components/Admin/FeeManagement"), {
  ssr: false,
});

const WalletsTable = dynamic(() => import("@/components/Admin/WalletsTable"), {
  ssr: false,
});

const AdminsTable = dynamic(() => import("@/components/Admin/AdminsTable"), {
  ssr: false,
});

const SchoolTable = dynamic(() => import("@/components/Admin/SchoolTable"), {
  ssr: false,
});

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { connected, isAuthenticated } = useSIWS();

  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      try {
        // Check authentication status via API (which reads httpOnly cookies)
        const { isAuthenticated, isAdmin: adminStatus } = await checkAdminStatus();

        if (!isAuthenticated) {
          // Not authenticated, redirect to home
          router.push('/');
          return;
        }

        if (!adminStatus) {
          // Authenticated but not admin, redirect to dashboard
          router.push('/dashboard');
          return;
        }

        setIsAdmin(adminStatus);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.push('/');
      }
    };

    checkAuthAndAdmin();
  }, [connected, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading || isAdmin === null) {
    return (
      <DefaultLayout>
        <div className="pt-[120px] min-h-screen bg-[#03211e] flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
        </div>
      </DefaultLayout>
    );
  }

  // Only render admin content if user is confirmed admin
  if (!isAdmin) {
    return (
      <DefaultLayout>
        <div className="pt-[120px] min-h-screen bg-[#03211e] flex items-center justify-center">
          <div className="text-white text-xl">Access Denied</div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="pt-[120px] min-h-screen bg-[#03211e]">
        <div className="container mx-auto px-6 py-10 space-y-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

          <section className="space-y-4">
            <FeeManagement />
          </section>

          <section className="space-y-4">
            <WalletsTable />
          </section>
          
          <section className="space-y-4">
            <AdminsTable />
          </section>

          <section className="space-y-4">
            <SchoolTable />
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminPage;
