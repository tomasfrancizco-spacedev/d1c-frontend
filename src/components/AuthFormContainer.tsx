import { ReactNode } from 'react';

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
}

export default function AuthFormContainer({
  title,
  subtitle,
  children,
  showBackButton = false,
  backButtonHref = '/',
  backButtonText = 'Back'
}: AuthFormContainerProps) {
  return (
    <div className="w-full max-w-md">
      {/* Back button */}
      {showBackButton && (
        <div className="mb-6">
          <a 
            href={backButtonHref}
            className="inline-flex items-center text-[#E6F0F0]/70 hover:text-[#E6F0F0] transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            {backButtonText}
          </a>
        </div>
      )}

      <div className="min-w-[300px] bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] rounded-md p-8 shadow-2xl">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-[#E6F0F0] mb-2">
            {title}
          </h1>
          <p className="text-[#E6F0F0]/70 text-sm">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
} 