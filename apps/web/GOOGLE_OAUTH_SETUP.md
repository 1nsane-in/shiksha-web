# Google OAuth Setup Guide

## Prerequisites

You need to configure your Google Cloud Console to allow OAuth from your local development environment.

## Steps

### 1. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID: `23400190792-giinr9lds48slhi58bg87ts1evst4h3i.apps.googleusercontent.com`
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/auth/callback`

### 2. Environment Variables

The `.env.local` file has been created with:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=23400190792-giinr9lds48slhi58bg87ts1evst4h3i.apps.googleusercontent.com
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. How It Works

1. User clicks "Login" in navbar
2. Redirected to `/login` page
3. Clicks "Continue with Google" button
4. **Google account selection popup appears**
5. User selects their Google account
6. Google redirects back with access token
7. Token is sent to backend for verification
8. User is redirected to `/dashboard`

### 4. Testing

1. Start the backend: `cd apps/api && npm run start:dev`
2. Start the frontend: `cd apps/web && npm run dev`
3. Visit `http://localhost:3000`
4. Click "Login" → Click "Continue with Google"
5. You should see the Google account selection popup

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure `http://localhost:3000/auth/callback` is added to Authorized redirect URIs in Google Cloud Console

### "invalid_client" Error
- Verify the Client ID is correct in `.env.local`

### Popup Blocked
- Allow popups for `localhost:3000` in your browser

## Files Changed

- `apps/web/components/landing/Header.tsx` - Added login button
- `apps/web/components/auth/GoogleLoginButton.tsx` - Google OAuth button
- `apps/web/app/login/page.tsx` - Login page
- `apps/web/app/auth/callback/page.tsx` - OAuth callback handler
- `apps/web/.env.local` - Environment variables