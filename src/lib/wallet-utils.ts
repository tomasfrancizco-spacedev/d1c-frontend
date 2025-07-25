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
  const phantomUrl = `https://phantom.app/ul/browse/${encodeURIComponent(baseUrl)}?ref=${encodeURIComponent(window.location.hostname)}`;
  
  if (isMobile()) {
    // On mobile, try to open Phantom app directly
    window.open(phantomUrl, '_blank');
  } else {
    // On desktop, open Phantom extension download
    window.open('https://phantom.app/', '_blank');
  }
};

export const getMobileWalletUrl = (walletName: string) => {
  const urls: Record<string, string> = {
    phantom: 'https://phantom.app/',
    solflare: 'https://solflare.com/',
    trust: 'https://trustwallet.com/',
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
  
  // Check for other mobile wallets
  if ((window as any).trustwallet) {
    return 'trust';
  }
  
  return null;
}; 