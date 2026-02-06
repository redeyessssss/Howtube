# 🔐 Authentication Setup Guide

## Overview

HowTube now includes complete Firebase Authentication with support for:
- Email/Password authentication
- Google Sign-In
- Facebook Sign-In

## Files Added

1. **`firebase-config.js`** - Firebase initialization and configuration
2. **`signup.html`** - User registration page
3. **`signup.js`** - Signup functionality
4. **`profile.html`** - Updated with Firebase auth
5. **`profile.js`** - Updated with Firebase auth

## How It Works

### 1. Sign Up Flow

**Page:** `signup.html`

Users can sign up using:
- **Email/Password**: Fill in name, email, password, and confirm password
- **Google**: Click "Google" button for instant signup
- **Facebook**: Click "Facebook" button for instant signup

**Features:**
- Password validation (minimum 6 characters)
- Password confirmation matching
- Terms & conditions checkbox
- Real-time error messages
- Beautiful loading animations

**After Signup:**
- User data is saved to Firebase Realtime Database
- User is automatically logged in
- Redirected to profile page

### 2. Sign In Flow

**Page:** `profile.html`

Users can sign in using:
- **Email/Password**: Enter credentials
- **Google**: One-click sign in
- **Facebook**: One-click sign in

**Features:**
- Remember me option
- Forgot password link (coming soon)
- Error handling for invalid credentials
- Smooth transitions

**After Sign In:**
- User data loaded from Firebase
- Profile dashboard displayed
- Stats calculated from watch history

### 3. User Profile

**Logged In View:**
- User avatar and name
- Email address
- Premium & Verified badges
- Stats cards (Videos Watched, Watch Time, Liked Videos, Playlists)
- Activity feed
- Settings tab
- Security tab
- Logout button

**Not Logged In View:**
- Login form
- Social login buttons
- Link to signup page

## Firebase Database Structure

```
users/
  └── {userId}/
      ├── name: "John Doe"
      ├── email: "john@example.com"
      ├── avatar: "https://..."
      ├── joinedDate: "2025-02-06T..."
      ├── isPremium: false
      ├── isVerified: false
      ├── watchHistory: []
      ├── likedVideos: []
      └── playlists: []
```

## Security Features

1. **Firebase Authentication**: Industry-standard security
2. **Password Requirements**: Minimum 6 characters
3. **Email Verification**: Built into Firebase
4. **Secure Token Management**: Handled by Firebase SDK
5. **HTTPS Only**: Firebase requires HTTPS in production

## Error Handling

The system handles various error scenarios:

### Sign Up Errors
- Email already in use
- Invalid email format
- Weak password
- Network errors
- Popup closed by user (social auth)

### Sign In Errors
- User not found
- Wrong password
- Invalid email
- Account disabled
- Network errors

## Testing

### Test Accounts

You can create test accounts using:
1. Any valid email format
2. Password with at least 6 characters
3. Or use Google/Facebook accounts

### Local Testing

1. Start local server:
```bash
python3 -m http.server 8000
```

2. Navigate to:
- Signup: `http://localhost:8000/signup.html`
- Login: `http://localhost:8000/profile.html`
- Main App: `http://localhost:8000/index.html`

## Production Deployment

### Vercel Deployment

The app is configured for Vercel deployment with `vercel.json`.

**Important:**
- Firebase works with HTTPS (Vercel provides this)
- All authentication methods work in production
- No additional configuration needed

### Environment Variables

For production, consider moving sensitive data to environment variables:
- Firebase API keys (though client-side keys are safe to expose)
- YouTube API key

## Social Authentication Setup

### Google Sign-In

Already configured! The Firebase project has Google authentication enabled.

**How it works:**
1. User clicks "Google" button
2. Google popup opens
3. User selects account
4. Automatically signed in
5. User data saved to database

### Facebook Sign-In

Already configured! The Firebase project has Facebook authentication enabled.

**How it works:**
1. User clicks "Facebook" button
2. Facebook popup opens
3. User authorizes app
4. Automatically signed in
5. User data saved to database

## User Experience Flow

```
1. User visits site
   ↓
2. Clicks "Profile" button
   ↓
3. Not logged in → Shows login form
   ↓
4. User can:
   - Sign in (if has account)
   - Click "Sign up" link
   ↓
5. On signup page:
   - Fill form OR
   - Use social auth
   ↓
6. Account created
   ↓
7. Redirected to profile
   ↓
8. Profile dashboard shown
   ↓
9. User can browse videos
   ↓
10. All activity tracked
```

## Features Coming Soon

- [ ] Password reset via email
- [ ] Email verification
- [ ] Profile picture upload
- [ ] Account settings update
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Active devices list

## Troubleshooting

### "Popup blocked" error
- Allow popups for the site
- Try again

### "Network error"
- Check internet connection
- Verify Firebase is accessible

### "Email already in use"
- Use sign in instead
- Or use password reset (coming soon)

### Social auth not working
- Check if popups are allowed
- Verify Firebase configuration
- Check browser console for errors

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Firebase configuration
3. Check network tab for failed requests
4. Open an issue on GitHub

---

**Made with ❤️ using Firebase Authentication**
