# Render Deployment Guide

## Fix for ERR_MODULE_NOT_FOUND: Cannot find module 'zod'

### Issue
The error occurs because `@google/genai` requires `zod` as a peer dependency, but it's not being installed correctly during deployment.

### Solution Steps

1. **Environment Variables Setup in Render:**
   - Go to your Render dashboard
   - Navigate to your service
   - Go to "Environment" tab
   - Add these environment variables:

```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database_name?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
PORT=10000
GOOGLE_API_KEY=your_google_ai_api_key_here
```

2. **Build Configuration:**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Node.js Version:**
   - Ensure you're using Node.js 18+ in Render

### Alternative Fix (if the above doesn't work)

If you're still getting the zod error, try this in your package.json:

```json
{
  "dependencies": {
    "@google/genai": "^1.8.0",
    "zod": "^3.25.74"
  },
  "overrides": {
    "zod": "^3.25.74"
  }
}
```

### Debugging Steps

1. Check Render logs for the exact error
2. Ensure all environment variables are set
3. Verify MongoDB connection string is correct
4. Check if Google API key is valid

### Common Issues

1. **Missing Environment Variables**: All required env vars must be set in Render
2. **MongoDB Connection**: Ensure your MongoDB Atlas cluster allows connections from Render's IP
3. **Port Configuration**: Render uses port 10000 by default, but your app should use `process.env.PORT`

### Testing Locally

Before deploying, test locally with:
```bash
npm install
npm start
```

Make sure your `.env` file has all the required variables. 