# Appwrite Setup Guide for Starwise

This guide will help you set up Appwrite for authentication and messaging functionality in your Starwise application.

## Prerequisites

- An Appwrite account (sign up at [appwrite.io](https://appwrite.io))
- Your project already has the Appwrite SDK installed

## Step 1: Create Database and Collections

### 1.1 Create Database
1. Go to your Appwrite Console
2. Navigate to **Databases** in the left sidebar
3. Click **Create Database**
4. Set the following:
   - **Database ID**: `starwise_db`
   - **Name**: `Starwise Database`
   - **Description**: `Database for Starwise cosmic learning app`

### 1.2 Create Users Collection
1. In your `starwise_db` database, click **Create Collection**
2. Set the following:
   - **Collection ID**: `users`
   - **Name**: `Users`
   - **Description**: `User profiles and additional data`
3. Add the following attributes:
   - **userId** (String, required, size: 36)
   - **email** (String, required, size: 255)
   - **name** (String, required, size: 255)
   - **phone** (String, optional, size: 20)
   - **createdAt** (String, required, size: 255)

### 1.3 Create Messages Collection
1. In your `starwise_db` database, click **Create Collection**
2. Set the following:
   - **Collection ID**: `messages`
   - **Name**: `Messages`
   - **Description**: `Chat messages between users`
3. Add the following attributes:
   - **userId** (String, required, size: 36)
   - **userName** (String, required, size: 255)
   - **content** (String, required, size: 1000)
   - **type** (String, optional, size: 20, default: `text`)
   - **timestamp** (String, required, size: 255)

## Step 2: Configure Authentication

### 2.1 Enable Authentication Methods
1. Go to **Auth** in the left sidebar
2. Click on **Settings**
3. Enable the following authentication methods:
   - ✅ **Email/Password** authentication
   - ✅ **Phone** authentication
   - ✅ **Magic URL** authentication
   - ✅ **Email OTP** authentication

**Note**: No additional configuration is needed for Magic URL. The callback URL is automatically set to your app's domain.

## Step 3: Set Up Permissions

### 3.1 Users Collection Permissions
1. Go to your `users` collection
2. Click on **Settings** → **Permissions**
3. Set the following permissions:
   - **Create**: `users` (authenticated users can create their own profile)
   - **Read**: `users` (users can read their own profile)
   - **Update**: `users` (users can update their own profile)
   - **Delete**: `team:admin` (only admins can delete profiles)

### 3.2 Messages Collection Permissions
1. Go to your `messages` collection
2. Click on **Settings** → **Permissions**
3. Set the following permissions:
   - **Create**: `users` (authenticated users can create messages)
   - **Read**: `users` (authenticated users can read all messages)
   - **Update**: `users` (users can update their own messages)
   - **Delete**: `users` (users can delete their own messages)

## Step 4: Environment Variables (Optional)

For better security, you can create a `.env` file in your project root:

```env
VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=6854cd6f002830290443
```

Then update `src/lib/appwrite.ts`:

```typescript
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '6854cd6f002830290443');
```

## Step 5: Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to your application at `http://localhost:8080`
3. Test all authentication methods:
   - **Email/Password**: Create account and sign in
   - **Phone**: Sign in with phone number
   - **Email OTP**: Send OTP to email and verify
   - **Magic Link**: Send magic link to email
4. Test the messaging feature

## Authentication Methods Available

### 1. Email/Password
- Traditional email and password authentication
- Supports both login and signup
- Most common authentication method

### 2. Phone
- Phone number and password authentication
- Requires phone number format: `+1 (555) 123-4567`
- Supports both login and signup

### 3. Email OTP
- One-time password sent to email
- No password required
- Secure and user-friendly
- 6-digit verification code

### 4. Magic Link
- Passwordless authentication via email link
- Click the link in email to automatically sign in
- Most convenient for users
- No passwords to remember
- Automatically creates new accounts for new emails

## Troubleshooting

### Common Issues

1. **"Project not found" error**
   - Verify your project ID is correct: `6854cd6f002830290443`
   - Ensure you're using the correct endpoint: `https://nyc.cloud.appwrite.io/v1`

2. **"Permission denied" errors**
   - Check that your collections have the correct permissions set
   - Verify that users are properly authenticated

3. **"Collection not found" errors**
   - Ensure your collection IDs match exactly: `users` and `messages`
   - Check that the database ID is `starwise_db`

4. **Authentication issues**
   - Verify that all authentication methods are enabled in Auth → Settings
   - Check that your domain is allowed (localhost should work automatically)

5. **OTP/Magic Link not working**
   - Check that OTP and Magic URL authentication are enabled
   - Check your email/spam folder for the links/codes
   - Magic URL automatically uses your app's domain

6. **Phone authentication issues**
   - Ensure phone authentication is enabled
   - Verify phone number format (should include country code)

## Security Best Practices

1. **Never expose your API keys in client-side code**
2. **Use environment variables for sensitive data**
3. **Implement proper input validation**
4. **Set up appropriate permissions for your collections**
5. **Regularly review and update your security settings**
6. **Use HTTPS in production**
7. **Set appropriate expiration times for tokens**

## Next Steps

Once the basic setup is working, you can:

1. Add real-time messaging using Appwrite's real-time features
2. Implement file uploads for user avatars
3. Add more sophisticated user roles and permissions
4. Implement push notifications
5. Add analytics and user tracking
6. Set up email templates for OTP and magic links
7. Implement account recovery options

## Support

If you encounter any issues:

1. Check the [Appwrite Documentation](https://appwrite.io/docs)
2. Visit the [Appwrite Community](https://appwrite.io/discord)
3. Review the [Appwrite Console](https://console.appwrite.io) for detailed error messages 