'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import AuthFormContainer from '@/components/AuthFormContainer';

export default function MFAVerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('mfa-email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

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
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) return;
    
    setIsLoading(true);
    
    try {
      // TODO: Add API call to verify code
      // await verifyCode(verificationCode);
      
      console.log('Verification code:', verificationCode);
      
      // Navigate to dashboard or success page
      router.push('/dashboard');
    } catch (error) {
      console.error('Error verifying code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    router.push('/auth/mfa/request');
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-[#19181C] flex items-center justify-center p-4">
        <AuthFormContainer
          title="Enter the verification code"
          subtitle={`Enter the 6 digit code we sent to ${email || 'your email'}`}
          showBackButton={true}
          backButtonHref="/auth/mfa/request"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 input squares for verification code */}
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#E6F0F0] focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:border-transparent transition-all duration-200"
                />
              ))}
            </div>

            {/* Resend code link */}
            <div className="text-center">
              <span className="text-[#E6F0F0]/70 text-sm">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[#15C0B9] hover:text-[#1dd1c7] underline transition-colors duration-200"
                >
                  Resend code
                </button>
              </span>
            </div>

            <button
              type="submit"
              disabled={!isCodeComplete || isLoading}
              className="w-full bg-[#15C0B9] hover:bg-[#1dd1c7] disabled:bg-[#15C0B9]/50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:ring-offset-2 focus:ring-offset-[#19181C]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify now'
              )}
            </button>
          </form>
        </AuthFormContainer>
      </div>
    </DefaultLayout>
  );
}