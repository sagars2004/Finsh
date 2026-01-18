# Finsh Backend - Vercel Deployment

This is an example backend structure for deploying to Vercel.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Deploy to Vercel**:
   ```bash
   npx vercel
   ```

3. **Set environment variables** in Vercel Dashboard:
   - `WORKOS_API_KEY`
   - `WORKOS_CLIENT_ID`
   - `WORKOS_REDIRECT_URI`

4. **Test locally** (optional):
   ```bash
   npx vercel dev
   ```

## Project Structure

```
vercel-backend-example/
├── api/
│   └── auth/
│       ├── sign-in.js      # GET /api/auth/sign-in
│       ├── sign-up.js      # GET /api/auth/sign-up
│       ├── callback.js     # POST /api/auth/callback
│       └── user.js         # GET /api/auth/user
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/auth/sign-in` - Get WorkOS authorization URL for sign-in
- `GET /api/auth/sign-up` - Get WorkOS authorization URL for sign-up
- `POST /api/auth/callback` - Exchange code for access token
- `GET /api/auth/user` - Get user info (requires Bearer token)

See full documentation in `/docs/VERCEL_DEPLOYMENT.md`
