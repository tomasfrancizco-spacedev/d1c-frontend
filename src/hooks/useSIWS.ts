"use client";

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';
import { createSignInData, verifySIWSMessage } from '@/lib/siws';
import { PublicKey } from '@solana/web3.js';

export interface AuthState {
  isAuthenticated: boolean;
  publicKey: PublicKey | null;
  signInData?: SolanaSignInInput;
  signInOutput?: SolanaSignInOutput;
}

export function useSIWS() {
  const { connected, publicKey, signIn, disconnect } = useWallet();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    publicKey: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const authenticate = useCallback(async () => {
    if (!signIn || !publicKey) {
      throw new Error('Wallet not connected or does not support sign in');
    }

    setIsLoading(true);
    try {
      const signInData = createSignInData();
      
      const signInOutput = await signIn(signInData);
      
      // Verify the signed message
      const isValid = await verifySIWSMessage(signInData, signInOutput);
      
      if (isValid) {
        setAuthState({
          isAuthenticated: true,
          publicKey,
          signInData,
          signInOutput,
        });
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('siws-auth', JSON.stringify({
          publicKey: publicKey.toString(),
          timestamp: Date.now(),
        }));

        // TODO: redirect to mfa page
        
        return { success: true, signInData, signInOutput };
      } else {
        throw new Error('Failed to verify signed message');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthState({
        isAuthenticated: false,
        publicKey: null,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [signIn, publicKey]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await disconnect();
      setAuthState({
        isAuthenticated: false,
        publicKey: null,
      });
      localStorage.removeItem('siws-auth');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [disconnect]);

  const checkPersistedAuth = useCallback(() => {
    if (!connected || !publicKey) {
      setAuthState({
        isAuthenticated: false,
        publicKey: null,
      });
      return;
    }

    const stored = localStorage.getItem('siws-auth');
    if (stored) {
      try {
        const { publicKey: storedKey, timestamp } = JSON.parse(stored);
        
        // Check if auth is still valid (24 hours)
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
        
        if (!isExpired && storedKey === publicKey.toString()) {
          setAuthState({
            isAuthenticated: true,
            publicKey,
          });
        } else {
          localStorage.removeItem('siws-auth');
        }
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem('siws-auth');
      }
    }
  }, [connected, publicKey]);

  return {
    // Wallet connection state
    connected,
    publicKey,
    
    // Authentication state
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    
    // Actions
    authenticate,
    logout,
    checkPersistedAuth,
    
    // Auth data
    signInData: authState.signInData,
    signInOutput: authState.signInOutput,
  };
} 