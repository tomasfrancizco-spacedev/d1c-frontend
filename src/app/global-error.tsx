'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect } from "react";

export default function GlobalError({
  error,  
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DefaultLayout>
        <div className="pt-[150px] min-h-screen bg-gradient-to-br from-[#19181C] via-[#1a2024] to-[#19181C] flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center text-[#E6F0F0] p-6">
            <h1 className="text-6xl font-bold mb-4">Error</h1>
            <h2 className="text-2xl font-semibold mb-6">Global Error</h2>
            <p className="text-lg mb-8">Something went wrong!</p>
            <button
              onClick={() => reset()}
              className="bg-[#15C0B9] hover:bg-[#1dd1c7] text-white font-medium py-3 px-6 rounded-md"
            >
              Try again
            </button>
          </div>
        </div>
    </DefaultLayout>
  );
}