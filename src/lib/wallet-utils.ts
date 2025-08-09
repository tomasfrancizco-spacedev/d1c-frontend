/**
 * Utility functions for mobile wallet detection and handling
 */

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isPhantomInstalled = () => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).phantom?.solana;
};

export const openPhantomDeepLink = (url?: string) => {
  const baseUrl = url || window.location.href;
  
  if (isMobile()) {
    // On mobile, use Phantom's universal link that opens the app with your website
    const phantomUniversalLink = `https://phantom.app/ul/browse/${encodeURIComponent(baseUrl)}?ref=${encodeURIComponent(window.location.hostname)}`;
    window.open(phantomUniversalLink, '_blank');
  } else {
    // On desktop, open Phantom extension download
    window.open('https://phantom.app/', '_blank');
  }
};

// Enhanced mobile wallet handling - opens the actual wallet APPS with your website
export const openWalletInAppBrowser = (walletName: string) => {
  const currentUrl = window.location.href;
  
  switch (walletName.toLowerCase()) {
    case 'phantom':
      // Use Phantom's universal link format that opens the app with your website
      const phantomUniversalLink = `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=${encodeURIComponent(window.location.hostname)}`;
      
      // This should open Phantom app and navigate to your website within it
      window.open(phantomUniversalLink, '_blank');
      break;
      
    case 'solflare':
      // Use Solflare's universal link format that opens the app with your website  
      const solflareUniversalLink = `https://solflare.com/ul/browse/${encodeURIComponent(currentUrl)}`;
      
      // This should open Solflare app and navigate to your website within it
      window.open(solflareUniversalLink, '_blank');
      break;
      
    default:
      // Fallback for unknown wallets
      navigator.clipboard?.writeText(currentUrl);
      alert(`Copy this URL and open it in your ${walletName} wallet app's browser:\n\n${currentUrl}`);
  }
};

// Alternative function for manual instructions (if deep links fail)
export const showWalletInstructions = (walletName: string) => {
  const currentUrl = window.location.href;
  
  const instructions: Record<string, { steps: string[] }> = {
    phantom: {
      steps: [
        '1. Copy this URL (we\'ll do it for you)',
        '2. Open Phantom app on your phone',
        '3. Tap the browser/globe icon at the bottom',
        '4. Paste the URL and go to this page',
        '5. Connect your wallet'
      ]
    },
    solflare: {
      steps: [
        '1. Copy this URL (we\'ll do it for you)',
        '2. Open Solflare app on your phone',
        '3. Tap "Explore" tab at the bottom',
        '4. Paste the URL and go to this page',
        '5. Connect your wallet'
      ]
    }
  };
  
  const wallet = instructions[walletName.toLowerCase()];
  if (wallet) {
    navigator.clipboard?.writeText(currentUrl);
    alert(`Manual steps for ${walletName}:\n\n${wallet.steps.join('\n')}\n\n✅ URL copied to clipboard!`);
  }
};

// Legacy function - keeping for backwards compatibility
export const openWalletDeepLink = (walletName: string) => {
  // Redirect to new function
  openWalletInAppBrowser(walletName);
};

// Function to check if app opened successfully
export const didAppOpen = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        resolve(true); // App likely opened
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
    
    // If page is still visible after 2 seconds, app probably didn't open
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resolve(false);
    }, 2000);
  });
};

export const isInMobileWalletBrowser = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check if we're inside a wallet's in-app browser
  return (
    userAgent.includes('phantom') ||
    userAgent.includes('solflare')
  );
};

export const getMobileWalletAdapter = () => {
  if (typeof window === 'undefined') return null;
  
  // When inside a wallet's browser, the wallet should be auto-detected
  if (isInMobileWalletBrowser()) {
    // Check for wallet objects that get injected in mobile browsers
    if ((window as any).phantom?.solana) return 'phantom';
    if ((window as any).solflare) return 'solflare';
  }
  
  return null;
};

export const getMobileWalletUrl = (walletName: string) => {
  const urls: Record<string, string> = {
    phantom: 'https://phantom.app/',
    solflare: 'https://solflare.com/'
  };
  
  return urls[walletName.toLowerCase()] || '';
};

export const detectMobileWallet = () => {
  if (typeof window === 'undefined') return null;
  
  // Check for Phantom
  if ((window as any).phantom?.solana) {
    return 'phantom';
  }
  
  // Check for Solflare
  if ((window as any).solflare) {
    return 'solflare';
  }
  
  return null;
}; 