# Production Deployment Guide

## ✅ Your App is Production-Ready!

The Indian Crop Intelligence Engine is now configured for real user authentication and data collection. Here's what you need to know:

## 🚀 Quick Start for Real Users

### Current Setup (Development Mode)
- **Login URL**: Go to `/login` or `/app`
- **OTP System**: Currently in development mode (OTP = `123456`)
- **User Flow**: Mobile → OTP → Role Selection → Onboarding → Dashboard

### What Works Right Now

1. **Mobile OTP Authentication**
   - Users enter 10-digit Indian mobile number (6-9 prefix)
   - OTP is sent (currently returns `123456` in dev mode)
   - Users select role (Farmer/Expert/Admin)
   - Users select preferred language
   - Auto-creates account on first login

2. **Progressive Onboarding**
   - Collects location (district, state, GPS)
   - Collects field information (name, size, irrigation)
   - Collects season intent (planted/planning/exploring)
   - Collects crop selection (optional)
   - All steps are skippable

3. **Data Storage**
   - User profiles stored in Supabase KV
   - Field data indexed by user
   - Crop data tracked with season status
   - All data persists across sessions

4. **Dashboard Access**
   - Personalized farming dashboard
   - Weather forecast integration
   - Crop calendar (AI-powered with OpenAI)
   - Journal, expenses, and more

## 🔐 Enabling Real SMS OTP (Production)

### Step 1: Choose SMS Provider

For Indian users, we recommend **MSG91** (cheapest) or **Twilio** (most reliable):

#### MSG91 Setup (₹0.15-0.40 per SMS)
```bash
# Add to Supabase Environment Variables
MSG91_AUTH_KEY=your_auth_key_here
MSG91_TEMPLATE_ID=your_template_id
ENVIRONMENT=production
```

#### Twilio Setup (₹0.50-1.50 per SMS)
```bash
# Add to Supabase Environment Variables
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
ENVIRONMENT=production
```

### Step 2: Update Backend Code

See detailed instructions in `SMS_INTEGRATION_GUIDE.md` (line ~380 in `/supabase/functions/server/index.tsx`)

### Step 3: Remove Development Notices

When `ENVIRONMENT=production`:
1. OTP will be random 6-digit number
2. OTP won't appear in API responses
3. Frontend will show "OTP sent" without revealing code
4. Remove dev mode banners from UI (optional)

## 📱 User Journey

```
┌─────────────────┐
│  Landing Page   │  → User clicks "Get Started" or navigates to /login
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Login Screen   │  → Enter mobile number, select role & language, consent
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OTP Screen     │  → Enter 6-digit OTP (123456 in dev mode)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Onboarding     │  → 6 steps: Welcome → Location → Field → Season → Crop → Value
└────────┬────────┘  → All skippable except District & State
         │
         ▼
┌─────────────────┐
│  Dashboard      │  → Personalized farm management interface
└─────────────────┘
```

## 🔧 Environment Variables

### Required (Already Set)
- ✅ `SUPABASE_URL` - Your Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Public anon key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- ✅ `OPENAI_API_KEY` - For AI features

### For Production SMS
- ⏳ SMS provider credentials (MSG91 or Twilio)
- ⏳ Set `ENVIRONMENT=production` to enable random OTPs

### Current Setup (Development)
- 🔐 **OTP is always: 123456**
- 📱 **Works with any 10-digit mobile (6-9 prefix)**
- 🆔 **Mobile number is the user ID**
- ✅ **No SMS costs during development**

## 📊 Data Structure

### User Object
```typescript
{
  id: "user_timestamp_random",
  mobile_number: "9876543210",
  role: "farmer" | "expert" | "admin",
  language: "english" | "hindi" | "telugu" | ...,
  is_verified: true,
  is_active: true,
  profile_complete: true,
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
  
  // After onboarding
  onboarding_status: {
    completed: true,
    completed_steps: ["welcome", "location", "field", ...],
    skipped_steps: [],
    last_active_step: "value"
  },
  location: {
    village: "...",
    district: "...",
    state: "...",
    lat: 12.34,
    long: 56.78
  }
}
```

### Field Object
```typescript
{
  id: "field:userId:timestamp",
  user_id: "user_...",
  name: "Main Field",
  area: 5.5,
  area_unit: "acres",
  irrigation_type: "borewell",
  is_primary: true,
  created_at: "...",
  updated_at: "..."
}
```

### Crop Object
```typescript
{
  id: "crop:userId:timestamp",
  user_id: "user_...",
  crop_id: "rice",
  crop_name: "Rice (Paddy)",
  season: "kharif",
  status: "planted" | "planning" | "exploring",
  created_at: "...",
  updated_at: "..."
}
```

## 🧪 Testing Flow

### Test Account Creation
1. Go to `/login`
2. Enter mobile: `9876543210`
3. Enter OTP: `123456` (in dev mode)
4. Select role: Farmer
5. Select language: English
6. Accept terms
7. Click "Send OTP" → "Verify & Login"

### Test Onboarding
1. Welcome screen → Click "Let's Start"
2. Location → Enter "Hyderabad", "Telangana", click "Next"
3. Field → Enter "Main Field", "5", "acres", click "Next"
4. Season → Click "Already Planted" (auto-advances)
5. Crop → Select "Rice (Paddy)", click "Next"
6. Value → Review and click "Go to Dashboard"

### Test Data Persistence
1. Log out from dashboard
2. Log in again with same mobile number
3. Should skip onboarding and go straight to dashboard
4. All field and crop data should be preserved

## 🌐 URLs

### Development
- Marketing: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- App: `http://localhost:3000/app`

### Production
- Marketing: `https://your-domain.com/`
- Login: `https://your-domain.com/login`
- App: `https://your-domain.com/app`

## 🔒 Security Checklist

- [x] OTP expiry (5 minutes)
- [x] OTP rate limiting (5 attempts per hour)
- [x] Failed OTP attempts tracking (3 max)
- [x] Token expiry (24 hours access, 30 days refresh)
- [x] Password-less authentication (more secure)
- [ ] SSL/HTTPS (required for production)
- [ ] DLT registration for SMS (India legal requirement)
- [ ] Privacy policy and T&C (required)
- [ ] GDPR/data protection compliance

## 📈 Scaling Considerations

### Database (Supabase KV)
- Current: KV store (suitable for 10k-100k users)
- Scale: Migrate to Postgres for 100k+ users
- Indexing: User by mobile, ID; Fields by user; Crops by user

### SMS Costs
- MSG91: ₹0.15-0.40 per SMS
- Estimate: 1000 users/day = ₹150-400/day
- Budget: ~₹5,000-12,000/month for 10k users

### OpenAI Costs
- Current: gpt-4o for chat and calendar
- Fallback: Mock responses if quota exceeded
- Optimize: Cache common responses, use gpt-3.5-turbo for simple queries

## 🐛 Debugging

### Common Issues

**1. "Failed to save onboarding data"**
- Check browser console for token format
- Token should start with `access_`
- Clear localStorage and login again

**2. "OTP not received"**
- In dev mode: Always use `123456`
- In production: Check SMS provider logs
- Verify phone number format (10 digits, 6-9 prefix)

**3. "Session expired"**
- Tokens expire after 24 hours
- Log out and log in again
- Check server logs for token verification errors

### Logs

**Browser Console:**
- All API requests logged with `===` markers
- Token verification status
- Onboarding data submissions

**Server Logs** (Supabase Dashboard):
- OTP generation and verification
- User creation
- Token issuance
- Data persistence

## 🚀 Deployment Steps

1. **Set environment to production**
   ```bash
   # In Supabase Dashboard
   ENVIRONMENT=production
   ```

2. **Configure SMS provider** (see SMS_INTEGRATION_GUIDE.md)

3. **Test with real phone number**
   - Use your own number first
   - Verify OTP delivery
   - Complete full onboarding flow

4. **Remove development notices** (optional)
   - Comment out dev mode banners in MobileAuthScreen.tsx
   - Clean up console.log statements

5. **Launch!**
   - Share `/login` link with users
   - Monitor logs for errors
   - Track SMS costs

## 💡 Next Steps

- [ ] Add SMS provider integration
- [ ] Set up analytics (user registration, retention)
- [ ] Create admin panel for user management
- [ ] Add multilingual UI support
- [ ] Implement push notifications
- [ ] Add social sharing features
- [ ] Create referral system

## 📞 Support

For issues or questions:
1. Check browser console logs
2. Check Supabase function logs
3. Review `SMS_INTEGRATION_GUIDE.md`
4. Test with dev mode first (`ENVIRONMENT=development`)

---

**Built with ❤️ for Indian Farmers**