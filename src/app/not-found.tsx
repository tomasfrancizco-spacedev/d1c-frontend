import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function NotFound() {
  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-gradient-to-br from-[#19181C] via-[#1a2024] to-[#19181C]">
        <main className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center text-[#E6F0F0]">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
            <p className="text-lg mb-8 text-[#E6F0F0]/80">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#15C0B9] hover:bg-[#1dd1c7] text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:ring-offset-2 focus:ring-offset-[#19181C]"
            >
              Go Home
            </Link>
          </div>
        </main>
      </div>
    </DefaultLayout>
  );
}
