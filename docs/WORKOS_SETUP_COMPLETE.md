# WorkOS AuthKit Complete Setup Guide

This guide walks you through setting up WorkOS AuthKit with your Client ID and API Key.

## ✅ What's Already Set Up

The following components are ready to use:
- ✅ `AuthContext` - Global authentication state
- ✅ `AuthScreen` - Sign in/Sign up UI
- ✅ `auth.ts` service - Handles OAuth flows
- ✅ Navigation integration
- ✅ Deep linking configuration

## 🚀 Step-by-Step Setup

### Step 1: Configure WorkOS Dashboard

1. **Go to [WorkOS Dashboard](https://dashboard.workos.com)**

2. **Set up Redirect URIs**:
   - Go to **Authentication** → **Redirects**
   - Add Redirect URI: `finsh://auth/callback`
   - Add Sign-in endpoint: `https://your-api.com/api/auth/sign-in` (your backend URL)
   - Add Sign-out redirect: `finsh://` (or your app's home route)

3. **Enable OAuth Providers**:
   - Go to **Authentication** → **Providers**
   - Enable Google, GitHub, Microsoft, etc.
   - Configure each provider's OAuth credentials (get from provider's developer console)

4. **Get Your Credentials**:
   - Client ID: Found in Dashboard (starts with `client_`)
   - API Key: Found in Dashboard (starts with `sk_`) - **KEEP THIS SECRET!**

### Step 2: Configure Your App

Update `app.json` with your credentials:

```json
{
  "expo": {
    "scheme": "finsh",
    "extra": {
      "workosClientId": "client_YOUR_CLIENT_ID",
      "apiUrl": "https://your-api.com"
    }
  }
}
```

**Important**: 
- Replace `client_YOUR_CLIENT_ID` with your actual Client ID
- Replace `https://your-api.com` with your backend API URL

### Step 3: Set Up Backend API

You need a backend API with these endpoints. See `src/services/workos/backend-example.ts` for complete implementation.

**Required Endpoints:**

1. **GET `/api/auth/sign-in`**
   - Generates WorkOS authorization URL
   - Returns `{ authorizationUrl: string }`

2. **GET `/api/auth/sign-up`**
   - Same as sign-in but for sign-up flow

3. **POST `/api/auth/callback`**
   - Exchanges authorization code for access token
   - Request: `{ code: string }`
   - Response: `{ accessToken, user, refreshToken?, expiresAt }`

4. **GET `/api/auth/user`**
   - Gets current user info
   - Headers: `Authorization: Bearer <token>`
   - Response: `{ user }`

5. **POST `/api/auth/refresh`** (optional)
   - Refreshes expired access token
   - Request: `{ refreshToken: string }`

6. **POST `/api/auth/sign-out`** (optional)
   - Signs out user

### Step 4: Quick Backend Example (Express.js)

```javascript
const express = require('express');
const { WorkOS } = require('@workos-inc/node');

const app = express();
const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

// GET /api/auth/sign-in
app.get('/api/auth/sign-in', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit', // WorkOS hosted AuthKit (supports multiple providers)
    redirectUri: 'finsh://auth/callback',
    clientId: process.env.WORKOS_CLIENT_ID,
  });
  
  res.json({ authorizationUrl });
});

// GET /api/auth/sign-up
app.get('/api/auth/sign-up', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    redirectUri: 'finsh://auth/callback',
    clientId: process.env.WORKOS_CLIENT_ID,
  });
  
  res.json({ authorizationUrl });
});

// POST /api/auth/callback
app.post('/api/auth/callback', async (req, res) => {
  const { code } = req.body;
  
  try {
    const { user, accessToken, refreshToken } = 
      await workos.userManagement.authenticateWithCode({
        code,
        clientId: process.env.WORKOS_CLIENT_ID,
      });
    
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
    
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      },
      expiresAt,
    });
  } catch (error) {
    res.status(401).json({ error: 'Failed to authenticate' });
  }
});

// GET /api/auth/user
app.get('/api/auth/user', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    const user = await workos.userManagement.getUser({
      accessToken: token,
    });
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

**Backend Environment Variables:**
```env
WORKOS_API_KEY=sk_YOUR_API_KEY
WORKOS_CLIENT_ID=client_YOUR_CLIENT_ID
```

### Step 5: Install Backend Dependencies

In your backend project:

```bash
npm install @workos-inc/node
# or
npm install express cors dotenv  # if using Express
```

### Step 6: Enable Auth in Your App

In `src/navigation/AppNavigator.tsx`, change:

```typescript
const enableAuth = true; // Change from false to true
```

This will:
- Show Auth screen first for unauthenticated users
- Hide "Get Started" button on Welcome screen
- Show "Sign Up" and "Log In" buttons instead

### Step 7: Test the Flow

1. Start your backend API server
2. Update `app.json` with your Client ID and API URL
3. Run your Expo app
4. Tap "Sign Up" or "Log In"
5. Complete OAuth flow in browser
6. Verify you're redirected back and logged in

## 🔧 Configuration Checklist

- [ ] WorkOS Dashboard configured
- [ ] Redirect URI added: `finsh://auth/callback`
- [ ] Sign-in endpoint configured
- [ ] OAuth providers enabled (Google, GitHub, etc.)
- [ ] Client ID added to `app.json`
- [ ] API URL added to `app.json`
- [ ] Backend API created with required endpoints
- [ ] Backend environment variables set
- [ ] `enableAuth = true` in AppNavigator

## 📱 How It Works

1. **User taps "Sign In" or "Sign Up"**
   - App calls backend `/api/auth/sign-in` or `/api/auth/sign-up`
   - Backend generates WorkOS authorization URL
   - App opens URL in WebBrowser

2. **User authenticates on WorkOS hosted page**
   - WorkOS shows sign-in options (Google, GitHub, email/password, etc.)
   - User completes authentication
   - WorkOS redirects to callback URL with authorization code

3. **App handles callback**
   - Deep link opens app with authorization code
   - App sends code to backend `/api/auth/callback`
   - Backend exchanges code for access token
   - Backend returns token and user info

4. **App stores session**
   - Session stored in AsyncStorage
   - User is logged in and can access app

## 🆘 Troubleshooting

**"Failed to get authorization URL"**
- Check that backend API is running
- Verify API URL in `app.json` is correct
- Check backend logs for errors

**"OAuth flow was cancelled"**
- User closed browser before completing
- This is normal, just try again

**"No authorization code received"**
- Check deep linking is configured correctly
- Verify redirect URI matches WorkOS dashboard
- Check `app.json` has `"scheme": "finsh"`

**"Failed to exchange code for token"**
- Check backend API key is correct
- Verify Client ID matches
- Check backend `/api/auth/callback` endpoint is working

## 📚 Additional Resources

- **Backend Example**: `src/services/workos/backend-example.ts`
- **WorkOS Docs**: https://workos.com/docs/user-management
- **WorkOS Dashboard**: https://dashboard.workos.com

## 💰 Pricing

- **Free Tier**: 10,000 MAU (Monthly Active Users)
- **After Free Tier**: $0.0125 per MAU
- **Perfect for getting started!**
