# Render Deployment Guide

## ✅ FIXED: ERR_MODULE_NOT_FOUND: Cannot find module 'zod'

### Issue
The error occurred because `@google/genai` requires `zod` as a peer dependency, but it wasn't being installed correctly during deployment.

### ✅ Solution Applied
**Switched from `@google/genai` to `@google/generative-ai`** - This older, more stable package doesn't have the zod dependency issue and works reliably on Render.

### Environment Variables Setup in Render:
1. Go to your Render dashboard
2. Navigate to your service
3. Go to "Environment" tab
4. Add these environment variables:

```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database_name?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
PORT=10000
GOOGLE_API_KEY=your_google_ai_api_key_here
```

### Build Configuration:
- Build Command: `npm install`
- Start Command: `npm start`

### Node.js Version:
- Ensure you're using Node.js 18+ in Render

### What Changed:
1. **Package.json**: Replaced `@google/genai` with `@google/generative-ai`
2. **Gemini Service**: Updated API calls to use the older, more stable API
3. **Removed zod dependency**: No longer needed with the older package

### Testing Locally:
Before deploying, test locally with:
```bash
npm install
npm start
```

Make sure your `.env` file has all the required variables.

### Common Issues:
1. **Missing Environment Variables**: All required env vars must be set in Render
2. **MongoDB Connection**: Ensure your MongoDB Atlas cluster allows connections from Render's IP
3. **Port Configuration**: Render uses port 10000 by default, but your app should use `process.env.PORT`

### Debugging:
If you still encounter issues:
1. Check Render logs for the exact error
2. Ensure all environment variables are set
3. Verify MongoDB connection string is correct
4. Check if Google API key is valid 