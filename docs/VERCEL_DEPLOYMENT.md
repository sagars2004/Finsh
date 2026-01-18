# Deploying Backend to Vercel

This guide explains how to deploy your WorkOS backend API to Vercel and how it works with your mobile app.

## How Vercel Works

**Yes, your backend will automatically be available when deployed!** Here's how:

### Vercel is Serverless

- ✅ **No servers to manage** - Vercel handles everything
- ✅ **Automatic scaling** - Handles traffic spikes automatically
- ✅ **Always available** - Your API is always accessible via URL
- ✅ **On-demand execution** - Functions run when called (cost-efficient)
- ✅ **Free tier available** - Perfect for getting started

When you deploy to Vercel:
1. Your backend code is deployed to Vercel's edge network
2. Vercel gives you a URL (e.g., `https://your-app.vercel.app`)
3. Your API endpoints are immediately accessible at that URL
4. The backend runs automatically when requests come in (serverless)

## Step-by-Step Vercel Deployment

### 1. Prepare Your Backend

Create a folder structure like this:

```
finsh-backend/
├── api/
│   ├── auth/
│   │   ├── sign-in.js      # GET /api/auth/sign-in
│   │   ├── sign-up.js      # GET /api/auth/sign-up
│   │   └── callback.js     # POST /api/auth/callback
│   └── auth/
│       └── user.js         # GET /api/auth/user
├── package.json
├── vercel.json (optional)
└── .env (local only, use Vercel environment variables in production)
```

### 2. Install Vercel CLI

```bash
npm install -g vercel
```

### 3. Create Backend Files

#### `package.json`
```json
{
  "name": "finsh-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vercel dev"
  },
  "dependencies": {
    "@workos-inc/node": "^latest",
    "cors": "^2.8.5"
  }
}
```

#### `api/auth/sign-in.js` (GET endpoint)
```javascript
const { WorkOS } = require('@workos-inc/node');

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      redirectUri: process.env.WORKOS_REDIRECT_URI || 'finsh://auth/callback',
      clientId: process.env.WORKOS_CLIENT_ID,
    });

    res.json({ authorizationUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
};
```

#### `api/auth/sign-up.js` (GET endpoint)
```javascript
const { WorkOS } = require('@workos-inc/node');

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      redirectUri: process.env.WORKOS_REDIRECT_URI || 'finsh://auth/callback',
      clientId: process.env.WORKOS_CLIENT_ID,
    });

    res.json({ authorizationUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
};
```

#### `api/auth/callback.js` (POST endpoint)
```javascript
const { WorkOS } = require('@workos-inc/node');

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

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
};
```

#### `api/auth/user.js` (GET endpoint)
```javascript
const { WorkOS } = require('@workos-inc/node');

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    console.error('Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 4. Deploy to Vercel

```bash
cd finsh-backend
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No (first time)
- **Project name?** `finsh-backend` (or your choice)
- **Directory?** `./` (current directory)

### 5. Set Environment Variables

After deployment, set your environment variables in Vercel:

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   ```
   WORKOS_API_KEY=sk_YOUR_API_KEY
   WORKOS_CLIENT_ID=client_YOUR_CLIENT_ID
   WORKOS_REDIRECT_URI=finsh://auth/callback
   ```
5. Click **Save**
6. Redeploy (Vercel will auto-deploy, or go to **Deployments** → **Redeploy**)

**Option B: Via CLI**

```bash
vercel env add WORKOS_API_KEY
vercel env add WORKOS_CLIENT_ID
vercel env add WORKOS_REDIRECT_URI
```

### 6. Get Your Vercel URL

After deployment, Vercel gives you a URL like:
```
https://finsh-backend.vercel.app
```

Your API endpoints will be:
- `https://finsh-backend.vercel.app/api/auth/sign-in`
- `https://finsh-backend.vercel.app/api/auth/sign-up`
- `https://finsh-backend.vercel.app/api/auth/callback`
- `https://finsh-backend.vercel.app/api/auth/user`

### 7. Update Your Mobile App

Update your `.env` file:

```env
WORKOS_CLIENT_ID=client_YOUR_CLIENT_ID
EXPO_PUBLIC_API_URL=https://finsh-backend.vercel.app
```

## How App + Backend Work Together

### Development
```
Mobile App (Expo) → http://localhost:3000 or ngrok URL
```

### Production
```
Mobile App (Published) → https://finsh-backend.vercel.app
                         ↓
                    Vercel Backend (Serverless)
                         ↓
                    WorkOS API
```

### Deployment Timeline

1. **Deploy Backend First** (One-time setup)
   ```bash
   cd finsh-backend
   vercel
   ```
   - Backend is now live at `https://finsh-backend.vercel.app`
   - ✅ Always running (serverless, on-demand)

2. **Update Mobile App Config**
   - Update `.env` with Vercel URL
   - Test that app connects to backend

3. **Build & Publish Mobile App**
   - Use EAS Build for iOS/Android
   - Submit to App Store / Play Store
   - App uses the Vercel URL you configured

4. **Both Work Together**
   - Mobile app calls Vercel backend
   - Vercel backend handles authentication
   - Everything works automatically!

## Important Notes

### ✅ Backend Always Available
- Once deployed, your backend is **always accessible**
- No need to "start" it - Vercel handles it
- Serverless = runs on-demand (cost-efficient)

### ✅ Mobile App Independent
- Your mobile app is separate from backend
- App just needs the backend URL
- App Store / Play Store submission is separate

### ✅ Environment Variables
- **Never commit** `.env` files
- Use Vercel's Environment Variables for production
- Local `.env` for development only

### ✅ Updates
- Update backend: `vercel` (auto-deploys)
- Update mobile app: Rebuild and resubmit to stores
- No downtime needed!

## Testing Your Deployment

1. **Test Backend Directly**:
   ```bash
   curl https://finsh-backend.vercel.app/api/auth/sign-in
   # Should return: {"authorizationUrl":"https://..."}
   ```

2. **Test from Mobile App**:
   - Update `.env` with Vercel URL
   - Run app: `npm start`
   - Try signing in
   - Should connect to Vercel backend

3. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → **Functions**
   - See real-time logs of API calls

## Custom Domain (Optional)

You can add a custom domain:

1. Go to Vercel Dashboard → Project → **Settings** → **Domains**
2. Add domain: `api.finsh.app`
3. Update DNS records (Vercel provides instructions)
4. Update `.env`: `EXPO_PUBLIC_API_URL=https://api.finsh.app`

## Vercel Free Tier Limits

- ✅ **100 GB bandwidth/month** (plenty for most apps)
- ✅ **100 hours serverless function execution/month**
- ✅ **Unlimited requests** (within bandwidth)
- ✅ Perfect for getting started!

## Troubleshooting

**Backend not responding?**
- Check Vercel Dashboard → Deployments (should be "Ready")
- Check Environment Variables are set
- Check Vercel logs for errors

**CORS errors?**
- Make sure CORS headers are in all API functions
- Check `Access-Control-Allow-Origin` is set

**Environment variables not working?**
- Must redeploy after adding env vars
- Go to Deployments → Redeploy

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Set environment variables
3. ✅ Update mobile app `.env` with Vercel URL
4. ✅ Test connection
5. ✅ Build and publish mobile app
6. ✅ Everything works together automatically!

Your backend will **automatically be running** once deployed to Vercel - no additional setup needed! 🚀
