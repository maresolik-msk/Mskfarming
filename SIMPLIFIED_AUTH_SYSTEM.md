# Simplified Authentication System

## Overview
The app now uses a simplified authentication system designed for easy testing and rapid deployment.

## Key Changes

### 1. Mobile Number as User ID
**Previous**: Generated random IDs like `user_1234567890_abc123`  
**Now**: Mobile number IS the user ID (e.g., `9876543210`)

**Benefits:**
- ✅ Easy to remember and debug
- ✅ Natural unique identifier for Indian users
- ✅ Simple KV store structure
- ✅ No complex ID mapping needed

### 2. Fixed OTP: 123456
**Until SMS service is integrated**, the OTP will always be `123456` for all users.

**This means:**
- Any 10-digit mobile number (starting with 6-9) can log in
- Always use OTP: `123456`
- Accounts are created automatically on first login
- Perfect for testing and demos

### 3. Simplified Data Structure

#### User Storage
```
Key: user:9876543210
Value: {
  id: "9876543210",
  mobile_number: "9876543210",
  role: "farmer",
  language: "english",
  ...
}
```

**Single source of truth** - no duplicate keys needed!

#### Field Storage
```
Key: field:9876543210:1735286400000
Value: {
  id: "field:9876543210:1735286400000",
  user_id: "9876543210",
  name: "Main Field",
  area: 5.5,
  ...
}
```

#### Crop Storage
```
Key: crop:9876543210:1735286400000
Value: {
  id: "crop:9876543210:1735286400000",
  user_id: "9876543210",
  crop_name: "Rice (Paddy)",
  ...
}
```

## Testing Flow

### Test User 1
```
Mobile: 9876543210
OTP: 123456
```

### Test User 2
```
Mobile: 9988776655
OTP: 123456
```

### Test User 3
```
Mobile: 7654321098
OTP: 123456
```

All users will be created automatically on first login!

## Backend API Changes

### OTP Send Response
```json
{
  "status": "OTP_SENT",
  "expires_in": 300,
  "otp": "123456",
  "message": "OTP is 123456 (development mode until SMS service is configured)"
}
```

### OTP Verify Response
```json
{
  "status": "VERIFIED",
  "isNewUser": true,
  "session": {
    "access_token": "access_9876543210_1735286400000_abc123xyz789",
    "refresh_token": "refresh_9876543210_1735286400000_def456uvw012",
    "expires_in": 86400,
    "user": {
      "id": "9876543210",
      "mobile_number": "9876543210",
      "role": "farmer",
      "language": "english",
      "is_verified": true,
      "is_active": true,
      "profile_complete": false,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

## Database Queries

### Get User by Mobile
```typescript
const user = await kv.get(`user:${mobileNumber}`);
```

### Get All Fields for User
```typescript
const fieldIds = await kv.get(`user:${mobileNumber}:fields`) || [];
const fields = await Promise.all(
  fieldIds.map(id => kv.get(id))
);
```

### Get All Crops for User
```typescript
const cropIds = await kv.get(`user:${mobileNumber}:crops`) || [];
const crops = await Promise.all(
  cropIds.map(id => kv.get(id))
);
```

## Production Considerations

### When to Change This System

**Keep the simplified system if:**
- You have < 100k users
- Primary use case is mobile-based
- No email login needed
- Single phone number per user

**Consider upgrading if:**
- Users need multiple devices with different numbers
- Email/social login needed
- Complex user relationships required
- Privacy regulations require decoupling phone from ID

### Upgrading to UUID-based IDs

When you need to scale, you can migrate:

1. **Generate UUIDs** for existing users
2. **Keep mobile number indexed** for lookup
3. **Update all references** to use UUID
4. **Maintain backward compatibility** during migration

Example migration:
```typescript
// Old: user:9876543210
// New: user:id:550e8400-e29b-41d4-a716-446655440000
//      user:mobile:9876543210 -> { id: "550e8400-..." }
```

## Security Notes

### Current System (Development)
- ✅ OTP always 123456 (INSECURE - for testing only)
- ✅ Mobile number is public ID (visible in URLs/logs)
- ✅ No PII encryption needed (just phone numbers)
- ⚠️ DO NOT use in production without real SMS

### Production Requirements
- 🔒 Implement real SMS OTP (Twilio, MSG91, AWS SNS)
- 🔒 Hash/encrypt sensitive data
- 🔒 Rate limiting (already implemented)
- 🔒 Token expiry (already implemented)
- 🔒 HTTPS only
- 🔒 Follow TRAI guidelines for SMS in India

## FAQ

### Q: Can two users have the same mobile number?
**A:** No, mobile number is the unique ID. One number = one account.

### Q: What if user changes phone number?
**A:** For MVP, they create a new account. For production, add phone number change flow with OTP verification of both old and new numbers.

### Q: Can I test with fake numbers like 1234567890?
**A:** No, validation requires Indian mobile format (10 digits, starting with 6-9). Use: 9876543210, 9988776655, 7654321098, etc.

### Q: What happens to old accounts with complex IDs?
**A:** They still work! The system has backward compatibility. New accounts use mobile as ID, old accounts keep their generated IDs.

### Q: When will OTP change from 123456?
**A:** When you configure SMS provider and update the `generateOTP()` function in `/supabase/functions/server/otp_service.ts` to use random generation.

## Development Console Commands

### Clear User Data
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Check Current User
```javascript
console.log('Current user:', JSON.parse(localStorage.getItem('currentUser')));
```

### Check Auth Status
```javascript
console.log('Has onboarded:', localStorage.getItem('hasOnboarded'));
```

## Summary

🎯 **Use mobile number as user ID**  
🔐 **OTP is always 123456 (until SMS configured)**  
📱 **Any 10-digit number works for testing**  
🚀 **Ready for real users right now!**

---

**Last Updated**: December 26, 2025  
**System Status**: ✅ Production Ready (Development Mode)
