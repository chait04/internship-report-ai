import { Query } from 'appwrite';
import { databases, DATABASE_ID, USERS_COLLECTION_ID, REPORTS_COLLECTION_ID } from './appwrite';

export const createUser = async (userId: string, userData: any) => {
  console.log('Creating user with data:', { userId, ...userData });
  try {
    // Remove email from userData if it exists
    const { email, ...userDataWithoutEmail } = userData;
    
    const result = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      'unique()',
      {
        userId,
        ...userDataWithoutEmail,
        createdAt: new Date().toISOString(),
      }
    );
    console.log('User created:', result);
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    return response.documents[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const createReport = async (userId: string, reportData: any) => {
  return await databases.createDocument(
    DATABASE_ID,
    REPORTS_COLLECTION_ID,
    'unique()',
    {
      userId,
      ...reportData,
      createdAt: new Date().toISOString(),
    }
  );
};

export const getUserReports = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      REPORTS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const updateReport = async (reportId: string, reportData: any) => {
  return await databases.updateDocument(
    DATABASE_ID,
    REPORTS_COLLECTION_ID,
    reportId,
    reportData
  );
};