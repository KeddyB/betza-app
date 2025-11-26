# Betza App - Authentication Setup Guide

## Overview
Your app now has a complete authentication flow with a Get Started screen that matches your website's design. Users see this before accessing the main ecommerce features.

## What's Been Created

### Screen Hierarchy
```
/auth (Root auth layout)
├── /get-started (Main welcome screen)
└── /auth (Nested auth screens)
    ├── /sign-up (Email sign up)
    ├── /sign-in (Email sign in)
    ├── /sign-up-google (Google sign up)
    ├── /sign-in-google (Google sign in)
    └── /forgot-password (Password reset)
```

### Files Created
1. **`app/auth/get-started.tsx`** - Welcome screen with all sign-up/sign-in options
2. **`app/auth/_layout.tsx`** - Layout wrapper for auth routes
3. **`app/auth/auth/_layout.tsx`** - Layout for nested auth screens
4. **`app/auth/auth/sign-up.tsx`** - Email-based sign up form
5. **`app/auth/auth/sign-in.tsx`** - Email-based sign in form
6. **`app/auth/auth/sign-up-google.tsx`** - Google sign up placeholder
7. **`app/auth/auth/sign-in-google.tsx`** - Google sign in placeholder
8. **`app/auth/auth/forgot-password.tsx`** - Password reset form
9. **`app/_layout.tsx`** - Updated root layout with auth state management

## Current Behavior

- Users always see the Get Started screen on app launch
- They can navigate to Sign Up or Sign In flows
- Google auth screens are placeholder (ready for implementation)
- All forms have basic validation
- Dark/light mode support built in

## Next Steps

### 1. Set Up Authentication State Management
```typescript
// Create: app/context/auth-context.tsx
// Implement proper auth state management using Context API or Redux
```

### 2. Connect to Your Backend
Update the TODO comments in:
- `app/auth/auth/sign-up.tsx` (line ~31)
- `app/auth/auth/sign-in.tsx` (line ~37)
- `app/auth/auth/forgot-password.tsx` (line ~28)

Example:
```typescript
const response = await fetch('https://api.betzaonline.store/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password }),
});
```

### 3. Implement Google OAuth
Install required packages:
```bash
npm install @react-native-google-signin/google-signin expo-auth-session
```

Update:
- `app/auth/auth/sign-up-google.tsx`
- `app/auth/auth/sign-in-google.tsx`

### 4. Add Token Storage
For persistence (using AsyncStorage):
```bash
npm install @react-native-async-storage/async-storage
```

Update `app/_layout.tsx` to:
- Store auth token after successful login
- Check stored token on app startup
- Set `isAuthenticated` based on token validity

### 5. Fix Route Navigation
The `forgot-password` screen has a broken route link. Update line 83:
```typescript
// Change from:
onPress={() => router.push('/auth/auth/sign-in')}
// To:
onPress={() => router.back()}
```

### 6. Visual Polish
Currently 1:1 with your website design. Future improvements:
- Add animations/transitions
- Implement custom Google/Apple login buttons
- Add loading skeletons
- Add error states with better UX
- Implement email verification flow
- Add social media icons

## Testing
To test the authentication flow:
1. Run `npm start`
2. You should see the Get Started screen
3. Click buttons to navigate through flows
4. Test dark/light mode switching

## Architecture Notes
- Uses Expo Router for navigation
- Responsive design with SafeAreaView
- Theme-aware components (dark/light mode)
- Form validation on client side
- Ready for API integration

## TODO Checklist
- [ ] Set up auth context/state management
- [ ] Connect backend APIs for sign up/sign in
- [ ] Implement Google OAuth
- [ ] Set up token storage (AsyncStorage)
- [ ] Implement refresh token logic
- [ ] Add email verification
- [ ] Add password reset email flow
- [ ] Implement session management
- [ ] Add biometric login option
- [ ] Design visual improvements
- [ ] Add comprehensive error handling
- [ ] Test on iOS and Android
