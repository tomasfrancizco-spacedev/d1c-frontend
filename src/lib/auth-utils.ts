export const checkFullAuth = (connected: boolean, isAuthenticated: boolean) => {
  if (typeof window === "undefined") return;
  
  const mfaCompleted = localStorage.getItem('mfa-completed');
  const hasValidMFA = mfaCompleted ? (() => {
    try {
      const mfaData = JSON.parse(mfaCompleted);
      const isExpired = Date.now() - mfaData.timestamp > 24 * 60 * 60 * 1000; // 24 hours
      return !isExpired;
    } catch {
      return false;
    }
  })() : false;
  
  return connected && isAuthenticated && hasValidMFA;
};

export const checkAdminStatus = async (): Promise<{ isAuthenticated: boolean; isAdmin: boolean }> => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, isAdmin: false };
  }
  
  try {
    const response = await fetch('/api/auth/check-admin', {
      method: 'GET',
      credentials: 'include', // Include httpOnly cookies
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        isAuthenticated: data.isAuthenticated || false,
        isAdmin: data.isAdmin || false,
      };
    }
    
    return { isAuthenticated: false, isAdmin: false };
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return { isAuthenticated: false, isAdmin: false };
  }
};