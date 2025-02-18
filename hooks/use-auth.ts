"use client";

import { useRouter } from 'next/navigation';
import { account, databases, USERS_COLLECTION_ID } from '@/lib/appwrite';
import { useState, useEffect } from 'react';
import { Query } from 'appwrite';
import { DATABASE_ID } from '../lib/appwrite';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const checkSession = async () => {
        try {
          const session = await account.get();
          setUser(session);
        } catch (error) {
          setUser(null);
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      };

      checkSession();
    }
  }, [initialized]);

  useEffect(() => {
    if (!loading && user) {
      const checkUserProfile = async () => {
        try {
          const userDoc = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal('userId', user.$id)]
          );
          
          if (userDoc.documents.length > 0) {
            router.replace('/dashboard');
          } else {
            router.replace('/onboarding');
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      };

      checkUserProfile();
    }
  }, [loading, user, router]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const currentURL = window.location.href;
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || currentURL.split('?')[0];
      
      await account.createOAuth2Session(
        'google',
        `${baseURL}`,
        `${baseURL}`
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
      setInitialized(false);
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