'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import AuthFormContainer from '@/components/AuthFormContainer';

export default function MFARequestPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      // Store email for the verify page
      localStorage.setItem('mfa-email', email);
      
      // TODO: Add API call to send verification code
      // await sendVerificationCode(email);
      
      // Navigate to verify page
      router.push('/auth/mfa/verify');
    } catch (error) {
      console.error('Error sending verification code:', error);
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
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#E6F0F0] placeholder-[#E6F0F0]/50 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={!email || isLoading}
              className="w-full bg-[#15C0B9] hover:bg-[#1dd1c7] disabled:bg-[#15C0B9]/50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:ring-offset-2 focus:ring-offset-[#19181C]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Confirm email'
              )}
            </button>
          </form>
        </AuthFormContainer>
      </div>
    </DefaultLayout>
  );
}