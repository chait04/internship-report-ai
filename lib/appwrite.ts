import { Account, Client, Databases } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error('Missing Appwrite environment variables');
}

const client = new Client();
client.setEndpoint(endpoint);
client.setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const USERS_COLLECTION_ID = '67ac2924002039d96616';
export const REPORTS_COLLECTION_ID = '67ac2aa400360da0c67d';