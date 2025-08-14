"use client";
import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';
import { createSignInData, verifySIWSMessage } from '@/lib/siws';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/navigation';

export interface AuthState {
  isAuthenticated: boolean;
  publicKey: PublicKey | null;
  signInData?: SolanaSignInInput;
  signInOutput?: SolanaSignInOutput;
}

export function useSIWS() {
  const { connected, publicKey, signIn, disconnect, connect } = useWallet();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    publicKey: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const authenticate = useCallback(async () => {
    console.log("Connected:", connected);
    console.log("Authenticating...");

    if (!connected) {
      console.log("Connecting...");
      await connect();
      console.log("Connected:", connected);
    }

    if (!signIn || !publicKey) {
      throw new Error('Wallet not connected or does not support sign in');
    }
    console.log("Authenticating...");

    setIsLoading(true);
    try {
      const signInData = createSignInData();

      console.log("Sign in data created");

      console.log("Sign in data:", signInData);
      let signInOutput;
      try {
        signInOutput = await signIn(signInData); // @tomas fails when metamask is logged out
      } catch (error) {
        if (error instanceof Error && error.message?.includes("Internal JSON-RPC error")) {
          throw new Error("Please unlock your wallet and try again.");
        }
        throw error;
      }

      console.log("Sign in output:", signInOutput);

      // Verify the signed message
      const isValid = await verifySIWSMessage(signInData, signInOutput);

      console.log("Is valid:", isValid);

      if (isValid) {
        const timestamp = Date.now();

        // Set authentication cookie via API
        const response = await fetch('/api/auth/siws', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicKey: publicKey.toString(),
            timestamp
          }),
        });

        console.log("Response:", response);

        if (!response.ok) {
          throw new Error('Failed to set authentication cookie');
        }

        console.log("Setting auth state...");

        setAuthState({
          isAuthenticated: true,
          publicKey,
          signInData,
          signInOutput,
        });

        console.log("Auth state set");

        // Keep localStorage for client-side state
        localStorage.setItem('siws-auth', JSON.stringify({
          publicKey: publicKey.toString(),
          timestamp,
        }));

        // Check if user has completed MFA
        const mfaAuth = localStorage.getItem('mfa-completed');
        if (mfaAuth) {
          router.push('/dashboard');
        } else {
          router.push('/auth/mfa/request');
        }

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
  }, [signIn, publicKey, router]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear authentication cookies via API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Failed to clear authentication cookies');
      }

      await disconnect();
      setAuthState({
        isAuthenticated: false,
        publicKey: null,
      });

      // Clear localStorage
      localStorage.removeItem('siws-auth');
      localStorage.removeItem('mfa-completed');
      localStorage.removeItem('mfa-email');

      // Redirect to landing page
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [disconnect, router]);

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

  // Automatically check for persisted auth when wallet connection changes
  useEffect(() => {
    checkPersistedAuth();
  }, [checkPersistedAuth]);

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