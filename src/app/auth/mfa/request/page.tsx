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
      <div className="pt-[150px] min-h-screen bg-[#19181C] flex items-center justify-center p-4">
        <AuthFormContainer
          title="Verify you're real"
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
              className="cursor-pointer w-full bg-[#15C0B9] hover:bg-[#1dd1c7] disabled:bg-[#15C0B9]/50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:ring-offset-2 focus:ring-offset-[#19181C]"
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
