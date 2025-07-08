import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/providers/SolanaProvider";

export const metadata: Metadata = {
  title: "D1C - Division One Crypto",
  description: "Where the passion of college sports meets the future of digital innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
