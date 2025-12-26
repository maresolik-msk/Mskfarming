# 🚀 Quick Start Guide

## For Users Testing the App

### Login Credentials
```
📱 Mobile: Any 10-digit number (6-9 prefix)
🔐 OTP: 123456
```

### Examples
```
✅ 9876543210
✅ 9988776655
✅ 7654321098
✅ 8123456789
✅ 6987654321
```

### Steps
1. Open `/login`
2. Enter your 10-digit mobile number
3. Select your role (Farmer/Expert/Admin)
4. Select your language
5. Accept terms and conditions
6. Click "Send OTP"
7. Enter OTP: **123456**
8. Click "Verify & Login"
9. Complete onboarding (or skip steps)
10. Access your personalized dashboard!

---

## For Developers

### Current System
- **User ID**: Mobile number itself
- **OTP**: Always `123456` (no SMS)
- **Storage**: Supabase KV
- **Auth**: Token-based (24h access)

### Test Users
```javascript
// User 1
{ mobile: "9876543210", otp: "123456" }

// User 2  
{ mobile: "9988776655", otp: "123456" }

// User 3
{ mobile: "7654321098", otp: "123456" }
```

### API Endpoints
```
POST /auth/otp/send
  → { mobile_number: "9876543210" }
  ← { otp: "123456", status: "OTP_SENT" }

POST /auth/otp/verify
  → { mobile_number: "9876543210", otp: "123456", role: "farmer", language: "english" }
  ← { access_token: "...", user: {...} }

POST /onboarding/complete
  Headers: { Authorization: "Bearer <access_token>" }
  → { field: {...}, crop: {...}, location: {...} }
  ← { success: true, user: {...} }
```

### Storage Keys
```
user:9876543210                 → User profile
field:9876543210:1735286400000  → Field data
crop:9876543210:1735286400000   → Crop data
otp:9876543210                  → OTP record
auth:token:access_9876...       → Access token
```

### Clear Session
```javascript
localStorage.clear();
location.reload();
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `/README_LIVE_READY.md` | **Start here!** Complete overview |
| `/SIMPLIFIED_AUTH_SYSTEM.md` | Auth system details |
| `/PRODUCTION_DEPLOYMENT.md` | Deployment guide |
| `/SMS_INTEGRATION_GUIDE.md` | SMS provider setup |

---

## Status

✅ **LIVE-READY** (Development Mode)
- OTP: `123456`
- User ID: Mobile number
- No SMS costs
- Ready for real user testing!

---

## Support

Questions? Check:
1. Browser console (F12)
2. Server logs (Supabase)
3. Documentation files above

---

**Built with ❤️ for Indian Farmers**
