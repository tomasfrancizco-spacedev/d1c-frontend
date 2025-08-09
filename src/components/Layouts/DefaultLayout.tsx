"use client";
import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <div className="relative">
        <main className="w-full">
          <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
          <div
            className="w-full"
          >
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
