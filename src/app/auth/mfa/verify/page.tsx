"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthFormContainer from "@/components/AuthFormContainer";

export default function MFAVerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { publicKey } = useWallet();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail =
      localStorage.getItem("mfa-email") ||
      localStorage.getItem("mfa-completed");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.log("Redirecting to mfa request from mfa verify");
      router.push("/auth/mfa/request");
    }
  }, [router]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    const walletAddress = publicKey?.toBase58();

    if (verificationCode.length !== 6) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call the MFA verification API
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store MFA completion in localStorage for client-side state
        localStorage.setItem(
          "mfa-completed",
          JSON.stringify({
            email,
            timestamp: Date.now(),
          })
        );

        // Clear the email from localStorage since MFA is complete
        localStorage.removeItem("mfa-email");

        // Navigate to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    router.push("/auth/mfa/request");
  };

  const isCodeComplete = code.every((digit) => digit !== "");

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
          title="Enter the verification code"
          subtitle={`Enter the 6 digit code we sent to ${
            email || "your email"
          }`}
          showBackButton={true}
          backButtonHref="/auth/mfa/request"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-md p-3">
                {error}
              </div>
            )}

            {/* 6 input squares for verification code */}
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-8 h-8 sm:w-12 sm:h-12 text-center text-xl font-semibold bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md text-[#E6F0F0] focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:border-transparent transition-all duration-200"
                />
              ))}
            </div>

            {/* Resend code link */}
            <div className="text-center">
              <span className="text-[#E6F0F0]/70 text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="cursor-pointer text-[#15C0B9] hover:text-[#1dd1c7] underline transition-colors duration-200"
                >
                  Resend code
                </button>
              </span>
            </div>

            <button
              type="submit"
              disabled={!isCodeComplete || isLoading}
              className="cursor-pointer w-full disabled:cursor-not-allowed text-[#06231f] bg-[#16c0b9]/80 hover:bg-[#16c0b9]/90 disabled:bg-[#104f47] font-medium py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#16c0b9] focus:ring-offset-2 focus:ring-offset-[#19181C]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify now"
              )}
            </button>
          </form>
        </AuthFormContainer>
      </div>
    </DefaultLayout>
  );
}
