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