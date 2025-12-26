/**
 * OTP Service for Indian Crop Intelligence Engine
 * Handles OTP generation, validation, and rate limiting
 */

import * as kv from "./kv_store.tsx";

// OTP Configuration
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS_PER_HOUR = 5;
const OTP_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

interface OTPRecord {
  mobile_number: string;
  otp_code: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
  attempts: number;
}

interface OTPAttemptRecord {
  mobile_number: string;
  attempts: OTPRecord[];
  last_reset: string;
}

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  // FOR DEVELOPMENT: Always return 123456 until SMS service is implemented
  // In production with SMS, use: Math.floor(100000 + Math.random() * 900000).toString();
  console.log('🔐 Development OTP Mode: Using fixed OTP 123456');
  return "123456";
}

/**
 * Hash OTP for secure storage (simple hash for MVP)
 * In production, use bcrypt or similar
 */
export function hashOTP(otp: string): string {
  // For development mode with fixed OTP, just return the plain OTP
  // In production, use proper hashing: btoa(otp) or bcrypt
  return otp; // Plain text for dev mode since OTP is always "123456"
}

/**
 * Verify hashed OTP
 */
export function verifyOTP(plainOTP: string, storedOTP: string): boolean {
  // Direct comparison for development mode
  return plainOTP === storedOTP;
}

/**
 * Check rate limiting for OTP requests
 */
export async function checkRateLimit(mobileNumber: string): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: string;
}> {
  const rateLimitKey = `otp:ratelimit:${mobileNumber}`;
  const rateLimitData = await kv.get(rateLimitKey) as OTPAttemptRecord | null;

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - OTP_RATE_LIMIT_WINDOW);

  if (!rateLimitData) {
    // No rate limit data exists, allow request
    return {
      allowed: true,
      remainingAttempts: MAX_OTP_ATTEMPTS_PER_HOUR - 1,
    };
  }

  // Filter attempts within the last hour
  const recentAttempts = rateLimitData.attempts.filter(
    (attempt) => new Date(attempt.created_at) > oneHourAgo
  );

  if (recentAttempts.length >= MAX_OTP_ATTEMPTS_PER_HOUR) {
    // Rate limit exceeded
    const oldestAttempt = recentAttempts[0];
    const resetTime = new Date(
      new Date(oldestAttempt.created_at).getTime() + OTP_RATE_LIMIT_WINDOW
    );

    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: resetTime.toISOString(),
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_OTP_ATTEMPTS_PER_HOUR - recentAttempts.length - 1,
  };
}

/**
 * Update rate limit counter
 */
export async function updateRateLimit(mobileNumber: string, otpRecord: OTPRecord): Promise<void> {
  const rateLimitKey = `otp:ratelimit:${mobileNumber}`;
  const rateLimitData = await kv.get(rateLimitKey) as OTPAttemptRecord | null;

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - OTP_RATE_LIMIT_WINDOW);

  let attempts: OTPRecord[] = [];
  
  if (rateLimitData) {
    // Filter out attempts older than 1 hour
    attempts = rateLimitData.attempts.filter(
      (attempt) => new Date(attempt.created_at) > oneHourAgo
    );
  }

  attempts.push(otpRecord);

  await kv.set(rateLimitKey, {
    mobile_number: mobileNumber,
    attempts,
    last_reset: now.toISOString(),
  });
}

/**
 * Create and store a new OTP
 */
export async function createOTP(mobileNumber: string): Promise<{
  success: boolean;
  otp?: string; // Only return in development/testing
  expiresAt?: string;
  error?: string;
  remainingAttempts?: number;
  resetTime?: string;
}> {
  // Check rate limiting
  const rateLimit = await checkRateLimit(mobileNumber);
  
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'Too many OTP requests. Please try again later.',
      remainingAttempts: 0,
      resetTime: rateLimit.resetTime,
    };
  }

  // Delete any existing OTP for this number (fresh start)
  const oldOtpKey = `otp:${mobileNumber}`;
  await kv.del(oldOtpKey);
  console.log('Cleared any existing OTP for', mobileNumber);

  // Generate OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const otpRecord: OTPRecord = {
    mobile_number: mobileNumber,
    otp_code: hashedOTP,
    expires_at: expiresAt.toISOString(),
    is_used: false,
    created_at: now.toISOString(),
    attempts: 0,
  };

  // Store OTP in KV store
  const otpKey = `otp:${mobileNumber}`;
  await kv.set(otpKey, otpRecord);

  // Update rate limit
  await updateRateLimit(mobileNumber, otpRecord);

  console.log(`OTP created for ${mobileNumber}: ${otp} (expires at ${expiresAt.toISOString()})`);

  // TODO: In production, send OTP via SMS service (Twilio, AWS SNS, etc.)
  // For MVP, we'll return the OTP in the response (INSECURE - only for testing)
  
  return {
    success: true,
    otp: otp, // REMOVE THIS IN PRODUCTION!
    expiresAt: expiresAt.toISOString(),
    remainingAttempts: rateLimit.remainingAttempts,
  };
}

/**
 * Verify an OTP
 */
export async function verifyOTPCode(
  mobileNumber: string,
  otp: string
): Promise<{
  success: boolean;
  error?: string;
  isNewUser?: boolean;
}> {
  const otpKey = `otp:${mobileNumber}`;
  const otpRecord = await kv.get(otpKey) as OTPRecord | null;

  if (!otpRecord) {
    return {
      success: false,
      error: 'Invalid OTP or OTP has expired',
    };
  }

  // Check if OTP is already used
  if (otpRecord.is_used) {
    return {
      success: false,
      error: 'OTP has already been used',
    };
  }

  // Check if OTP has expired
  const now = new Date();
  const expiresAt = new Date(otpRecord.expires_at);
  
  if (now > expiresAt) {
    // Clean up expired OTP
    await kv.del(otpKey);
    return {
      success: false,
      error: 'OTP has expired. Please request a new one.',
    };
  }

  // Verify OTP
  if (!verifyOTP(otp, otpRecord.otp_code)) {
    // Increment attempt counter
    otpRecord.attempts += 1;
    
    console.log(`❌ OTP verification failed for ${mobileNumber}. Input: "${otp}", Expected: "${otpRecord.otp_code}"`);
    
    // Lock after 3 failed attempts
    if (otpRecord.attempts >= 3) {
      await kv.del(otpKey);
      return {
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.',
      };
    }
    
    await kv.set(otpKey, otpRecord);
    
    return {
      success: false,
      error: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`,
    };
  }

  console.log(`✅ OTP verified successfully for ${mobileNumber}`);

  // Mark OTP as used
  otpRecord.is_used = true;
  await kv.set(otpKey, otpRecord);

  // Check if user exists (using consistent key structure)
  const userMobileKey = `user:mobile:${mobileNumber}`;
  const existingUser = await kv.get(userMobileKey);

  console.log(`Checking for existing user at key: ${userMobileKey}`);
  console.log(`Existing user found: ${existingUser ? 'YES' : 'NO'}`);

  return {
    success: true,
    isNewUser: !existingUser,
  };
}

/**
 * Clean up old OTPs (housekeeping function)
 */
export async function cleanupExpiredOTPs(): Promise<void> {
  // Get all OTP keys
  const otpKeys = await kv.getByPrefix('otp:');
  const now = new Date();

  for (const item of otpKeys) {
    const otpRecord = item as OTPRecord;
    const expiresAt = new Date(otpRecord.expires_at);
    
    if (now > expiresAt) {
      const otpKey = `otp:${otpRecord.mobile_number}`;
      await kv.del(otpKey);
      console.log(`Cleaned up expired OTP for ${otpRecord.mobile_number}`);
    }
  }
}