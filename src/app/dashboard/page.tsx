import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Dashboard() {
  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-gradient-to-br from-[#19181C] via-[#1a2024] to-[#19181C]">
        <main className="container mx-auto px-6 py-16 text-[#E6F0F0]">
          <div className="max-w-4xl mx-auto text-center">
            Dashboard
          </div>
        </main>
      </div>
    </DefaultLayout>
  );
}