# SMS OTP Integration Guide for Production

## Current Status
The app is currently using a **development OTP system** where:
- OTP is always `123456` in development mode
- OTP is returned in the API response (insecure, for testing only)
- No actual SMS is sent to users

## To Enable Real SMS for Production

### 1. Set Environment Variable
Set `ENVIRONMENT=production` in your Supabase Edge Function environment:
```bash
# In Supabase Dashboard > Edge Functions > Settings
ENVIRONMENT=production
```

When this is set, the system will:
- Generate random 6-digit OTPs
- NOT return the OTP in API responses
- Require you to implement actual SMS sending

### 2. Choose an SMS Provider

#### Option A: Twilio (Recommended for India)
1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token
3. Buy an Indian phone number or use Twilio's test credentials
4. Add to Supabase environment:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

5. Update `/supabase/functions/server/index.tsx` line ~380-385:
   ```typescript
   // Import Twilio SDK
   import Twilio from 'npm:twilio';
   
   // In the /auth/otp/send endpoint, replace the TODO with:
   const twilioClient = Twilio(
     Deno.env.get('TWILIO_ACCOUNT_SID'),
     Deno.env.get('TWILIO_AUTH_TOKEN')
   );
   
   await twilioClient.messages.create({
     body: `Your OTP for Crop Intelligence Engine is: ${result.otp}. Valid for 5 minutes.`,
     from: Deno.env.get('TWILIO_PHONE_NUMBER'),
     to: `+91${formattedMobile}`
   });
   ```

#### Option B: AWS SNS
1. Set up AWS account and SNS service
2. Configure IAM credentials with SNS permissions
3. Add to Supabase environment:
   ```
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=ap-south-1
   ```

4. Install AWS SDK and implement:
   ```typescript
   import { SNSClient, PublishCommand } from "npm:@aws-sdk/client-sns";
   
   const snsClient = new SNSClient({
     region: Deno.env.get('AWS_REGION'),
     credentials: {
       accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID'),
       secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY'),
     }
   });
   
   await snsClient.send(new PublishCommand({
     PhoneNumber: `+91${formattedMobile}`,
     Message: `Your OTP for Crop Intelligence Engine is: ${result.otp}. Valid for 5 minutes.`
   }));
   ```

#### Option C: MSG91 (Popular in India)
1. Sign up at https://msg91.com
2. Get your Auth Key
3. Add to Supabase environment:
   ```
   MSG91_AUTH_KEY=your_auth_key
   MSG91_TEMPLATE_ID=your_template_id
   ```

4. Implement:
   ```typescript
   const response = await fetch('https://api.msg91.com/api/v5/otp', {
     method: 'POST',
     headers: {
       'authkey': Deno.env.get('MSG91_AUTH_KEY'),
       'content-type': 'application/json'
     },
     body: JSON.stringify({
       template_id: Deno.env.get('MSG91_TEMPLATE_ID'),
       mobile: `91${formattedMobile}`,
       otp: result.otp
     })
   });
   ```

### 3. Remove Development UI Elements

Update `/src/app/components/MobileAuthScreen.tsx`:

**Remove these lines (213-219):**
```typescript
{/* OTP Authentication Notice */}
<div className=\"absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4\">
  <div className=\"bg-primary/10 border border-primary/30 rounded-lg p-3 backdrop-blur-sm\">
    <p className=\"text-xs text-center text-foreground\">
      <span className=\"font-semibold\">🔐 Dev Mode:</span> OTP is always <span className=\"font-mono font-bold\">123456</span> for testing
    </p>
  </div>
</div>
```

**Remove these lines (488-498):**
```typescript
{/* Demo Notice */}
{step === 'mobile' && (
  <div className=\"mt-6 p-4 bg-muted/50 rounded-lg border border-border\">
    <p className=\"text-xs text-foreground mb-2\">
      📱 <span className=\"font-semibold\">Testing Instructions:</span>
    </p>
    <div className=\"space-y-1 text-xs text-muted-foreground\">
      <p>• Enter any 10-digit mobile number (6-9 prefix)</p>
      <p>• OTP is always: <span className=\"font-mono text-foreground font-bold\">123456</span></p>
      <p>• Accounts are auto-created on first login</p>
    </div>
  </div>
)}
```

### 4. Update Frontend OTP Handling

In `/src/app/components/MobileAuthScreen.tsx`, update the `handleSendOTP` function (lines 113-120):

```typescript
// Remove the development mode check and OTP display
if (data.status === 'OTP_SENT') {
  setOtpSentMessage('OTP sent successfully! Check your phone.');
  toast.success(`OTP sent to ${mobileNumber}!`);
  setStep('otp');
} else {
  throw new Error('Failed to send OTP');
}
```

### 5. Testing in Production

1. **Deploy to Supabase** with `ENVIRONMENT=production`
2. **Test with your own phone number** first
3. **Monitor logs** in Supabase Dashboard
4. **Check SMS delivery** and verify OTPs work
5. **Monitor costs** - most SMS providers charge per message

### 6. Production Checklist

- [ ] Environment variable `ENVIRONMENT=production` is set
- [ ] SMS provider is configured with valid credentials
- [ ] SMS sending code is implemented and tested
- [ ] Development UI notices are removed
- [ ] OTP is NOT returned in API responses
- [ ] Phone number validation is working
- [ ] Rate limiting is enabled (already implemented)
- [ ] Error messages are user-friendly
- [ ] Costs are monitored and acceptable
- [ ] DND (Do Not Disturb) regulations are followed for India

### 7. Cost Estimates (India)

- **Twilio**: ₹0.50 - ₹1.50 per SMS
- **AWS SNS**: ₹0.50 - ₹1.00 per SMS
- **MSG91**: ₹0.15 - ₹0.40 per SMS (usually cheapest for India)

For 1,000 users/day = ₹150 - ₹1,500/day depending on provider.

### 8. Regulatory Compliance (India)

- **DLT Registration**: Required for commercial SMS in India
- **Sender ID**: Must register your business name
- **Templates**: SMS content must be pre-approved
- **TRAI Guidelines**: Follow NDNC/DND regulations

For MVP testing, you can use transactional SMS routes which don't require full DLT registration, but for production you MUST comply.

---

## Current Development Setup

The app currently works in development mode without any SMS provider:
- Set `ENVIRONMENT=development` (or leave unset)
- OTP will always be `123456`
- Perfect for testing and development
- No SMS costs incurred

## Questions?

Check the code comments in:
- `/supabase/functions/server/index.tsx` (line ~380)
- `/supabase/functions/server/otp_service.ts` (line ~28)
