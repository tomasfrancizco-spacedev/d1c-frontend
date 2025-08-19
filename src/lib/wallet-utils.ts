/**
 * Utility functions for mobile wallet detection and handling
 */

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const openPhantomDeepLink = (url?: string) => {
  const baseUrl = url || window.location.href;
  
  if (isMobile()) {
    // On mobile, use Phantom's universal link that opens the app with D1C website
    const phantomUniversalLink = `https://phantom.app/ul/browse/${encodeURIComponent(baseUrl)}?ref=${encodeURIComponent(window.location.hostname)}`;
    window.open(phantomUniversalLink, '_blank');
  } else {
    // On desktop, open Phantom extension download
    window.open('https://phantom.app/', '_blank');
  }
};

// Enhanced mobile wallet handling - opens the actual wallet APPS with D1C website
export const openWalletInAppBrowser = (walletName: string) => {
  const currentUrl = window.location.href;

  console.log("currentUrl", currentUrl);
  
  switch (walletName.toLowerCase()) {
    case 'phantom':
      // Use Phantom's universal link format that opens the app with D1c website
      const phantomUniversalLink = `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=${encodeURIComponent(window.location.hostname)}`;
      
      // This should open Phantom app and navigate to D1C website within it
      window.open(phantomUniversalLink, '_blank');
      break;
      
    case 'solflare':
      // Use Solflare's universal link format that opens the app with D1C website  
      const solflareUniversalLink = `https://solflare.com/ul/browse/${encodeURIComponent(currentUrl)}?ref=${encodeURIComponent(window.location.hostname)}`;
      
      // This should open Solflare app and navigate to D1C website within it
      window.open(solflareUniversalLink, '_blank');
      break;
      
    default:
      // Fallback for unknown wallets
      navigator.clipboard?.writeText(currentUrl);
      alert(`Copy this URL and open it in your ${walletName} wallet app's browser:\n\n${currentUrl}`);
  }
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