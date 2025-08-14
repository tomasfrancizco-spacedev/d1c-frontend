"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import dynamic from "next/dynamic";

const SchoolTable = dynamic(() => import("@/components/Admin/SchoolTable"), {
  ssr: false,
});

const WalletsTable = dynamic(() => import("@/components/Admin/WalletsTable"), {
  ssr: false,
});

const FeeDistributionTable = dynamic(() => import("@/components/Admin/FeeDistributionTable"), {
  ssr: false,
});

const AdminPage = () => {
  return (
    <DefaultLayout>
      <div className="pt-[120px] min-h-screen bg-[#03211e]">
        <div className="container mx-auto px-6 py-10 space-y-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Schools</h2>
              <button className="cursor-pointer px-3 py-2 bg-[#15C0B9] hover:bg-[#15C0B9]/90 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12H20M12 4V20"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Add School
              </button>
            </div>

            <SchoolTable />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Wallets</h2>
            <WalletsTable />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Transactions</h2>
            <FeeDistributionTable />
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminPage;
