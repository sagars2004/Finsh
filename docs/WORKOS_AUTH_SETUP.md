# WorkOS AuthKit Integration Guide

This guide walks through integrating WorkOS AuthKit (free tier) with Finsh to enable Google, GitHub, and other OAuth sign-ins.

## Overview

WorkOS AuthKit provides:
- ✅ **Free tier** with 10,000 MAU (Monthly Active Users)
- ✅ Multiple OAuth providers (Google, GitHub, Microsoft, etc.)
- ✅ Enterprise SSO support
- ✅ Built-in user management
- ✅ Session management

## Architecture

For React Native/Expo apps, we use a **hybrid approach**:
1. **Backend/API endpoint** handles WorkOS OAuth flow
2. **React Native app** opens OAuth flow in WebBrowser
3. **Callback handling** stores session token
4. **Session verification** validates user on app start

---

## Step 1: Set Up WorkOS Account

1. **Sign up** at [workos.com](https://workos.com) (free tier)
2. **Create an Organization** in WorkOS dashboard
3. **Get your credentials**:
   - API Key (server-side)
   - Client ID (public, can be in app)
   - Environment (staging/production)

4. **Configure OAuth providers**:
   - Go to **Authentication** → **Providers**
   - Enable Google, GitHub, etc.
   - Add redirect URIs for your app

---

## Step 2: Set Up Backend Endpoints

You'll need a backend (can be simple Express/Next.js API) with these endpoints:

### Required Endpoints:

```
POST /api/auth/sign-in          # Initiate OAuth flow
GET  /api/auth/callback         # Handle OAuth callback
GET  /api/auth/user             # Get current user info
POST /api/auth/sign-out         # Sign out
```

### Example Backend Setup (Node.js/Express):

```typescript
// api/auth/sign-in.ts
import { WorkOS } from '@workos-inc/node';
import express from 'express';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

app.post('/api/auth/sign-in', async (req, res) => {
  const { provider } = req.body; // 'google', 'github', etc.
  
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider,
    redirectUri: `${process.env.APP_URL}/api/auth/callback`,
    clientId: process.env.WORKOS_CLIENT_ID!,
  });
  
  res.json({ authorizationUrl });
});

app.get('/api/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  const { user, accessToken } = await workos.userManagement.authenticateWithCode({
    code: code as string,
    clientId: process.env.WORKOS_CLIENT_ID!,
  });
  
  // Return token and user info to mobile app
  res.redirect(`finsh://auth/callback?token=${accessToken}&userId=${user.id}`);
});

app.get('/api/auth/user', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  const user = await workos.userManagement.getUser({
    accessToken: token!,
  });
  
  res.json({ user });
});
```

**Alternative: Use WorkOS-hosted redirect**

WorkOS can host the redirect page for you - no backend needed! See Step 3.

---

## Step 3: Install Dependencies

```bash
npm install @workos-inc/authkit-react-native expo-web-browser expo-linking
```

Or if using WorkOS-hosted redirect:
```bash
npm install @workos-inc/authkit-react-native expo-web-browser expo-linking @react-native-async-storage/async-storage
```

---

## Step 4: Configure App Deep Linking

Add deep linking to `app.json`:

```json
{
  "expo": {
    "scheme": "finsh",
    "ios": {
      "bundleIdentifier": "com.finsh.app",
      "associatedDomains": ["applinks:finsh.app"]
    },
    "android": {
      "package": "com.finsh.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "finsh",
              "host": "auth"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## Step 5: Environment Variables

Create `.env` file (never commit this):

```env
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_API_KEY=sk_xxxxx  # Only needed if using custom backend
WORKOS_ENVIRONMENT=production  # or staging
APP_URL=https://your-app.com  # For callback URLs
```

For Expo, use `app.config.js`:

```javascript
module.exports = {
  expo: {
    extra: {
      workosClientId: process.env.WORKOS_CLIENT_ID,
      workosEnvironment: process.env.WORKOS_ENVIRONMENT,
    },
  },
};
```

---

## Implementation Files

See the following files for complete implementation:
- `src/services/workos/auth.ts` - WorkOS authentication service
- `src/context/AuthContext.tsx` - Authentication context provider
- `src/components/Auth/AuthScreen.tsx` - Sign in UI component

---

## Testing

1. **Test OAuth flow**:
   - Tap "Sign Up" or "Log In"
   - Select provider (Google/GitHub)
   - Complete OAuth flow
   - Verify session is stored

2. **Test session persistence**:
   - Close and reopen app
   - Verify user is still logged in

3. **Test sign out**:
   - Sign out from Settings
   - Verify user data is cleared

---

## Cost

- **Free tier**: 10,000 MAU (Monthly Active Users)
- **Paid**: $0.0125 per MAU after free tier
- **Enterprise SSO**: Additional pricing

---

## Resources

- [WorkOS AuthKit Docs](https://workos.com/docs/user-management)
- [WorkOS React Native Guide](https://workos.com/docs/user-management/quickstart/react-native)
- [WorkOS Free Tier](https://workos.com/pricing)
