# Vercel Deployment Configuration

## Project Structure
This is a monorepo with the Next.js frontend in the `frontend/` subdirectory.

## Vercel Project Settings

Configure the following in your Vercel project settings:

### Root Directory
Set the root directory to: `frontend`

### Build & Development Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Environment Variables
Add the following environment variables in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=<your-backend-api-url>
NEXT_PUBLIC_BETTER_AUTH_URL=<your-vercel-deployment-url>
```

## Manual Configuration Steps

1. Go to your Vercel project settings
2. Navigate to **General** → **Root Directory**
3. Click **Edit** and set it to `frontend`
4. Save the changes
5. Redeploy the project

## Troubleshooting

If you get module resolution errors:
- Ensure `tsconfig.json` has `"baseUrl": "."`
- Verify `jsconfig.json` exists with proper path mappings
- Check that `src/lib/utils.ts` exists

## Alternative: Deploy Only Frontend

If the above doesn't work, you can:
1. Create a separate Vercel project
2. Connect it to your repository
3. Set the root directory to `frontend`
4. Deploy
