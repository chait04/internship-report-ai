"use client";

import { useRouter } from 'next/navigation';
import { account, DATABASE_ID, databases, USERS_COLLECTION_ID } from '@/lib/appwrite';
import { useState, useEffect } from 'react';
import { Query } from 'appwrite';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser(session);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const currentURL = window.location.href;
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || currentURL.split('?')[0];
      
      await account.createOAuth2Session(
        'google',
        `${baseURL}/dashboard`,  // Success URL
        `${baseURL}`   // Failure URL
      );
    } catch (error) {
      console.error('OAuth error:', error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
}