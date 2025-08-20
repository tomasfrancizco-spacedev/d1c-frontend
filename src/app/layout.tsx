import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { SolanaProvider } from "@/providers/SolanaProvider";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "D1C - Division One Crypto",
  description: "Where the passion of college sports meets the future of digital innovation.",
  icons: {
    icon: "/divisionlogo2.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexSans.variable}>
      <body>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
