import { Client, Account, Databases, ID } from 'appwrite';

// Initialize the client
const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6854cd6f002830290443');

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

// Database and collection IDs (you'll need to create these in your Appwrite console)
export const DATABASE_ID = 'starwise_db';
export const USERS_COLLECTION_ID = 'users';
export const MESSAGES_COLLECTION_ID = 'messages';

export default client; 