# Backend API Setup Guide

This guide explains what the API URL should be and how to set up your backend API.

## What is the API URL?

The API URL is the address where your backend API server is running. This backend handles WorkOS authentication flows because **API keys must stay server-side** for security.

## Development Options

### Option 1: Local Development (Quick Start)

If you're just testing locally, you can use `http://localhost:3000`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Note**: This only works if:
- You're testing in Expo web browser (`npm run web`)
- You're using a tool like ngrok (see Option 2) for mobile devices

### Option 2: Use ngrok (Recommended for Mobile Testing)

ngrok creates a public URL that tunnels to your local backend.

1. **Install ngrok**:
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start your backend** on port 3000:
   ```bash
   cd your-backend-folder
   node server.js  # or npm start
   ```

3. **In another terminal, start ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** ngrok provides (e.g., `https://abc123.ngrok.io`)

5. **Add to .env**:
   ```env
   EXPO_PUBLIC_API_URL=https://abc123.ngrok.io
   ```

**Note**: ngrok free tier gives you a new URL each time. For development, this is fine.

### Option 3: Deploy to a Hosting Service

Deploy your backend to:
- **Vercel** (easiest for Node.js)
- **Railway** (simple deployment)
- **Render** (free tier available)
- **Heroku** (classic choice)
- **AWS/Google Cloud/Azure** (for production)

Then use your deployed URL:
```env
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app
```

## Quick Backend Setup (Express.js Example)

Create a simple backend to get started:

### 1. Create Backend Folder

```bash
mkdir finsh-backend
cd finsh-backend
npm init -y
npm install express cors dotenv @workos-inc/node
```

### 2. Create `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WorkOS } = require('@workos-inc/node');

const app = express();
app.use(cors());
app.use(express.json());

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

// GET /api/auth/sign-in
app.get('/api/auth/sign-in', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
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
    console.error('Error:', error);
    res.status(401).json({ error: 'Failed to authenticate' });
  }
});

// GET /api/auth/user
app.get('/api/auth/user', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
```

### 3. Create `.env` in Backend Folder

```env
WORKOS_API_KEY=sk_YOUR_API_KEY
WORKOS_CLIENT_ID=client_YOUR_CLIENT_ID
PORT=3000
```

### 4. Run Backend

```bash
node server.js
```

### 5. Update Your React Native App `.env`

```env
WORKOS_CLIENT_ID=client_YOUR_CLIENT_ID
EXPO_PUBLIC_API_URL=http://localhost:3000  # For web testing
# OR use ngrok URL for mobile: https://abc123.ngrok.io
```

## Using ngrok for Mobile Testing

Since mobile devices can't access `localhost`, use ngrok:

1. **Start backend**:
   ```bash
   cd finsh-backend
   node server.js
   ```

2. **Start ngrok** (in another terminal):
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Update `.env`**:
   ```env
   EXPO_PUBLIC_API_URL=https://abc123.ngrok-free.app
   ```

5. **Restart Expo**:
   ```bash
   npm start
   ```

## Deployment Options

### Option 1: Vercel (Easiest)

1. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

2. Deploy:
   ```bash
   npm install -g vercel
   vercel
   ```

3. Get your URL and update `.env`:
   ```env
   EXPO_PUBLIC_API_URL=https://your-app.vercel.app
   ```

### Option 2: Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Get your URL from Railway dashboard

### Option 3: Render

1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Use your Render URL

## Summary

**For Development:**
- Use `http://localhost:3000` for web testing
- Use ngrok URL for mobile testing
- Update `.env` with your chosen URL

**For Production:**
- Deploy backend to Vercel/Railway/Render/etc.
- Use your deployed URL in `.env`

**Important Files:**
- `.env` - Your environment variables (never commit this!)
- `app.config.js` - Reads from `.env` and configures Expo
- Backend `.env` - WorkOS API key (server-side only)

## Next Steps

1. Create your backend using the example above
2. Add your WorkOS credentials to backend `.env`
3. Start backend on port 3000
4. Use ngrok for mobile or localhost for web
5. Update React Native `.env` with API URL
6. Test the authentication flow!
