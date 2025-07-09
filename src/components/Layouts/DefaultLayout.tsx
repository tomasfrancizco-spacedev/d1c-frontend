"use client";
import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="relative min-h-screen">
        {/* <!-- ===== Main Content Start ===== --> */}
        <main className="w-full">
          {/* <!-- ===== Navbar Start ===== --> */}
          <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
          {/* <!-- ===== Navbar End ===== --> */}
          <div className="w-full">{children}</div>
        </main>
        {/* <!-- ===== Main Content End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
