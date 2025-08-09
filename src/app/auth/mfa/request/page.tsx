"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthFormContainer from "@/components/AuthFormContainer";

export default function MFARequestPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { publicKey } = useWallet();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call the email API to send verification code
      const response = await fetch("/api/auth/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, walletAddress: publicKey?.toBase58() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store email for the verify page
        localStorage.setItem("mfa-email", email);

        // Navigate to verify page
        router.push("/auth/mfa/verify");
      } else {
        setError(
          data.error || "Failed to send verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div
        className="md:pt-[150px] min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-104px)] bg-[#03211e] flex items-center justify-center p-4"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundPositionY: "0",
          backgroundRepeat: "no-repeat",
        }}
      >
        <AuthFormContainer
          title="Verify your wallet to support your favorite team"
          subtitle="Enter your email to receive a confirmation code"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-md p-3">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md text-[#E6F0F0] placeholder-[#E6F0F0]/50 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={!email || isLoading}
              className="cursor-pointer w-full bg-[#16c0b9]/80 hover:bg-[#16c0b9]/90 disabled:bg-[#104f47] disabled:cursor-not-allowed text-[#06231f] font-medium py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#16c0b9] focus:ring-offset-2 focus:ring-offset-[#19181C]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Confirm email"
              )}
            </button>
          </form>
        </AuthFormContainer>
      </div>
    </DefaultLayout>
  );
}
