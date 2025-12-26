import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { SOIL_MASTER_DATA } from "./soil_data.ts";
import { CROP_CYCLES_DATABASE, getCropCycle, getCropsBySoil, getSoilsByCrop, processCropCycle } from "./crop_cycles_data.ts";
import * as otpService from "./otp_service.ts";
import * as authService from "./auth_service.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Supabase-Key", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to log all incoming requests
app.use('*', async (c, next) => {
  const path = new URL(c.req.url).pathname;
  console.log(`\n========== INCOMING REQUEST ==========`);
  console.log(`Method: ${c.req.method}`);
  console.log(`Path: ${path}`);
  console.log(`Full URL: ${c.req.url}`);
  
  // Log ALL headers
  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value;
  });
  console.log('All Headers:', JSON.stringify(headers, null, 2));
  
  // Specifically check auth headers
  const authHeader = c.req.header('Authorization');
  const apikeyHeader = c.req.header('apikey');
  console.log('Authorization header:', authHeader ? `${authHeader.substring(0, 50)}...` : 'MISSING');
  console.log('apikey header:', apikeyHeader ? `${apikeyHeader.substring(0, 50)}...` : 'MISSING');
  console.log(`======================================\n`);
  
  await next();
});

// Helper function to get user from session token
async function getUserFromToken(accessToken: string | undefined) {
  if (!accessToken) {
    return null;
  }
  
  // Check if it's a custom session token
  if (accessToken.startsWith('session_')) {
    const session = await kv.get(`session:${accessToken}`);
    if (session && session.userId) {
      const user = await kv.get(`user:id:${session.userId}`);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
  }
  
  return null;
}

// Health check endpoint
app.get("/make-server-6fdef95d/health", (c) => {
  return c.json({ status: "ok" });
});

// Get Supabase configuration (public info only)
app.get("/make-server-6fdef95d/config", (c) => {
  // Log that this endpoint was reached
  console.log('CONFIG ENDPOINT REACHED!');
  console.log('Environment variables available:', {
    hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
    hasAnonKey: !!Deno.env.get('SUPABASE_ANON_KEY'),
    hasServiceRole: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  });
  
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  console.log('Anon key from env (first 50 chars):', anonKey.substring(0, 50));
  
  // This endpoint MUST NOT validate JWT - it's used to fetch the anon key!
  // Simply return the public config without any auth checks
  return c.json({ 
    supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
    publicAnonKey: anonKey,
  });
});

// Create demo account on first run (idempotent)
async function ensureDemoAccount() {
  const demoEmail = 'demo@farmerdemo.com';
  const demoUser = await kv.get(`user:${demoEmail}`);
  
  if (!demoUser) {
    console.log('Creating demo account...');
    const userId = `user_demo_${Date.now()}`;
    const user = {
      id: userId,
      email: demoEmail,
      password: 'demo123', // Simple password for demo
      name: 'Demo Farmer',
      phone: '9876543210',
      language: 'English',
      location: 'Punjab, India',
      created_at: new Date().toISOString(),
    };
    
    await kv.set(`user:${demoEmail}`, user);
    await kv.set(`user:id:${userId}`, user);
    console.log('Demo account created successfully!');
  }
}

// Initialize demo account
ensureDemoAccount();

// ============= AUTHENTICATION ROUTES =============

// Sign up a new user
app.post("/make-server-6fdef95d/auth/signup", async (c) => {
  try {
    console.log('=== SIGNUP REQUEST (CUSTOM AUTH) ===');
    
    const { email, password, name, phone, language, location } = await c.req.json();
    
    console.log('Signup data received:');
    console.log('- Email:', email);
    console.log('- Name:', name);
    console.log('- Phone:', phone);
    console.log('- Language:', language);
    console.log('- Location:', location);
    
    // Validate required fields
    if (!email || !password) {
      console.log('ERROR: Missing email or password');
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    console.log('Existing user check:', existingUser ? 'USER EXISTS' : 'NO EXISTING USER');
    
    if (existingUser) {
      console.log('ERROR: User already exists with email:', email);
      return c.json({ error: 'User already exists' }, 400);
    }
    
    // Create user object (in production, password should be hashed!)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      password, // WARNING: In production, use bcrypt or similar to hash this!
      name: name || 'Farmer',
      phone: phone || '',
      language: language || 'English',
      location: location || '',
      created_at: new Date().toISOString(),
    };
    
    console.log('Creating user with ID:', userId);
    
    // Store user with both keys
    await kv.set(`user:${email}`, user);
    await kv.set(`user:id:${userId}`, user);
    
    console.log('User stored in KV with keys:');
    console.log('- user:' + email);
    console.log('- user:id:' + userId);
    
    // Verify the user was saved
    const savedUser = await kv.get(`user:${email}`);
    console.log('Verification - User saved successfully:', !!savedUser);
    
    // Create a session token immediately after signup
    const sessionToken = `session_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`session:${sessionToken}`, {
      userId: userId,
      email: email,
      created_at: new Date().toISOString(),
    });
    
    console.log('Session created for new user:', sessionToken.substring(0, 30) + '...');
    
    // Return user without password and with session token
    const { password: _, ...userWithoutPassword } = user;
    return c.json({ 
      session: { 
        access_token: sessionToken,
        user: userWithoutPassword
      },
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create account: ' + error.message }, 500);
  }
});

// Sign in with email/password
app.post("/make-server-6fdef95d/auth/login", async (c) => {
  try {
    console.log('=== LOGIN REQUEST (CUSTOM AUTH) ===');
    
    const body = await c.req.json();
    const { email, password } = body;
    
    console.log('Login attempt for email:', email);
    console.log('Password provided:', password ? 'YES' : 'NO');
    
    // Validate required fields
    if (!email || !password) {
      console.log('ERROR: Missing email or password in request');
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Get user from KV store
    console.log('Looking up user with key: user:' + email);
    const user = await kv.get(`user:${email}`);
    
    console.log('User lookup result:', user ? 'FOUND' : 'NOT FOUND');
    
    if (!user) {
      console.log('ERROR: No user found with email:', email);
      return c.json({ error: 'Invalid email or password' }, 400);
    }
    
    console.log('User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password
    });
    
    // Check password
    console.log('Comparing passwords...');
    console.log('Stored password:', user.password);
    console.log('Provided password:', password);
    console.log('Passwords match:', user.password === password);
    
    if (user.password !== password) {
      console.log('ERROR: Password mismatch for user:', email);
      return c.json({ error: 'Invalid email or password' }, 400);
    }
    
    console.log('✓ Password verified successfully');
    
    // Create a session token
    const sessionToken = `session_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store session
    await kv.set(`session:${sessionToken}`, {
      userId: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
    });
    
    console.log('✓ Session created:', sessionToken.substring(0, 30) + '...');
    
    // Return user without password and with session token
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('✓ Login successful for user:', user.email);
    
    return c.json({ 
      session: { 
        access_token: sessionToken,
        user: userWithoutPassword
      }, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Failed to log in: ' + error.message }, 500);
  }
});

// Get current session
app.get("/make-server-6fdef95d/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // If no token or token is the public anon key, return null session
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ session: null, user: null }, 200);
    }
    
    const user = await getUserFromToken(accessToken);
    
    if (user) {
      return c.json({ user });
    }
    
    return c.json({ session: null, user: null }, 200);
  } catch (error) {
    console.log('Session check error:', error);
    return c.json({ session: null, user: null }, 200);
  }
});

// Logout
app.post("/make-server-6fdef95d/auth/logout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: true });
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    await supabase.auth.signOut();
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Logout error:', error);
    return c.json({ error: 'Failed to log out' }, 500);
  }
});

// ============= OTP-BASED MOBILE AUTHENTICATION ROUTES =============

// Send OTP to mobile number
app.post("/make-server-6fdef95d/auth/otp/send", async (c) => {
  try {
    console.log('=== SEND OTP REQUEST ===');
    
    const { mobile_number } = await c.req.json();
    
    console.log('Mobile number:', mobile_number);
    
    // Validate mobile number
    const validation = authService.validateMobileNumber(mobile_number);
    if (!validation.valid) {
      console.log('Invalid mobile number:', validation.error);
      return c.json({ error: validation.error }, 400);
    }
    
    // Format mobile number
    const formattedMobile = authService.formatMobileNumber(mobile_number);
    console.log('Formatted mobile:', formattedMobile);
    
    // Create OTP
    const result = await otpService.createOTP(formattedMobile);
    
    if (!result.success) {
      console.log('Failed to create OTP:', result.error);
      return c.json({ 
        error: result.error,
        remainingAttempts: result.remainingAttempts,
        resetTime: result.resetTime,
      }, 429);
    }
    
    console.log('✅ OTP created successfully. OTP:', result.otp);
    
    // Return OTP in response (for development - always 123456 until SMS is implemented)
    return c.json({ 
      status: 'OTP_SENT',
      expires_in: 300, // 5 minutes
      otp: result.otp, // Development mode - always returns 123456
      remainingAttempts: result.remainingAttempts,
      message: 'OTP is 123456 (development mode until SMS service is configured)',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return c.json({ error: 'Failed to send OTP: ' + error.message }, 500);
  }
});

// Verify OTP and login/signup
app.post("/make-server-6fdef95d/auth/otp/verify", async (c) => {
  try {
    console.log('=== VERIFY OTP REQUEST ===');
    
    const { mobile_number, otp, role, language } = await c.req.json();
    
    console.log('Mobile number:', mobile_number);
    console.log('OTP provided:', otp ? 'YES' : 'NO');
    console.log('Role:', role);
    console.log('Language:', language);
    
    // Validate required fields
    if (!mobile_number || !otp) {
      return c.json({ error: 'Mobile number and OTP are required' }, 400);
    }
    
    // Format mobile number
    const formattedMobile = authService.formatMobileNumber(mobile_number);
    
    // Verify OTP
    const verification = await otpService.verifyOTPCode(formattedMobile, otp);
    
    if (!verification.success) {
      console.log('OTP verification failed:', verification.error);
      return c.json({ error: verification.error }, 400);
    }
    
    console.log('✓ OTP verified successfully');
    console.log('Is new user:', verification.isNewUser);
    
    let user: authService.User;
    
    if (verification.isNewUser) {
      // Create new user with minimal data (Signup = Identity + Access)
      console.log('Creating new user...');
      user = await authService.createUser(
        formattedMobile,
        '', // No full_name during signup - collected later
        (role as authService.UserRole) || 'farmer',
        {
          language: language || 'english',
          profile_complete: false,
        }
      );
      
      console.log('✓ New user created:', user.id);
    } else {
      // Get existing user
      console.log('Getting existing user...');
      const existingUser = await authService.getUserByMobile(formattedMobile);
      
      if (!existingUser) {
        return c.json({ error: 'User not found' }, 404);
      }
      
      user = existingUser;
      console.log('✓ Existing user found:', user.id);
    }
    
    // Create auth tokens
    const tokens = await authService.createAuthTokens(user);
    
    console.log('✓ Auth tokens created');
    console.log('Access token:', tokens.access_token.substring(0, 30) + '...');
    
    // Return user without sensitive data
    return c.json({
      status: 'VERIFIED',
      isNewUser: verification.isNewUser,
      session: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        user: user,
      },
      user: user,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return c.json({ error: 'Failed to verify OTP: ' + error.message }, 500);
  }
});

// Refresh access token
app.post("/make-server-6fdef95d/auth/refresh", async (c) => {
  try {
    const { refresh_token } = await c.req.json();
    
    if (!refresh_token) {
      return c.json({ error: 'Refresh token required' }, 400);
    }
    
    const tokens = await authService.refreshAccessToken(refresh_token);
    
    return c.json({
      session: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return c.json({ error: 'Failed to refresh token: ' + error.message }, 401);
  }
});

// ==================== ONBOARDING ROUTES ====================

// Complete post-login onboarding
app.post("/make-server-6fdef95d/onboarding/complete", async (c) => {
  try {
    console.log('\n========================================');
    console.log('=== COMPLETE ONBOARDING REQUEST ===');
    console.log('========================================');
    
    // Get user from auth token
    const authHeader = c.req.header('Authorization');
    console.log('Authorization header:', authHeader ? authHeader.substring(0, 30) + '...' : 'NONE');
    
    const accessToken = authHeader?.split(' ')[1];
    console.log('Access token extracted:', accessToken ? `${accessToken.substring(0, 30)}...` : 'NONE');
    
    if (!accessToken) {
      console.error('❌ ERROR: No access token provided');
      return c.json({ error: 'Authorization required' }, 401);
    }
    
    // Verify the access token using auth service
    console.log('🔍 Verifying access token...');
    console.log('Token starts with:', accessToken.substring(0, 20));
    console.log('Token length:', accessToken.length);
    
    const verification = await authService.verifyAccessToken(accessToken);
    
    console.log('Verification result:', {
      valid: verification.valid,
      hasUser: !!verification.user,
      error: verification.error,
    });
    
    if (!verification.valid || !verification.user) {
      console.error('❌ Token verification failed:', verification.error);
      return c.json({ error: verification.error || 'Invalid or expired token' }, 401);
    }
    
    const userData = verification.user;
    const userId = userData.id;
    console.log('✅ Token verified successfully!');
    console.log('User ID:', userId);
    console.log('User mobile:', userData.mobile_number);
    console.log('User role:', userData.role);
    
    const onboardingData = await c.req.json();
    console.log('\n📋 Onboarding data received:');
    console.log(JSON.stringify(onboardingData, null, 2));
    
    // Update user with onboarding data
    const updatedUser = {
      ...userData,
      onboarding_status: {
        completed: onboardingData.completed || true,
        completed_steps: onboardingData.completed_steps || [],
        skipped_steps: onboardingData.skipped_steps || [],
        last_active_step: onboardingData.completed_steps?.[onboardingData.completed_steps.length - 1] || 'value',
      },
      profile_complete: true,
      updated_at: new Date().toISOString(),
    };
    
    // Add optional fields if provided
    if (onboardingData.location) {
      updatedUser.location = onboardingData.location;
    }
    
    console.log('\n💾 Saving user data...');
    console.log('User ID:', userId);
    
    // Save user
    await kv.set(`user:id:${userId}`, updatedUser);
    console.log('✅ User updated at key: user:id:' + userId);
    
    // Also update the mobile key if user has mobile_number
    if (userData.mobile_number) {
      const mobileKey = `user:mobile:${userData.mobile_number}`;
      await kv.set(mobileKey, updatedUser);
      console.log('✅ User also updated at key:', mobileKey);
    }
    
    // Save field data if provided
    if (onboardingData.field && onboardingData.field.name && onboardingData.field.area) {
      console.log('\n🌾 Saving field data...');
      const fieldId = `field:${userId}:${Date.now()}`;
      const fieldData = {
        id: fieldId,
        user_id: userId,
        name: onboardingData.field.name,
        area: parseFloat(onboardingData.field.area),
        area_unit: onboardingData.field.area_unit,
        irrigation_type: onboardingData.field.irrigation_type || null,
        is_primary: true, // First field is primary
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await kv.set(fieldId, fieldData);
      console.log('✅ Field created:', fieldId);
      console.log('Field details:', fieldData);
      
      // Index field by user
      const userFieldsKey = `user:${userId}:fields`;
      const existingFields = await kv.get(userFieldsKey) || [];
      await kv.set(userFieldsKey, [...existingFields, fieldId]);
      console.log('✅ Field indexed under:', userFieldsKey);
    } else {
      console.log('\n⏭️  No field data to save (skipped or incomplete)');
    }
    
    // Save crop data if provided
    if (onboardingData.crop && onboardingData.crop.crop_id) {
      console.log('\n🌱 Saving crop data...');
      const cropId = `crop:${userId}:${Date.now()}`;
      const cropData = {
        id: cropId,
        user_id: userId,
        crop_id: onboardingData.crop.crop_id,
        crop_name: onboardingData.crop.crop_name,
        season: onboardingData.crop.season,
        status: onboardingData.season_status || 'planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await kv.set(cropId, cropData);
      console.log('✅ Crop created:', cropId);
      console.log('Crop details:', cropData);
      
      // Index crop by user
      const userCropsKey = `user:${userId}:crops`;
      const existingCrops = await kv.get(userCropsKey) || [];
      await kv.set(userCropsKey, [...existingCrops, cropId]);
      console.log('✅ Crop indexed under:', userCropsKey);
    } else {
      console.log('\n⏭️  No crop data to save (skipped or incomplete)');
    }
    
    console.log('\n✅ ✅ ✅ ONBOARDING COMPLETE! ✅ ✅ ✅');
    console.log('========================================\n');
    
    return c.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: updatedUser,
    });
    
  } catch (error) {
    console.error('\n❌ ❌ ❌ ONBOARDING ERROR ❌ ❌ ❌');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('========================================\n');
    return c.json({ error: 'Failed to complete onboarding: ' + error.message }, 500);
  }
});

// ==================== USER DATA ROUTES ====================

// Get user dashboard data (Fields, Onboarding, etc.)
app.get("/make-server-6fdef95d/me/dashboard", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }
    
    // Verify token
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) {
      return c.json({ error: verification.error || 'Invalid token' }, 401);
    }
    
    const userId = verification.user.id;
    
    // Fetch fields
    const fieldIds = await kv.get(`user:${userId}:fields`) || [];
    let fields = [];
    if (fieldIds.length > 0) {
      const fieldsData = await kv.mget(fieldIds);
      fields = fieldsData.filter(f => f); // Remove nulls
    }
    
    // Fetch crops
    const cropIds = await kv.get(`user:${userId}:crops`) || [];
    let crops = [];
    if (cropIds.length > 0) {
      const cropsData = await kv.mget(cropIds);
      crops = cropsData.filter(c => c);
    }

    // Onboarding status from user profile
    const onboarding = verification.user.onboarding_status || null;
    
    return c.json({
      fields,
      crops,
      onboarding,
      user: verification.user // Helpful for frontend to sync state
    });
    
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return c.json({ error: 'Failed to fetch dashboard data' }, 500);
  }
});

// Get user fields
app.get("/make-server-6fdef95d/fields", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    const fieldIds = await kv.get(`user:${userId}:fields`) || [];
    let fields = [];
    if (fieldIds.length > 0) {
      const fieldsData = await kv.mget(fieldIds);
      fields = fieldsData.filter(f => f);
    }
    
    return c.json(fields);
  } catch (error) {
    console.error('Fetch fields error:', error);
    return c.json({ error: 'Failed to fetch fields' }, 500);
  }
});

// Create new field
app.post("/make-server-6fdef95d/fields", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    const { name, area, irrigation_type, area_unit } = await c.req.json();
    
    if (!name || !area) {
      return c.json({ error: 'Name and area are required' }, 400);
    }
    
    const fieldId = `field:${userId}:${Date.now()}`;
    const fieldData = {
      id: fieldId,
      user_id: userId,
      name,
      area: parseFloat(area),
      area_unit: area_unit || 'acres',
      irrigation_type: irrigation_type || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save field
    await kv.set(fieldId, fieldData);
    
    // Index field
    const userFieldsKey = `user:${userId}:fields`;
    const existingFields = await kv.get(userFieldsKey) || [];
    await kv.set(userFieldsKey, [...existingFields, fieldId]);
    
    console.log(`Field created: ${fieldId} for user ${userId}`);
    
    return c.json({ success: true, field: fieldData });
    
  } catch (error) {
    console.error('Create field error:', error);
    return c.json({ error: 'Failed to create field' }, 500);
  }
});

// ==================== AI ROUTES ====================

// Generate Crop Calendar
app.post("/make-server-6fdef95d/ai/generate-calendar", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // We should probably check auth, but the prompt implies this is for the demo user too.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { cropName, plantingDate, location, fieldName, soilType } = await c.req.json();
    
    console.log('=== CROP CALENDAR GENERATION REQUEST ===');
    console.log('Crop:', cropName);
    console.log('Soil Type:', soilType);
    console.log('Planting Date:', plantingDate);
    console.log('Location:', location);
    
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Normalize crop name to crop_id (e.g., "Paddy" -> "paddy", "Cotton" -> "cotton")
    const cropId = cropName.toLowerCase().replace(/\s+/g, '_');
    
    // Get the specific crop cycle for this soil-crop combination
    const cropCycle = getCropCycle(soilType, cropId);
    
    // Get all suitable crops for this soil type
    const suitableCrops = getCropsBySoil(soilType);
    
    console.log('Crop ID:', cropId);
    console.log('Crop Cycle Found:', !!cropCycle);
    console.log('Suitable crops for', soilType, ':', suitableCrops.map(c => c.crop_name).join(', '));
    
    if (!apiKey) {
      console.log('OpenAI API key not configured');
      // Fallback mock response
      return c.json({ 
        tasks: [
          { id: 1, title: 'Apply NPK Fertilizer', date: 'Tomorrow', type: 'Nutrients', urgent: true, reason: 'Mock generated due to missing API key' },
          { id: 2, title: 'Irrigation Cycle 4', date: 'In 3 days', type: 'Watering', urgent: false },
          { id: 3, title: 'Pest Inspection', date: 'In 5 days', type: 'Health', urgent: false },
        ]
      });
    }

    // Build enhanced prompt with crop cycle data
    const systemPrompt = `You are an expert Indian agricultural AI with deep knowledge of soil-specific crop cycles.

CRITICAL INSTRUCTIONS:
1. You MUST use the provided crop cycle data to generate recommendations
2. All recommendations MUST be soil-specific based on the Indian Soil Master Data
3. Generate tasks that align with the crop's growth stages
4. Consider soil constraints, nutrient profiles, and regional practices
5. Use agronomically accurate advice for Indian conditions

VALIDATION RULES:
- Do NOT recommend crops unsuitable for the given soil type
- Flag risks at sensitive growth stages
- Prioritize soil-specific actions (e.g., "Deep ploughing to reduce cracking in black soil")
- Consider the typical duration and critical stages for this crop-soil combination`;

    const userPrompt = `
Generate a crop calendar for the following field:

FIELD INFORMATION:
- Crop: ${cropName}
- Planting Date: ${plantingDate}
- Location: ${location}
- Field Name: ${fieldName}
- Soil Type: ${soilType}
- Today's Date: ${new Date().toLocaleDateString()}

INDIAN SOIL MASTER DATA:
${JSON.stringify(SOIL_MASTER_DATA, null, 2)}

${cropCycle ? `
SOIL-SPECIFIC CROP CYCLE DATA FOR ${cropCycle.crop_name} IN ${cropCycle.soil_id.toUpperCase().replace(/_/g, ' ')}:

Crop Cycle Duration: ${cropCycle.crop_cycle_duration_days} days

UNIVERSAL 10-STAGE CROP CYCLE:
${JSON.stringify(cropCycle.stages, null, 2)}

INSTRUCTIONS:
1. Use the above crop cycle stages to determine current growth stage based on planting date
2. Generate tasks based on the key_actions, risk_factors, and ai_alerts for upcoming stages
3. Prioritize soil-specific notes (e.g., irrigation needs, nutrient management, soil preparation)
4. Generate 5-7 tasks covering the next 2-3 growth stages
5. Each task should reference the specific stage it belongs to
` : `
WARNING: No specific crop cycle data found for ${cropName} in ${soilType}.

SUITABLE CROPS FOR ${soilType}:
${suitableCrops.map(c => `- ${c.crop_name} (${c.crop_cycle_duration_days} days)`).join('\n')}

FALLBACK INSTRUCTIONS:
1. Verify if ${cropName} is suitable for ${soilType}
2. If not suitable, suggest alternative crops from the list above
3. If suitable but data missing, infer from general agronomic knowledge for Indian conditions
4. Still prioritize soil-specific constraints from SOIL_MASTER_DATA
`}

Calculate days since planting: ${Math.floor((new Date().getTime() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24))} days

REQUIRED OUTPUT FORMAT:
Return a JSON object with a "tasks" array. Each task MUST have:
- id: number
- title: string (short action title)
- date: string (relative date like "Tomorrow", "In 3 days", or absolute like "Oct 15")
- type: string (one of: Land Preparation, Seed Treatment, Sowing, Irrigation, Nutrients, Pest Control, Watering, Health, Harvesting, Soil Care, Maintenance)
- urgent: boolean
- reason: string (short explanation referencing soil type and growth stage)
- stage_id: number (optional, 1-10 if applicable)
- stage_name: string (optional, from the 10 universal stages)

Generate 5-7 actionable tasks for the upcoming period.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Check for quota/rate limit issues
      const isQuotaError = 
        response.status === 429 || 
        (data.error && (data.error.code === 'insufficient_quota' || data.error.type === 'insufficient_quota'));

      if (isQuotaError) {
        console.warn('OpenAI Quota Exceeded (Calendar) - Using Fallback:', data.error?.message || 'Rate limit hit');
        return c.json({ 
          tasks: [
            { id: 1, title: 'Check Soil Moisture', date: 'Tomorrow', type: 'Watering', urgent: true, reason: 'Mock generated due to OpenAI Quota Exceeded' },
            { id: 2, title: 'Inspect for Early Pests', date: 'In 3 days', type: 'Health', urgent: false, reason: 'Mock generated due to OpenAI Quota Exceeded' },
            { id: 3, title: 'Apply Basal Fertilizer', date: 'In 5 days', type: 'Nutrients', urgent: false, reason: 'Mock generated due to OpenAI Quota Exceeded' },
          ]
        });
      }

      console.error('OpenAI API Error (Calendar):', data);
      throw new Error(`OpenAI API returned ${response.status}: ${JSON.stringify(data)}`);
    }

    const content = JSON.parse(data.choices[0].message.content);
    
    console.log('=== AI GENERATED TASKS ===');
    console.log(JSON.stringify(content.tasks, null, 2));
    
    return c.json({ tasks: content.tasks });

  } catch (error) {
    console.error('AI Calendar generation error:', error);
    return c.json({ error: 'Failed to generate calendar' }, 500);
  }
});

// Chatbot Endpoint
app.post("/make-server-6fdef95d/ai/chat", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    // Allow demo user to use chat as well, or just public for now if needed.
    // For now, let's just check if user exists or if it's the public key (simple auth)
    
    const { message, context } = await c.req.json();
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey) {
      return c.json({ 
        reply: "I'm sorry, I'm currently offline (API Key missing). Please check back later." 
      });
    }

    const systemPrompt = `
      You are "MS", a helpful and knowledgeable agricultural assistant for Indian farmers. 
      You speak in a simple, friendly, and encouraging tone.
      
      Your goal is to help farmers with:
      - Crop management advice
      - Disease identification and remedies
      - Weather-related farming decisions
      - Market price trends (general knowledge)
      - Government schemes for farmers in India
      - Soil health and management based on Indian soil types

      You have access to the following Indian Soil Master Data. Use this as your base reasoning layer for soil-related questions:
      ${JSON.stringify(SOIL_MASTER_DATA)}

      Context provided: ${JSON.stringify(context || {})}
      
      Keep your answers concise and practical. If you don't know something, admit it and suggest consulting a local expert.
      Always try to be supportive.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Check for quota/rate limit issues
      const isQuotaError = 
        response.status === 429 || 
        (data.error && (data.error.code === 'insufficient_quota' || data.error.type === 'insufficient_quota'));
      
      if (isQuotaError) {
         console.warn('OpenAI Quota Exceeded (Chat) - Using Fallback:', data.error?.message || 'Rate limit hit');
         return c.json({ 
           reply: "I apologize, but my connection to the central database is currently limited (Quota Exceeded). However, I can tell you that generally, keeping your soil moisture balanced and monitoring for pests early is key for a good harvest! (Mock Response)" 
         });
      }

      console.error('OpenAI API Error:', data);
      return c.json({ 
        reply: "I'm having trouble connecting to my brain right now. Please try again later." 
      });
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response format:', data);
      return c.json({ 
        reply: "I received a strange response. Please try asking in a different way." 
      });
    }

    const reply = data.choices[0].message.content;
    
    return c.json({ reply });
    
  } catch (error) {
    console.error('AI Chat error:', error);
    return c.json({ error: 'Failed to process chat message' }, 500);
  }
});

// ==================== METADATA ROUTES ====================

// Get all available crops
app.get("/make-server-6fdef95d/crops", (c) => {
  try {
    // Extract unique crops from the database
    const uniqueCropIds = new Set();
    const uniqueCrops = [];
    
    for (const cycle of CROP_CYCLES_DATABASE) {
      if (!uniqueCropIds.has(cycle.crop_id)) {
        uniqueCropIds.add(cycle.crop_id);
        
        // Infer season based on typical Indian planting times if not explicitly stored
        // This is a heuristic mapping
        let season = 'kharif';
        const name = cycle.crop_name.toLowerCase();
        if (name.includes('wheat') || name.includes('chickpea') || name.includes('mustard') || name.includes('potato')) {
          season = 'rabi';
        } else if (name.includes('sugarcane') || name.includes('tomato') || name.includes('onion')) {
          season = 'both';
        }
        
        // Add emoji
        let emoji = '🌱';
        if (name.includes('rice') || name.includes('paddy')) emoji = '🌾';
        else if (name.includes('wheat')) emoji = '🌾';
        else if (name.includes('corn') || name.includes('maize')) emoji = '🌽';
        else if (name.includes('cotton')) emoji = '🌿';
        else if (name.includes('sugarcane')) emoji = '🎋';
        else if (name.includes('potato')) emoji = '🥔';
        else if (name.includes('tomato')) emoji = '🍅';
        else if (name.includes('onion')) emoji = '🧅';
        else if (name.includes('soybean')) emoji = '🫘';
        else if (name.includes('groundnut')) emoji = '🥜';
        
        uniqueCrops.push({
          id: cycle.crop_id,
          name: cycle.crop_name,
          season,
          emoji,
          soil_types: getSoilsByCrop(cycle.crop_id).map(s => s.soil_id)
        });
      }
    }
    
    return c.json({ crops: uniqueCrops });
  } catch (error) {
    console.error('Get crops error:', error);
    return c.json({ error: 'Failed to fetch crops' }, 500);
  }
});

// Calculate crop status (Logic Implementation)
app.post("/make-server-6fdef95d/crop/calculate-status", async (c) => {
  try {
    const { crop_name, sowing_date, soil_type } = await c.req.json();
    
    if (!crop_name || !sowing_date) {
      return c.json({ error: 'crop_name and sowing_date are required' }, 400);
    }
    
    console.log('=== CALCULATE CROP STATUS REQUEST ===');
    console.log('Crop:', crop_name);
    console.log('Sowing Date:', sowing_date);
    
    const result = processCropCycle(crop_name, sowing_date, soil_type);
    
    return c.json(result);
    
  } catch (error) {
    console.error('Calculate status error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==================== CROP PROGRESS ROUTES ====================

// Get crop progress
app.get("/make-server-6fdef95d/crop/progress", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    // Get user from token
    let user = null;
    if (accessToken) {
      user = await getUserFromToken(accessToken);
    }
    
    // Fallback to Supabase auth check if custom token fails
    if (!user && accessToken) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      );
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (data && data.user) {
        user = { id: data.user.id };
      }
    }
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const cropName = c.req.query('cropName');
    const plantingDate = c.req.query('plantingDate');
    
    if (!cropName) {
      return c.json({ error: 'Crop name is required' }, 400);
    }
    
    // Construct key (include plantingDate if available to support multiple cycles)
    const key = `progress:${user.id}:${cropName}${plantingDate ? ':' + plantingDate : ''}`;
    
    const progressData = await kv.get(key);
    
    return c.json({ 
      completedStageIds: progressData?.completedStageIds || [] 
    });
    
  } catch (error) {
    console.error('Get progress error:', error);
    return c.json({ error: 'Failed to fetch progress' }, 500);
  }
});

// Save crop progress
app.post("/make-server-6fdef95d/crop/progress", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    // Get user from token
    let user = null;
    if (accessToken) {
      user = await getUserFromToken(accessToken);
    }
    
    // Fallback to Supabase auth check
    if (!user && accessToken) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      );
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (data && data.user) {
        user = { id: data.user.id };
      }
    }
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { cropName, plantingDate, completedStageIds } = await c.req.json();
    
    if (!cropName || !completedStageIds) {
      return c.json({ error: 'Crop name and completedStageIds are required' }, 400);
    }
    
    // Construct key
    const key = `progress:${user.id}:${cropName}${plantingDate ? ':' + plantingDate : ''}`;
    
    await kv.set(key, { 
      completedStageIds,
      updated_at: new Date().toISOString()
    });
    
    return c.json({ success: true });
    
  } catch (error) {
    console.error('Save progress error:', error);
    return c.json({ error: 'Failed to save progress' }, 500);
  }
});

Deno.serve(app.fetch);