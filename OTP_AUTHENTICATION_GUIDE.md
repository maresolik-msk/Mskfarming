# OTP-Based Mobile Authentication System

## Overview

The Indian Crop Intelligence Engine now features a comprehensive OTP-based mobile authentication system designed specifically for farmers in low-connectivity areas. This system follows the authentication philosophy you specified with mobile number + OTP as the PRIMARY login method.

## Architecture

### 1. Three-Tier Architecture
```
Frontend (React) → Server (Hono/Deno) → Database (KV Store)
```

### 2. Key Components

#### Backend Services
- **`/supabase/functions/server/otp_service.ts`** - OTP generation, validation, and rate limiting
- **`/supabase/functions/server/auth_service.ts`** - User management, JWT tokens, and role-based access
- **`/supabase/functions/server/index.tsx`** - API routes for authentication

#### Frontend Components
- **`/src/app/components/MobileAuthScreen.tsx`** - OTP-based login UI
- **`/src/app/components/LoginScreen.tsx`** - Dual auth (email/password + mobile OTP)

## API Endpoints

### 1. Send OTP
```
POST /make-server-6fdef95d/auth/otp/send
```

**Request:**
```json
{
  "mobile_number": "9876543210"
}
```

**Response:**
```json
{
  "status": "OTP_SENT",
  "expires_in": 300,
  "otp": "123456",  // ONLY IN DEVELOPMENT - REMOVE IN PRODUCTION
  "remainingAttempts": 4
}
```

**Rate Limiting:**
- Maximum 5 OTP requests per hour per mobile number
- Attempts reset after 1 hour
- Returns `429` if limit exceeded

---

### 2. Verify OTP & Login/Signup
```
POST /make-server-6fdef95d/auth/otp/verify
```

**Request (Existing User):**
```json
{
  "mobile_number": "9876543210",
  "otp": "123456"
}
```

**Request (New User):**
```json
{
  "mobile_number": "9876543210",
  "otp": "123456",
  "full_name": "Raj Kumar"
}
```

**Response:**
```json
{
  "status": "VERIFIED",
  "isNewUser": false,
  "session": {
    "access_token": "access_user123_1234567890_abc",
    "refresh_token": "refresh_user123_1234567890_xyz",
    "expires_in": 86400,
    "user": {
      "id": "user_1234567890_abc",
      "mobile_number": "9876543210",
      "full_name": "Raj Kumar",
      "role": "farmer",
      "is_verified": true,
      "is_active": true,
      "language": "English",
      "location": "India"
    }
  },
  "user": { /* same as session.user */ }
}
```

---

### 3. Refresh Access Token
```
POST /make-server-6fdef95d/auth/refresh
```

**Request:**
```json
{
  "refresh_token": "refresh_user123_1234567890_xyz"
}
```

**Response:**
```json
{
  "access_token": "access_user123_9876543210_new",
  "refresh_token": "refresh_user123_9876543210_new",
  "expires_in": 86400
}
```

## Database Schema (KV Store)

The system uses the KV store with the following key patterns:

### Users
```
user:mobile:{mobile_number} → User object
user:id:{user_id} → User object
```

**User Object:**
```typescript
{
  id: string;
  mobile_number: string;
  email?: string;
  full_name: string;
  role: 'farmer' | 'expert' | 'admin';
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  location?: string;
  language?: string;
  profile_complete?: boolean;
}
```

### OTP Records
```
otp:{mobile_number} → OTP record
otp:ratelimit:{mobile_number} → Rate limit record
```

**OTP Record:**
```typescript
{
  mobile_number: string;
  otp_code: string;  // Base64 hashed
  expires_at: string;
  is_used: boolean;
  created_at: string;
  attempts: number;
}
```

### Auth Tokens
```
auth:token:{access_token} → Token data
auth:refresh:{refresh_token} → Token data
auth:user:{user_id}:token → Token data
```

**Token Data:**
```typescript
{
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
}
```

## Security Features

### 1. OTP Security
- **6-digit numeric OTP**
- **5-minute expiry**
- **Simple hashing** (Base64 for MVP - use bcrypt in production)
- **Single-use only** (marked as used after verification)
- **3 failed attempts** before OTP is invalidated

### 2. Rate Limiting
- **5 OTP requests per hour** per mobile number
- **Sliding window** rate limiting
- **Automatic cleanup** of expired rate limit data

### 3. Token Security
- **Access token**: 24-hour expiry
- **Refresh token**: 30-day expiry
- **Token rotation** on refresh (old tokens invalidated)
- **User validation** on every token use

### 4. Mobile Number Validation
- **Indian mobile numbers only**: 10 digits starting with 6-9
- **Format normalization**: Removes spaces, dashes, parentheses
- **Regex validation**: `/^[6-9]\d{9}$/`

## User Roles

The system supports three role types:

1. **`farmer`** (default) - Core users (field owners/cultivators)
2. **`expert`** - Agronomists/advisors
3. **`admin`** - Platform management

Roles are assigned during user creation and stored in the user object.

## Frontend Usage

### Using Mobile OTP Login

```tsx
import { MobileAuthScreen } from './components/MobileAuthScreen';

function App() {
  const handleLogin = (user) => {
    console.log('User logged in:', user);
    // Store user in state, redirect to dashboard, etc.
  };

  return (
    <MobileAuthScreen 
      onLogin={handleLogin}
      onSwitchToEmail={() => {/* Switch to email auth */}}
    />
  );
}
```

### Flow

1. **User enters mobile number** (10 digits)
2. **System sends OTP** (shown in console for dev)
3. **User enters OTP** (6 digits)
4. **System verifies OTP**
5. **If new user**: Collect name
6. **Login successful**: Receive access token & user data

## Demo/Testing

### Demo Mobile Number
```
Mobile: 9876543210
```

When you request an OTP for this number:
- The OTP will be generated
- **In development**, the OTP is returned in the API response
- **In production**, integrate an SMS service (Twilio, AWS SNS, etc.)

### Testing Flow

1. Enter `9876543210` on the mobile login screen
2. Click "Send OTP"
3. Check browser console for the OTP (e.g., `123456`)
4. Enter the OTP
5. Complete the flow

## Production Deployment Checklist

⚠️ **CRITICAL CHANGES FOR PRODUCTION:**

### 1. Remove OTP from Response
In `/supabase/functions/server/otp_service.ts`:
```typescript
// REMOVE THIS:
return {
  success: true,
  otp: otp, // <-- DELETE THIS LINE
  expiresAt: expiresAt.toISOString(),
};

// USE THIS:
return {
  success: true,
  expiresAt: expiresAt.toISOString(),
};
```

### 2. Integrate SMS Service
Add SMS sending in `otp_service.ts`:
```typescript
// TODO: Send OTP via SMS
// Example with Twilio:
await twilioClient.messages.create({
  body: `Your OTP is: ${otp}. Valid for 5 minutes.`,
  to: `+91${mobileNumber}`,
  from: process.env.TWILIO_PHONE_NUMBER
});
```

### 3. Use Proper Password Hashing
Replace Base64 hashing with bcrypt:
```typescript
import * as bcrypt from 'npm:bcrypt';

export function hashOTP(otp: string): string {
  return bcrypt.hashSync(otp, 10);
}

export function verifyOTP(plainOTP: string, hashedOTP: string): boolean {
  return bcrypt.compareSync(plainOTP, hashedOTP);
}
```

### 4. Implement Proper JWT
Use a JWT library with secret key signing:
```typescript
import * as jose from 'npm:jose';

const secret = new TextEncoder().encode(
  Deno.env.get('JWT_SECRET_KEY')
);

export async function encodeJWT(payload: JWTPayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}
```

### 5. Environment Variables
Add to your production environment:
```
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 6. HTTPS Only
Ensure all API calls use HTTPS in production.

### 7. Logging & Monitoring
- Remove `console.log` statements with OTP values
- Add proper logging with tools like Sentry
- Monitor OTP abuse patterns
- Track failed login attempts

## Migration from Email Auth

The system supports **both email/password and mobile OTP** authentication:

- Users can toggle between auth methods
- Existing email/password users can continue logging in
- New users are encouraged to use mobile OTP (default)
- Tokens from both systems are compatible

## Troubleshooting

### OTP Not Received
- Check rate limiting (max 5 per hour)
- Verify mobile number format (10 digits, starts with 6-9)
- In dev: Check browser console for OTP

### Invalid OTP Error
- OTP expires in 5 minutes
- Each OTP can only be used once
- After 3 failed attempts, request new OTP

### Token Expired
- Access tokens expire after 24 hours
- Use refresh token to get new access token
- Refresh tokens expire after 30 days

## Next Steps

To complete the authentication system, consider:

1. **SMS Integration** - Integrate Twilio/AWS SNS for production
2. **Social Login** - Add Google/Facebook OAuth
3. **Biometric Auth** - Fingerprint/Face ID for mobile apps
4. **2FA** - Optional second factor for admin users
5. **Password Recovery** - OTP-based password reset for email users
6. **Account Linking** - Link mobile and email accounts

## Support

For issues or questions about the authentication system:
- Check the console logs for detailed error messages
- Review the API endpoint logs in the server
- Test with the demo mobile number: 9876543210

---

**Last Updated:** December 26, 2024  
**Version:** 1.0.0  
**Author:** Indian Crop Intelligence Engine Team
