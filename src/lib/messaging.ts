import { databases, ID, DATABASE_ID, MESSAGES_COLLECTION_ID } from './appwrite';

export interface Message {
  $id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'system' | 'notification';
}

export interface CreateMessageData {
  userId: string;
  userName: string;
  content: string;
  type?: 'text' | 'system' | 'notification';
}

export class MessagingService {
  static async createMessage(data: CreateMessageData): Promise<Message> {
    try {
      const message = await databases.createDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        ID.unique(),
        {
          userId: data.userId,
          userName: data.userName,
          content: data.content,
          type: data.type || 'text',
          timestamp: new Date().toISOString()
        }
      );

      return {
        $id: message.$id,
        userId: message.userId,
        userName: message.userName,
        content: message.content,
        timestamp: message.timestamp,
        type: message.type
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to create message',
        code: error.code
      };
    }
  }

  static async getMessages(limit: number = 50): Promise<Message[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        [
          // Order by timestamp descending (newest first)
          // You might need to adjust this based on your database structure
        ],
        limit
      );

      return response.documents.map(doc => ({
        $id: doc.$id,
        userId: doc.userId,
        userName: doc.userName,
        content: doc.content,
        timestamp: doc.timestamp,
        type: doc.type
      }));
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch messages',
        code: error.code
      };
    }
  }

  static async deleteMessage(messageId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        messageId
      );
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to delete message',
        code: error.code
      };
    }
  }

  static async updateMessage(messageId: string, content: string): Promise<Message> {
    try {
      const message = await databases.updateDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        messageId,
        {
          content: content
        }
      );

      return {
        $id: message.$id,
        userId: message.userId,
        userName: message.userName,
        content: message.content,
        timestamp: message.timestamp,
        type: message.type
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to update message',
        code: error.code
      };
    }
  }
} 