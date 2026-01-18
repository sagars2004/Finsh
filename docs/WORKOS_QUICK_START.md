# WorkOS AuthKit Quick Start

This guide provides a quick overview of what's been set up and what you need to do next.

## ✅ What's Been Set Up

1. **Authentication Service** (`src/services/workos/auth.ts`)
   - OAuth sign-in with Google, GitHub, Microsoft
   - Session management with AsyncStorage
   - Token refresh support
   - User info retrieval

2. **Auth Context** (`src/context/AuthContext.tsx`)
   - Global authentication state management
   - React hooks for auth operations
   - Session persistence

3. **Auth Screen** (`src/components/Auth/AuthScreen.tsx`)
   - Beautiful sign-in UI with provider buttons
   - Loading states
   - Error handling

4. **Navigation Integration**
   - Auth screen added to navigation stack
   - Welcome screen connects to auth
   - Conditional routing based on auth state

5. **Dependencies Added**
   - `expo-web-browser` - For OAuth browser flows
   - `expo-linking` - For deep linking callbacks

## 🔧 What You Need to Do

### Step 1: Install Dependencies

```bash
npm install expo-web-browser expo-linking
```

### Step 2: Set Up WorkOS Account

1. Sign up at [workos.com](https://workos.com)
2. Create an Organization
3. Get your credentials:
   - Client ID
   - API Key (for backend)

### Step 3: Configure OAuth Providers

1. Go to WorkOS Dashboard → Authentication → Providers
2. Enable Google, GitHub, Microsoft, etc.
3. Add redirect URIs:
   - `finsh://auth/callback` (for mobile app)
   - `https://your-domain.com/auth/callback` (if using web)

### Step 4: Set Up Backend API

You need a backend API with these endpoints:

```typescript
// POST /api/auth/sign-in
// Request: { provider: 'google' | 'github' | 'microsoft', redirectUri: string }
// Response: { authorizationUrl: string }

// POST /api/auth/callback  
// Request: { code: string }
// Response: { accessToken, user, refreshToken? }

// GET /api/auth/user
// Headers: { Authorization: 'Bearer <token>' }
// Response: { user }

// POST /api/auth/sign-out
// Headers: { Authorization: 'Bearer <token>' }
```

See `docs/WORKOS_AUTH_SETUP.md` for detailed backend implementation examples.

### Step 5: Configure Environment Variables

Create `.env` file:

```env
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_WORKOS_CLIENT_ID=client_xxxxx
EXPO_PUBLIC_WORKOS_ENVIRONMENT=production
```

Or use `app.config.js`:

```javascript
module.exports = {
  expo: {
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      workosClientId: process.env.EXPO_PUBLIC_WORKOS_CLIENT_ID,
      workosEnvironment: process.env.EXPO_PUBLIC_WORKOS_ENVIRONMENT,
    },
  },
};
```

### Step 6: Enable Auth Flow

In `src/navigation/AppNavigator.tsx`, change:

```typescript
const enableAuth = true; // Change from false to true
```

This will:
- Show auth screen first if user is not authenticated
- Hide "Sign Up" / "Log In" buttons on Welcome screen
- Route unauthenticated users to Auth screen

### Step 7: Test the Flow

1. Run the app
2. Tap "Sign Up" or "Log In"
3. Select a provider (Google/GitHub)
4. Complete OAuth flow
5. Verify you're redirected back and session is stored

## 🏗️ Architecture Overview

```
┌─────────────┐
│  React Native│
│     App      │
└──────┬───────┘
       │
       │ HTTP Requests
       ▼
┌─────────────┐
│   Backend   │
│     API     │
└──────┬───────┘
       │
       │ WorkOS SDK
       ▼
┌─────────────┐
│   WorkOS    │
│   AuthKit   │
└─────────────┘
```

1. **App** opens OAuth flow via WebBrowser
2. **Backend** generates WorkOS authorization URL
3. **User** completes OAuth on provider (Google/GitHub)
4. **Provider** redirects to WorkOS callback
5. **WorkOS** redirects to your backend callback
6. **Backend** exchanges code for token
7. **Backend** redirects to app with token
8. **App** stores session and continues

## 📝 Code Examples

### Backend Example (Express.js)

```javascript
const { WorkOS } = require('@workos-inc/node');
const workos = new WorkOS(process.env.WORKOS_API_KEY);

// POST /api/auth/sign-in
app.post('/api/auth/sign-in', async (req, res) => {
  const { provider, redirectUri } = req.body;
  
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider,
    redirectUri,
    clientId: process.env.WORKOS_CLIENT_ID,
  });
  
  res.json({ authorizationUrl });
});

// GET /api/auth/callback
app.get('/api/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  const { user, accessToken } = await workos.userManagement.authenticateWithCode({
    code,
    clientId: process.env.WORKOS_CLIENT_ID,
  });
  
  // Redirect back to app with token
  res.redirect(`finsh://auth/callback?token=${accessToken}&userId=${user.id}`);
});
```

## 🔍 Testing Without Backend

For testing, you can temporarily use WorkOS's hosted redirect page (limited functionality):

1. Modify `getAuthorizationUrl()` to use WorkOS API directly
2. Handle callback in app directly (requires API key - NOT RECOMMENDED for production)
3. Only use this for development/testing

## 📚 Resources

- [WorkOS Docs](https://workos.com/docs/user-management)
- [WorkOS React Native Guide](https://workos.com/docs/user-management/quickstart/react-native)
- [WorkOS Pricing](https://workos.com/pricing) (Free: 10K MAU)
- [Expo WebBrowser Docs](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [Expo Linking Docs](https://docs.expo.dev/versions/latest/sdk/linking/)

## ⚠️ Important Notes

1. **Backend Required**: WorkOS AuthKit requires a backend to securely handle API keys
2. **Never expose API keys** in React Native code - use environment variables on backend
3. **Deep linking must be configured** in `app.json` for callbacks to work
4. **Test on real device** - WebBrowser OAuth flows work best on physical devices
5. **Free tier**: 10,000 MAU (Monthly Active Users) - perfect for getting started!
