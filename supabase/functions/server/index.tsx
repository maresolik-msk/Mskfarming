import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { SOIL_MASTER_DATA } from "./soil_data.ts";
import { CROP_CYCLES_DATABASE, getCropCycle, getCropsBySoil, getSoilsByCrop, processCropCycle, calculateCropTimeline } from "./crop_cycles_data.ts";
import * as otpService from "./otp_service.ts";
import * as authService from "./auth_service.ts";
import { CropEngine, SimulationParams } from "./crop_model.ts";
import { CropEngine as EngineV2 } from "./ce_simulation.ts";
import { PADDY_PROFILE, WHEAT_PROFILE, MAIZE_PROFILE, GROUNDNUT_PROFILE, COTTON_PROFILE, SOYBEAN_PROFILE, SUGARCANE_PROFILE, BAJRA_PROFILE } from "./ce_data.ts";
import { Field, DailyWeather, FarmOperation } from "./ce_models.ts";
import { NUTRIENT_DATABASE } from "./nutrient_data.ts";
import { CROP_MANAGEMENT_DATABASE } from "./crop_management_data.ts";
import { analyzeSoil } from "./soil_analysis.ts";

import { processDailyHeartbeat } from "./daily_update.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Supabase-Key", "apikey", "X-Access-Token"],
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

// Helper function to extract access token from headers
function getAccessTokenFromRequest(c: any): string | undefined {
  const xToken = c.req.header('X-Access-Token');
  if (xToken) return xToken;
  
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  
  // Ignore Supabase Anon Key if it's passed as Bearer token
  if (token === Deno.env.get('SUPABASE_ANON_KEY')) {
    return undefined;
  }
  
  // Ignore tokens that don't match our custom token format (session_ or access_)
  // This prevents the Gateway's JWT (Anon Key) from being treated as a user token
  if (token && !token.startsWith('session_') && !token.startsWith('access_')) {
    return undefined;
  }
  
  return token;
}

// Helper function to get user from session token
async function getUserFromToken(accessToken: string | undefined) {
  if (!accessToken) {
    return null;
  }
  
  const verification = await authService.verifyAccessToken(accessToken);
  return verification.valid ? verification.user : null;
}

// Helper: Generate daily activities from crop cycle stages + timeline
function generateDailyActivities(timeline: any[]) {
  const activities: any[] = [];
  let actId = 1;
  
  for (const stage of timeline) {
    const stageData = stage.stage_data;
    if (!stageData) continue;
    const stageStart = new Date(stage.start_date);
    const stageDuration = Math.max(stage.duration_days || 1, 1);
    
    if (stageData.key_actions && stageData.key_actions.length > 0) {
      const actions = stageData.key_actions;
      for (let i = 0; i < actions.length; i++) {
        const dayOffset = Math.min(Math.floor((i / actions.length) * stageDuration), stageDuration - 1);
        const actDate = new Date(stageStart);
        actDate.setDate(actDate.getDate() + dayOffset);
        activities.push({
          id: `act_${actId++}`,
          date: actDate.toISOString().split('T')[0],
          title: actions[i],
          type: 'action',
          stage_id: stageData.stage_id,
          stage_name: stageData.stage_name,
          source: 'system',
          status: 'pending',
          notes: stageData.soil_specific_notes || '',
          priority: i === 0 ? 'high' : 'medium',
        });
      }
    }
    
    if (stageData.ai_alerts && stageData.ai_alerts.length > 0) {
      for (let i = 0; i < stageData.ai_alerts.length; i++) {
        const dayOffset = Math.min(i, Math.max(stageDuration - 1, 0));
        const actDate = new Date(stageStart);
        actDate.setDate(actDate.getDate() + dayOffset);
        activities.push({
          id: `act_${actId++}`,
          date: actDate.toISOString().split('T')[0],
          title: stageData.ai_alerts[i],
          type: 'alert',
          stage_id: stageData.stage_id,
          stage_name: stageData.stage_name,
          source: 'ai',
          status: 'pending',
          notes: '',
          priority: 'high',
        });
      }
    }
    
    if (stageData.risk_factors && stageData.risk_factors.length > 0) {
      const midOffset = Math.floor(stageDuration / 2);
      for (let ri = 0; ri < stageData.risk_factors.length; ri++) {
        const actDate = new Date(stageStart);
        actDate.setDate(actDate.getDate() + midOffset);
        activities.push({
          id: `act_${actId++}`,
          date: actDate.toISOString().split('T')[0],
          title: 'Watch for: ' + stageData.risk_factors[ri],
          type: 'warning',
          stage_id: stageData.stage_id,
          stage_name: stageData.stage_name,
          source: 'system',
          status: 'pending',
          notes: '',
          priority: 'medium',
        });
      }
    }
  }
  
  activities.sort((a: any, b: any) => a.date.localeCompare(b.date));
  return activities;
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
    const accessToken = getAccessTokenFromRequest(c);
    
    // If no token or token is the public anon key, return null session
    if (!accessToken) {
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
    const accessToken = getAccessTokenFromRequest(c);
    
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
    
    // Check if user exists
    const existingUser = await authService.getUserByMobile(formattedMobile);
    const isNewUser = !existingUser;
    
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
    console.log('Is new user:', isNewUser);
    
    // Return OTP in response (for development - always 123456 until SMS is implemented)
    return c.json({ 
      status: 'OTP_SENT',
      isNewUser: isNewUser,
      expires_in: 300, // 5 minutes
      otp: result.otp, // Development mode - always returns 123456
      remainingAttempts: result.remainingAttempts,
      message: isNewUser ? 'OTP sent for signup' : 'OTP sent for login',
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
    const accessToken = getAccessTokenFromRequest(c);
    
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

// ==================== NUTRIENT ROUTES ====================

// Calculate and save nutrient plan
app.post("/make-server-6fdef95d/nutrient/calculate", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const { cropType, sowingDate, fieldSizeAcres, fieldId } = await c.req.json();
    
    console.log(`\n🧪 Nutrient Calculation Request:`);
    console.log(`Crop: ${cropType}, Sowing: ${sowingDate}, Size: ${fieldSizeAcres} acres`);
    
    // 1. Get Base Plan
    // Handle fuzzy matching for crop names
    const cropKey = Object.keys(NUTRIENT_DATABASE).find(k => 
      k.toLowerCase() === cropType.toLowerCase() || 
      cropType.toLowerCase().includes(k.toLowerCase())
    ) || 'Wheat'; // Default fallback
    
    const basePlan = NUTRIENT_DATABASE[cropKey];
    if (!basePlan) {
      return c.json({ error: 'Nutrient data not available for this crop' }, 404);
    }
    
    // 2. Generate Schedule based on sowing date and field size
    const start = new Date(sowingDate);
    const schedule = basePlan.stages.map(stage => {
      // Calculate date
      const stageDate = new Date(start);
      stageDate.setDate(start.getDate() + stage.day_start);
      
      // Calculate quantities
      const n_kg = (stage.nutrients.n * parseFloat(fieldSizeAcres)).toFixed(1);
      const p_kg = (stage.nutrients.p * parseFloat(fieldSizeAcres)).toFixed(1);
      const k_kg = (stage.nutrients.k * parseFloat(fieldSizeAcres)).toFixed(1);
      
      return {
        ...stage,
        date: stageDate.toISOString().split('T')[0],
        quantities: {
          n_kg,
          p_kg,
          k_kg
        },
        display_quantity: `N: ${n_kg}kg, P: ${p_kg}kg, K: ${k_kg}kg`
      };
    });
    
    // 3. Save Plan
    const planId = `nutrient_plan:${verification.user.id}:${Date.now()}`;
    const plan = {
      id: planId,
      user_id: verification.user.id,
      field_id: fieldId || null,
      crop_type: cropType,
      sowing_date: sowingDate,
      field_size_acres: fieldSizeAcres,
      created_at: new Date().toISOString(),
      schedule: schedule,
      totals: {
        n: (basePlan.total_n * parseFloat(fieldSizeAcres)).toFixed(1),
        p: (basePlan.total_p * parseFloat(fieldSizeAcres)).toFixed(1),
        k: (basePlan.total_k * parseFloat(fieldSizeAcres)).toFixed(1)
      }
    };
    
    await kv.set(planId, plan);
    
    // Index the plan
    const userPlansKey = `user:${verification.user.id}:nutrient_plans`;
    const existingPlans = await kv.get(userPlansKey) || [];
    await kv.set(userPlansKey, [planId, ...existingPlans]);
    
    return c.json({ success: true, plan });
    
  } catch (error) {
    console.error('Nutrient calculation error:', error);
    return c.json({ error: 'Failed to calculate nutrients' }, 500);
  }
});

// Get saved nutrient plans
app.get("/make-server-6fdef95d/nutrient/plans", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userPlansKey = `user:${verification.user.id}:nutrient_plans`;
    const planIds = await kv.get(userPlansKey) || [];
    
    let plans = [];
    if (planIds.length > 0) {
      const plansData = await kv.mget(planIds);
      plans = plansData.filter(p => p);
    }
    
    return c.json({ plans });
  } catch (error) {
    console.error('Fetch nutrient plans error:', error);
    return c.json({ error: 'Failed to fetch plans' }, 500);
  }
});

// ==================== CROP MANAGEMENT ROUTES ====================

// Calculate and save comprehensive crop management plan
app.post("/make-server-6fdef95d/crop/management/calculate", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const { cropType, sowingDate, fieldSizeAcres, fieldId } = await c.req.json();
    
    console.log(`\n🚜 Crop Management Plan Request:`);
    console.log(`Crop: ${cropType}, Sowing: ${sowingDate}, Size: ${fieldSizeAcres} acres`);
    
    // 1. Get Base Plan
    const cropKey = Object.keys(CROP_MANAGEMENT_DATABASE).find(k => 
      k.toLowerCase() === cropType.toLowerCase() || 
      cropType.toLowerCase().includes(k.toLowerCase())
    ) || 'Wheat';
    
    const basePlan = CROP_MANAGEMENT_DATABASE[cropKey];
    if (!basePlan) {
      return c.json({ error: 'Management data not available for this crop' }, 404);
    }
    
    // 2. Generate Comprehensive Schedule
    const start = new Date(sowingDate);
    const schedule = basePlan.stages.map(stage => {
      const stageDate = new Date(start);
      stageDate.setDate(start.getDate() + stage.day_start);
      
      // Calculate nutrient quantities
      const nutrient_quantities = {
        n_kg: (stage.nutrients.n * parseFloat(fieldSizeAcres)).toFixed(1),
        p_kg: (stage.nutrients.p * parseFloat(fieldSizeAcres)).toFixed(1),
        k_kg: (stage.nutrients.k * parseFloat(fieldSizeAcres)).toFixed(1),
        products: stage.nutrients.products || [],
        micronutrients: stage.nutrients.micronutrients || []
      };

      return {
        ...stage,
        date: stageDate.toISOString().split('T')[0],
        nutrient_quantities,
        status: 'pending' // pending, completed, skipped
      };
    });
    
    // 3. Save Plan
    const planId = `crop_mgmt_plan:${verification.user.id}:${Date.now()}`;
    const plan = {
      id: planId,
      user_id: verification.user.id,
      field_id: fieldId || null,
      crop_type: cropType,
      sowing_date: sowingDate,
      field_size_acres: fieldSizeAcres,
      created_at: new Date().toISOString(),
      schedule: schedule,
      summary: {
         scientific_name: basePlan.scientific_name,
         duration_days: basePlan.duration_days
      }
    };
    
    await kv.set(planId, plan);
    
    // Index the plan
    const userPlansKey = `user:${verification.user.id}:crop_mgmt_plans`;
    const existingPlans = await kv.get(userPlansKey) || [];
    await kv.set(userPlansKey, [planId, ...existingPlans]);
    
    return c.json({ success: true, plan });
    
  } catch (error) {
    console.error('Crop management calculation error:', error);
    return c.json({ error: 'Failed to generate crop plan' }, 500);
  }
});

// Get saved crop management plans
app.get("/make-server-6fdef95d/crop/management/plans", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userPlansKey = `user:${verification.user.id}:crop_mgmt_plans`;
    const planIds = await kv.get(userPlansKey) || [];
    
    let plans = [];
    if (planIds.length > 0) {
      const plansData = await kv.mget(planIds);
      plans = plansData.filter(p => p);
    }
    
    return c.json({ plans });
  } catch (error) {
    console.error('Fetch crop management plans error:', error);
    return c.json({ error: 'Failed to fetch plans' }, 500);
  }
});

// Get static details for a crop
app.get("/make-server-6fdef95d/crop/management/details/:cropType", async (c) => {
  try {
    const cropType = c.req.param('cropType');
    
    const cropKey = Object.keys(CROP_MANAGEMENT_DATABASE).find(k => 
      k.toLowerCase() === cropType.toLowerCase() || 
      cropType.toLowerCase().includes(k.toLowerCase())
    );

    if (!cropKey || !CROP_MANAGEMENT_DATABASE[cropKey]) {
      return c.json({ error: 'Crop details not found' }, 404);
    }

    return c.json({ details: CROP_MANAGEMENT_DATABASE[cropKey] });
  } catch (error) {
    console.error('Fetch crop details error:', error);
    return c.json({ error: 'Failed to fetch details' }, 500);
  }
});

// ==================== SIMULATION ROUTES ====================

// Trigger daily simulation heartbeat (Dynamic Weather Update)
app.post("/make-server-6fdef95d/simulation/heartbeat", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    console.log(`\n💓 Heartbeat triggered for user: ${userId}`);
    
    const result = await processDailyHeartbeat(userId);
    
    console.log(`Heartbeat result:`, result);
    
    return c.json(result);
  } catch (error) {
    console.error('Heartbeat error:', error);
    return c.json({ error: 'Failed to process simulation heartbeat' }, 500);
  }
});

// ==================== USER DATA ROUTES ====================

// Get user dashboard data (Fields, Onboarding, etc.)
app.get("/make-server-6fdef95d/me/dashboard", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    
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
      
      // Enrich with image URLs
      crops = crops.map((userCrop: any) => {
        const cycle = CROP_CYCLES_DATABASE.find(c => c.crop_id === userCrop.crop_id);
        return {
          ...userCrop,
          image_url: cycle?.image_url || null
        };
      });
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
    const accessToken = getAccessTokenFromRequest(c);
    
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    const fieldIds = await kv.get(`user:${userId}:fields`) || [];
    let fields = [];
    if (fieldIds.length > 0) {
      const fieldsData = await kv.mget(fieldIds);
      fields = fieldsData.filter(f => f);
      
      // Enrich with crop images
      fields = fields.map((field: any) => {
        if (!field.crop) return field;
        const cycle = CROP_CYCLES_DATABASE.find(c => 
          c.crop_id === field.crop.toLowerCase().replace(/\s+/g, '_') || 
          c.crop_name.toLowerCase() === field.crop.toLowerCase()
        );
        return {
          ...field,
          image_url: cycle?.image_url || null
        };
      });
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
    const accessToken = getAccessTokenFromRequest(c);
    
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

// ============= CROP INTELLIGENCE SIMULATION API =============

app.post("/make-server-6fdef95d/simulation/run", async (c) => {
  try {
    console.log('=== CROP SIMULATION REQUEST ===');
    
    // Auth check optional for now to allow quick testing, but recommended
    // const accessToken = getAccessTokenFromRequest(c);
    // if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const params: SimulationParams = await c.req.json();
    
    console.log('Simulation params:', {
      crop: params.crop_type,
      soil: params.soil_type,
      sowing: params.sowing_date,
      water_pct: params.initial_soil_water_pct
    });
    
    if (!params.crop_type || !params.sowing_date || !params.soil_type) {
        return c.json({ error: 'Missing required parameters (crop_type, sowing_date, soil_type)' }, 400);
    }
    
    // Run deterministic simulation
    const result = CropEngine.runSimulation(params);
    
    console.log('Simulation complete.');
    console.log(`Yield: ${result.summary.yield} kg/ha`);
    console.log(`Duration: ${result.summary.days_to_maturity} days`);
    
    return c.json(result);
    
  } catch (error) {
    console.error('Simulation error:', error);
    return c.json({ error: 'Simulation failed: ' + error.message }, 500);
  }
});

app.post("/make-server-6fdef95d/simulation/run-v2", async (c) => {
  try {
    console.log('=== CROP SIMULATION V2 REQUEST ===');
    
    const body = await c.req.json();
    
    // Parse inputs (with defaults for quick testing)
    const startDate = body.startDate || "2024-06-15"; // Typical Kharif start
    
    // Select Crop Profile
    let profile = PADDY_PROFILE;
    if (body.cropType === 'Wheat') profile = WHEAT_PROFILE;
    else if (body.cropType === 'Maize') profile = MAIZE_PROFILE;
    else if (body.cropType === 'Groundnut') profile = GROUNDNUT_PROFILE;
    else if (body.cropType === 'Cotton') profile = COTTON_PROFILE;
    else if (body.cropType === 'Soybean') profile = SOYBEAN_PROFILE;
    else if (body.cropType === 'Sugarcane') profile = SUGARCANE_PROFILE;
    else if (body.cropType === 'Bajra') profile = BAJRA_PROFILE;
    // Default to Paddy if Rice or unknown

    // 1. Setup Field
    const field: Field = {
        id: "sim_field_01",
        area_ha: 1.0,
        soil_type: "Clay Loam",
        soil_properties: {
            ph: 6.5,
            organic_matter_pct: 1.2,
            texture: "Clay Loam",
            nitrogen_level: "Medium"
        },
        water_holding_capacity_mm: 150, // High for paddy soil
        wilting_point_mm: 60,
        current_soil_water_mm: body.initialSoilWater ?? 100,
        current_nitrogen_kg_ha: body.initialNitrogen ?? 50,
        location: { lat: 30.0, lon: 75.0 } // Punjab
    };

    // 2. Setup Operations (mix of requested + default)
    const operations: FarmOperation[] = body.operations || [];
    
    // 3. Generate Weather (Using the same synthetic generator or passed data)
    const weatherHistory: DailyWeather[] = [];
    const start = new Date(startDate);
    for(let i=0; i<150; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        
        // Simple synthetic weather for Punjab Kharif (Hot, Monsoon rain)
        const isMonsoon = i > 15 && i < 100; // July-Sept
        const tmax = 30 + Math.random()*10 - (isMonsoon ? 5 : 0);
        const tmin = 22 + Math.random()*5;
        const rain = isMonsoon && Math.random() > 0.7 ? Math.random()*40 : 0;
        
        weatherHistory.push({
            date: d.toISOString().split('T')[0],
            t_max: parseFloat(tmax.toFixed(1)),
            t_min: parseFloat(tmin.toFixed(1)),
            rainfall_mm: parseFloat(rain.toFixed(1)),
            humidity_pct: isMonsoon ? 80 : 40
        });
    }

    // Run Engine
    const result = EngineV2.simulateSeason(
        field,
        profile,
        weatherHistory,
        operations,
        startDate
    );
    
    return c.json(result);
    
  } catch (error) {
    console.error('Simulation V2 error:', error);
    return c.json({ error: 'Simulation failed: ' + error.message }, 500);
  }
});

// Update field
app.put("/make-server-6fdef95d/fields/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const updates = await c.req.json();
    const userId = verification.user.id;
    
    // Validate required fields if they are present in updates
    // Note: If updates contains 'size', map it to 'area' if needed, but assuming client handles it now.
    // However, for safety, let's allow 'size' to update 'area'
    if (updates.size) {
      updates.area = updates.size;
      delete updates.size;
    }
    if (updates.sizeUnit) {
      updates.area_unit = updates.sizeUnit;
      delete updates.sizeUnit;
    }
    
    const field = await kv.get(id);
    if (!field) return c.json({ error: 'Field not found' }, 404);
    if (field.user_id !== userId) return c.json({ error: 'Unauthorized' }, 403);
    
    const updatedField = { ...field, ...updates, updated_at: new Date().toISOString() };
    await kv.set(id, updatedField);
    
    return c.json({ success: true, field: updatedField });
  } catch (error) {
    console.error('Update field error:', error);
    return c.json({ error: 'Failed to update field' }, 500);
  }
});

// Delete field
app.delete("/make-server-6fdef95d/fields/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const userId = verification.user.id;
    
    const field = await kv.get(id);
    if (!field) return c.json({ error: 'Field not found' }, 404);
    if (field.user_id !== userId) return c.json({ error: 'Unauthorized' }, 403);
    
    await kv.del(id);
    
    // Remove from user's field list
    const userFieldsKey = `user:${userId}:fields`;
    const userFields = await kv.get(userFieldsKey) || [];
    const newUserFields = userFields.filter((fId: string) => fId !== id);
    await kv.set(userFieldsKey, newUserFields);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete field error:', error);
    return c.json({ error: 'Failed to delete field' }, 500);
  }
});

// ==================== AI ROUTES ====================

// Generate Crop Calendar
app.post("/make-server-6fdef95d/ai/generate-calendar", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    
    const user = await getUserFromToken(accessToken);
    
    if (!user) {
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
    const accessToken = getAccessTokenFromRequest(c);
    
    // Check auth
    const user = await getUserFromToken(accessToken);
    
    // Optional: Allow chat without strict auth if needed, but for now log it
    console.log('Chat request from user:', user ? user.id : 'Anonymous/Invalid');
    
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
          image_url: cycle.image_url,
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
    const accessToken = getAccessTokenFromRequest(c);
    
    // Get user from token
    const user = await getUserFromToken(accessToken);
    
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
    const accessToken = getAccessTokenFromRequest(c);
    
    // Get user from token
    const user = await getUserFromToken(accessToken);
    
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

// ==================== MISSING APP ROUTES ====================

// --- User Profile ---

app.get("/make-server-6fdef95d/user/profile", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    return c.json({ profile: verification.user });
  } catch (error) {
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put("/make-server-6fdef95d/user/profile", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const updates = await c.req.json();
    const updatedUser = await authService.updateUser(verification.user.id, updates);
    
    return c.json({ success: true, profile: updatedUser });
  } catch (error) {
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// --- Tasks ---

app.get("/make-server-6fdef95d/tasks", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const tasks = await kv.get(`user:${verification.user.id}:tasks`) || [];
    return c.json(tasks);
  } catch (error) {
    return c.json({ error: 'Failed to fetch tasks' }, 500);
  }
});

app.post("/make-server-6fdef95d/tasks", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const task = await c.req.json();
    const userId = verification.user.id;
    
    const newTask = {
      ...task,
      id: task.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    const tasks = await kv.get(`user:${userId}:tasks`) || [];
    tasks.push(newTask);
    await kv.set(`user:${userId}:tasks`, tasks);
    
    return c.json(newTask);
  } catch (error) {
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

app.put("/make-server-6fdef95d/tasks/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const updates = await c.req.json();
    const userId = verification.user.id;
    
    const tasks = await kv.get(`user:${userId}:tasks`) || [];
    const index = tasks.findIndex((t: any) => t.id === id);
    
    if (index === -1) return c.json({ error: 'Task not found' }, 404);
    
    tasks[index] = { ...tasks[index], ...updates, updated_at: new Date().toISOString() };
    await kv.set(`user:${userId}:tasks`, tasks);
    
    return c.json(tasks[index]);
  } catch (error) {
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

app.delete("/make-server-6fdef95d/tasks/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const userId = verification.user.id;
    
    const tasks = await kv.get(`user:${userId}:tasks`) || [];
    const newTasks = tasks.filter((t: any) => t.id !== id);
    await kv.set(`user:${userId}:tasks`, newTasks);
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

// --- Expenses ---

app.get("/make-server-6fdef95d/expenses", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const expenses = await kv.get(`user:${verification.user.id}:expenses`) || [];
    return c.json(expenses);
  } catch (error) {
    return c.json({ error: 'Failed to fetch expenses' }, 500);
  }
});

app.post("/make-server-6fdef95d/expenses", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const expense = await c.req.json();
    const userId = verification.user.id;
    
    const newExpense = {
      ...expense,
      id: expense.id || `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    const expenses = await kv.get(`user:${userId}:expenses`) || [];
    expenses.push(newExpense);
    await kv.set(`user:${userId}:expenses`, expenses);
    
    return c.json(newExpense);
  } catch (error) {
    return c.json({ error: 'Failed to create expense' }, 500);
  }
});

app.put("/make-server-6fdef95d/expenses/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const updates = await c.req.json();
    const userId = verification.user.id;
    
    const expenses = await kv.get(`user:${userId}:expenses`) || [];
    const index = expenses.findIndex((e: any) => e.id === id);
    
    if (index === -1) return c.json({ error: 'Expense not found' }, 404);
    
    expenses[index] = { ...expenses[index], ...updates, updated_at: new Date().toISOString() };
    await kv.set(`user:${userId}:expenses`, expenses);
    
    return c.json(expenses[index]);
  } catch (error) {
    return c.json({ error: 'Failed to update expense' }, 500);
  }
});

app.delete("/make-server-6fdef95d/expenses/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const userId = verification.user.id;
    
    const expenses = await kv.get(`user:${userId}:expenses`) || [];
    const newExpenses = expenses.filter((e: any) => e.id !== id);
    await kv.set(`user:${userId}:expenses`, newExpenses);
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete expense' }, 500);
  }
});

// --- Journal ---

app.get("/make-server-6fdef95d/journal", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const entries = await kv.get(`user:${verification.user.id}:journal`) || [];
    return c.json(entries);
  } catch (error) {
    return c.json({ error: 'Failed to fetch journal' }, 500);
  }
});

app.post("/make-server-6fdef95d/journal", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const entry = await c.req.json();
    const userId = verification.user.id;
    
    const newEntry = {
      ...entry,
      id: entry.id || `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    const entries = await kv.get(`user:${userId}:journal`) || [];
    entries.push(newEntry);
    await kv.set(`user:${userId}:journal`, entries);
    
    return c.json(newEntry);
  } catch (error) {
    return c.json({ error: 'Failed to create journal entry' }, 500);
  }
});

app.put("/make-server-6fdef95d/journal/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const updates = await c.req.json();
    const userId = verification.user.id;
    
    const entries = await kv.get(`user:${userId}:journal`) || [];
    const index = entries.findIndex((e: any) => e.id === id);
    
    if (index === -1) return c.json({ error: 'Entry not found' }, 404);
    
    entries[index] = { ...entries[index], ...updates, updated_at: new Date().toISOString() };
    await kv.set(`user:${userId}:journal`, entries);
    
    return c.json(entries[index]);
  } catch (error) {
    return c.json({ error: 'Failed to update journal entry' }, 500);
  }
});

app.delete("/make-server-6fdef95d/journal/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const id = c.req.param('id');
    const userId = verification.user.id;
    
    const entries = await kv.get(`user:${userId}:journal`) || [];
    const newEntries = entries.filter((e: any) => e.id !== id);
    await kv.set(`user:${userId}:journal`, newEntries);
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete journal entry' }, 500);
  }
});

// ==================== OLD INLINE SOIL ENGINE REMOVED ====================
// The comprehensive analyzeSoil() engine from soil_analysis.ts is now the
// single handler for /soil/analyze. It accepts BOTH legacy { tests } format
// and new { observations } format. See SOIL ANALYSIS ROUTES section below.

// ==================== CROP CYCLE TRACKER ROUTES ====================

// Activate a crop cycle — generates full timeline + daily activities
app.post("/make-server-6fdef95d/crop-cycle/activate", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    const { crop_name, sowing_date, soil_type, field_id, field_name } = await c.req.json();
    
    if (!crop_name || !sowing_date) {
      return c.json({ error: 'crop_name and sowing_date are required' }, 400);
    }
    
    console.log(`\n🌱 ACTIVATE CROP CYCLE: ${crop_name} sown on ${sowing_date} (soil: ${soil_type || 'auto'})`);
    
    // 1. Find the crop cycle template
    const normalizedCrop = crop_name.toLowerCase().replace(/\s+/g, '_');
    let cropCycle;
    if (soil_type) {
      cropCycle = getCropCycle(soil_type, normalizedCrop);
    }
    if (!cropCycle) {
      cropCycle = CROP_CYCLES_DATABASE.find(c =>
        c.crop_id === normalizedCrop ||
        c.crop_name.toLowerCase() === crop_name.toLowerCase()
      );
    }
    
    if (!cropCycle) {
      return c.json({ error: `Crop cycle not found for '${crop_name}'` }, 404);
    }
    
    // 2. Calculate timeline with real dates
    const sowingDateObj = new Date(sowing_date);
    const timeline = calculateCropTimeline(sowingDateObj, cropCycle.stages);
    
    // 3. Generate daily activities
    const activities = generateDailyActivities(timeline);
    
    // 4. Calculate end date
    const cycleEndDate = timeline[timeline.length - 1].end_date;
    
    // 5. Build the active crop cycle object
    const cycleId = `crop_cycle:${userId}:${Date.now()}`;
    const activeCycle = {
      id: cycleId,
      user_id: userId,
      crop_id: cropCycle.crop_id,
      crop_name: cropCycle.crop_name,
      soil_type: cropCycle.soil_id,
      sowing_date: sowing_date,
      cycle_end_date: cycleEndDate,
      cycle_duration_days: cropCycle.crop_cycle_duration_days,
      field_id: field_id || null,
      field_name: field_name || null,
      image_url: cropCycle.image_url,
      status: 'active', // active | completed | abandoned
      created_at: new Date().toISOString(),
      timeline: timeline.map(t => ({
        stage_id: t.stage_id,
        stage_name: t.stage_name,
        start_date: t.start_date,
        end_date: t.end_date,
        duration_days: t.duration_days,
        soil_specific_notes: t.stage_data.soil_specific_notes,
        key_actions: t.stage_data.key_actions,
        risk_factors: t.stage_data.risk_factors,
        ai_alerts: t.stage_data.ai_alerts,
      })),
      activities: activities,
    };
    
    // 6. Save to KV
    await kv.set(cycleId, activeCycle);
    
    // 7. Index under user
    const userCyclesKey = `user:${userId}:active_crop_cycles`;
    const existingCycles = await kv.get(userCyclesKey) || [];
    await kv.set(userCyclesKey, [cycleId, ...existingCycles]);
    
    console.log(`✅ Crop cycle activated: ${cycleId}`);
    console.log(`   Timeline: ${timeline[0].start_date} → ${cycleEndDate}`);
    console.log(`   Total activities generated: ${activities.length}`);
    
    return c.json({ success: true, cycle: activeCycle });
    
  } catch (error) {
    console.error('Activate crop cycle error:', error);
    return c.json({ error: 'Failed to activate crop cycle: ' + error.message }, 500);
  }
});

// Get all active crop cycles for user
app.get("/make-server-6fdef95d/crop-cycle/active", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    const userCyclesKey = `user:${userId}:active_crop_cycles`;
    const cycleIds = await kv.get(userCyclesKey) || [];
    
    let cycles: any[] = [];
    if (cycleIds.length > 0) {
      const cyclesData = await kv.mget(cycleIds);
      cycles = cyclesData.filter((c: any) => c && c.status === 'active');
    }
    
    // Enrich each cycle with today's info
    const todayStr = new Date().toISOString().split('T')[0];
    const enriched = cycles.map((cycle: any) => {
      const todayActivities = (cycle.activities || []).filter((a: any) => a.date === todayStr);
      const pendingToday = todayActivities.filter((a: any) => a.status === 'pending').length;
      const completedToday = todayActivities.filter((a: any) => a.status === 'completed').length;
      
      // Find current stage
      const currentStage = cycle.timeline.find((t: any) => {
        return todayStr >= t.start_date && todayStr <= t.end_date;
      });
      
      // Calculate overall progress
      const firstDate = new Date(cycle.timeline[0].start_date);
      const lastDate = new Date(cycle.timeline[cycle.timeline.length - 1].end_date);
      const today = new Date(todayStr);
      const totalDays = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      const elapsed = (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      const progressPercent = Math.min(Math.max(Math.round((elapsed / totalDays) * 100), 0), 100);
      
      return {
        ...cycle,
        today_summary: {
          date: todayStr,
          activities: todayActivities,
          pending: pendingToday,
          completed: completedToday,
          total: todayActivities.length,
        },
        current_stage: currentStage || null,
        progress_percent: progressPercent,
      };
    });
    
    return c.json({ cycles: enriched });
    
  } catch (error) {
    console.error('Get active cycles error:', error);
    return c.json({ error: 'Failed to fetch active crop cycles' }, 500);
  }
});

// Get a single crop cycle by ID with full detail
app.get("/make-server-6fdef95d/crop-cycle/:id", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const cycleId = c.req.param('id');
    const cycle = await kv.get(cycleId);
    
    if (!cycle) return c.json({ error: 'Crop cycle not found' }, 404);
    if (cycle.user_id !== verification.user.id) return c.json({ error: 'Unauthorized' }, 403);
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayActivities = (cycle.activities || []).filter((a: any) => a.date === todayStr);
    
    const currentStage = cycle.timeline.find((t: any) => todayStr >= t.start_date && todayStr <= t.end_date);
    
    const firstDate = new Date(cycle.timeline[0].start_date);
    const lastDate = new Date(cycle.timeline[cycle.timeline.length - 1].end_date);
    const today = new Date(todayStr);
    const totalDays = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    const elapsed = (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    const progressPercent = Math.min(Math.max(Math.round((elapsed / totalDays) * 100), 0), 100);
    
    return c.json({
      cycle: {
        ...cycle,
        today_summary: { date: todayStr, activities: todayActivities },
        current_stage: currentStage || null,
        progress_percent: progressPercent,
      }
    });
    
  } catch (error) {
    console.error('Get crop cycle error:', error);
    return c.json({ error: 'Failed to fetch crop cycle' }, 500);
  }
});

// Update activity status (complete, skip, add notes)
app.put("/make-server-6fdef95d/crop-cycle/:id/activity/:activityId", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const cycleId = c.req.param('id');
    const activityId = c.req.param('activityId');
    const updates = await c.req.json();
    
    const cycle = await kv.get(cycleId);
    if (!cycle) return c.json({ error: 'Crop cycle not found' }, 404);
    if (cycle.user_id !== verification.user.id) return c.json({ error: 'Unauthorized' }, 403);
    
    const actIndex = cycle.activities.findIndex((a: any) => a.id === activityId);
    if (actIndex === -1) return c.json({ error: 'Activity not found' }, 404);
    
    cycle.activities[actIndex] = {
      ...cycle.activities[actIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(cycleId, cycle);
    
    return c.json({ success: true, activity: cycle.activities[actIndex] });
    
  } catch (error) {
    console.error('Update activity error:', error);
    return c.json({ error: 'Failed to update activity' }, 500);
  }
});

// Add custom activity to a crop cycle
app.post("/make-server-6fdef95d/crop-cycle/:id/activity", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const cycleId = c.req.param('id');
    const { title, date, type, stage_id, stage_name, priority, notes } = await c.req.json();
    
    if (!title || !date) {
      return c.json({ error: 'title and date are required' }, 400);
    }
    
    const cycle = await kv.get(cycleId);
    if (!cycle) return c.json({ error: 'Crop cycle not found' }, 404);
    if (cycle.user_id !== verification.user.id) return c.json({ error: 'Unauthorized' }, 403);
    
    const newActivity = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      date,
      title,
      type: type || 'action',
      stage_id: stage_id || null,
      stage_name: stage_name || null,
      source: 'custom',
      status: 'pending',
      notes: notes || '',
      priority: priority || 'medium',
      created_at: new Date().toISOString(),
    };
    
    cycle.activities.push(newActivity);
    // Re-sort activities by date
    cycle.activities.sort((a: any, b: any) => a.date.localeCompare(b.date));
    
    await kv.set(cycleId, cycle);
    
    console.log(`✅ Custom activity added to cycle ${cycleId}: "${title}" on ${date}`);
    
    return c.json({ success: true, activity: newActivity });
    
  } catch (error) {
    console.error('Add custom activity error:', error);
    return c.json({ error: 'Failed to add activity' }, 500);
  }
});

// Delete a custom activity
app.delete("/make-server-6fdef95d/crop-cycle/:id/activity/:activityId", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const cycleId = c.req.param('id');
    const activityId = c.req.param('activityId');
    
    const cycle = await kv.get(cycleId);
    if (!cycle) return c.json({ error: 'Crop cycle not found' }, 404);
    if (cycle.user_id !== verification.user.id) return c.json({ error: 'Unauthorized' }, 403);
    
    const activity = cycle.activities.find((a: any) => a.id === activityId);
    if (!activity) return c.json({ error: 'Activity not found' }, 404);
    if (activity.source !== 'custom') return c.json({ error: 'Only custom activities can be deleted' }, 400);
    
    cycle.activities = cycle.activities.filter((a: any) => a.id !== activityId);
    await kv.set(cycleId, cycle);
    
    return c.json({ success: true });
    
  } catch (error) {
    console.error('Delete activity error:', error);
    return c.json({ error: 'Failed to delete activity' }, 500);
  }
});

// Get activities for a specific date range
app.get("/make-server-6fdef95d/crop-cycle/:id/activities", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const cycleId = c.req.param('id');
    const fromDate = c.req.query('from') || new Date().toISOString().split('T')[0];
    const toDate = c.req.query('to') || fromDate;
    
    const cycle = await kv.get(cycleId);
    if (!cycle) return c.json({ error: 'Crop cycle not found' }, 404);
    if (cycle.user_id !== verification.user.id) return c.json({ error: 'Unauthorized' }, 403);
    
    const filtered = (cycle.activities || []).filter((a: any) =>
      a.date >= fromDate && a.date <= toDate
    );
    
    return c.json({ activities: filtered });
    
  } catch (error) {
    console.error('Get activities error:', error);
    return c.json({ error: 'Failed to fetch activities' }, 500);
  }
});

// ==================== SOIL ANALYSIS ROUTES ====================

// Comprehensive soil analysis — accepts BOTH legacy { tests } and new { observations } formats
app.post("/make-server-6fdef95d/soil/analyze", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    const body = await c.req.json();
    
    console.log(`\n🔬 SOIL ANALYSIS REQUEST from user: ${userId}`);
    
    // ─── Format Detection & Normalization ───
    // Legacy format: { tests: { texture: 'sandy', ph: 'neutral', ... }, region?, field_id? }
    // New format:    { observations: [{ test_type, observation, confidence?, sample_spots? }], location?, season? }
    let analysisRequest: any;
    
    if (body.tests && typeof body.tests === 'object' && !body.observations) {
      // Convert legacy { tests } format to { observations } format
      console.log(`   Format: Legacy { tests } — converting ${Object.keys(body.tests).length} tests`);
      const observations = Object.entries(body.tests).map(([test_type, observation]) => ({
        test_type,
        observation: observation as string,
        confidence: 0.7,
        sample_spots: 1,
      }));
      analysisRequest = {
        observations,
        location: body.region || body.location || undefined,
        season: body.season || undefined,
        field_area_acres: body.field_area_acres || undefined,
      };
    } else if (body.observations && Array.isArray(body.observations)) {
      console.log(`   Format: New { observations } — ${body.observations.length} tests`);
      analysisRequest = body;
    } else {
      return c.json({ error: 'At least one test result is required. Send { tests: {...} } or { observations: [...] }' }, 400);
    }
    
    console.log(`   Location: ${analysisRequest.location || 'not provided'}`);
    
    // Run the comprehensive analysis engine
    const rawAnalysis = analyzeSoil(analysisRequest);
    
    console.log(`   Result: ${rawAnalysis.primary_soil_type.soil_name} (${rawAnalysis.confidence_percent}% confidence)`);
    console.log(`   Health Score: ${rawAnalysis.overall_health_score}/100`);
    
    // ─── Response Compatibility Layer ───
    // Map CompositeAnalysis → legacy shape that SoilHealthSummary.tsx expects
    const healthGrade = rawAnalysis.overall_health_score >= 80 ? 'Excellent' :
      rawAnalysis.overall_health_score >= 60 ? 'Good' :
      rawAnalysis.overall_health_score >= 40 ? 'Moderate' : 'Needs Improvement';
    
    const altMatch = rawAnalysis.alternative_matches?.[0];
    const isAmb = rawAnalysis.confidence_level === 'low' || 
      (altMatch && rawAnalysis.primary_soil_type.match_score - altMatch.match_score < 15);

    const hFactors: any[] = [
      { name: 'Soil Structure', score: rawAnalysis.structure_score, status: rawAnalysis.structure_score >= 70 ? 'Good' : rawAnalysis.structure_score >= 40 ? 'Moderate' : 'Poor' },
      { name: 'Nutrient Status', score: rawAnalysis.nutrient_score, status: rawAnalysis.nutrient_score >= 70 ? 'Good' : rawAnalysis.nutrient_score >= 40 ? 'Moderate' : 'Low' },
      { name: 'Soil Biology', score: rawAnalysis.biology_score, status: rawAnalysis.biology_score >= 70 ? 'Active' : rawAnalysis.biology_score >= 40 ? 'Low' : 'Very Low' },
      { name: 'Water Management', score: rawAnalysis.water_score, status: rawAnalysis.water_score >= 70 ? 'Good' : rawAnalysis.water_score >= 40 ? 'Moderate' : 'Poor' },
    ];

    const npkEst: any = { nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'Medium' };
    const defList = (rawAnalysis.nutrient_deficiencies || []).map((d: string) => d.toLowerCase());
    if (defList.some((d: string) => d.includes('nitrogen'))) npkEst.nitrogen = 'Low';
    if (defList.some((d: string) => d.includes('phosphorus'))) npkEst.phosphorus = 'Low';
    if (defList.some((d: string) => d.includes('potassium'))) npkEst.potassium = 'Low';
    if (rawAnalysis.fertility_rating === 'High') {
      if (npkEst.nitrogen === 'Medium') npkEst.nitrogen = 'Medium-High';
    }

    let phEst: any = null;
    if (rawAnalysis.estimated_ph) {
      const pm = rawAnalysis.estimated_ph.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
      phEst = pm ? { min: parseFloat(pm[1]), max: parseFloat(pm[2]), label: rawAnalysis.estimated_ph }
                  : { min: 6.5, max: 7.5, label: rawAnalysis.estimated_ph };
    }

    const rPlan = (rawAnalysis.immediate_actions || []).map((a: any) => ({
      priority: a.priority === 'urgent' ? 'high' : a.priority === 'important' ? 'medium' : 'low',
      action: a.action, quantity: 'Standard', timing: 'As recommended', benefit: a.reason,
    }));

    const cropRecs2 = (rawAnalysis.recommended_crops || []).map((n: string) => ({
      crop_name: n, crop_id: n.toLowerCase().replace(/\s+/g, '_'),
    }));

    const tc2 = analysisRequest.observations.length;
    
    const analysis = {
      identified_soil: {
        soil_id: rawAnalysis.primary_soil_type.soil_id,
        soil_name: rawAnalysis.primary_soil_type.soil_name,
        confidence_score: rawAnalysis.confidence_percent,
        confidence_level: rawAnalysis.confidence_level === 'high' ? 'High' : rawAnalysis.confidence_level === 'medium' ? 'Medium' : 'Low',
        match_reasons: rawAnalysis.primary_soil_type.matched_traits || [],
        mismatch_reasons: [] as string[],
        is_ambiguous: isAmb,
        ambiguity_note: isAmb && altMatch ? `Close between ${rawAnalysis.primary_soil_type.soil_name} and ${altMatch.soil_name}. More tests improve accuracy.` : null,
        runner_up: altMatch ? { soil_name: altMatch.soil_name, score: altMatch.match_score } : null,
      },
      health_score: rawAnalysis.overall_health_score,
      health_grade: healthGrade,
      health_factors: hFactors,
      npk_estimate: npkEst,
      ph_estimate: phEst,
      micronutrient_estimates: (rawAnalysis.micronutrient_estimates || []).map((m: any) => ({
        nutrient: m.nutrient, level: m.level, concern: m.concern,
      })),
      soil_properties: {
        water_retention: rawAnalysis.water_holding || 'Unknown',
        drainage: rawAnalysis.drainage_class || 'Unknown',
        fertility: rawAnalysis.fertility_rating || 'Unknown',
        organic_matter: rawAnalysis.organic_matter_level || 'Unknown',
        typical_ph: rawAnalysis.estimated_ph || 'Unknown',
        texture: rawAnalysis.texture_class || 'Unknown',
        compaction_tendency: rawAnalysis.compaction_risk || 'Unknown',
        ec_range: rawAnalysis.estimated_ec || 'Unknown',
      },
      cross_test_warnings: rawAnalysis.cross_validation_notes || [],
      remediation_plan: rPlan,
      crop_recommendations: cropRecs2,
      additional_suitable_crops: rawAnalysis.crops_to_avoid || [],
      major_problems: [] as string[],
      tests_completed: tc2,
      tests_recommended: Math.max(7 - tc2, 0),
      recommendation_to_improve_accuracy: tc2 < 3 ? 'Complete at least 3 tests for reliable results.' :
        tc2 < 5 ? 'Good coverage. Add more tests for highest accuracy.' :
        'Excellent coverage! Results are highly accurate.',
      all_soil_scores: [rawAnalysis.primary_soil_type, ...(rawAnalysis.alternative_matches || []).slice(0, 4)].map((s: any) => ({
        soil_id: s.soil_id, soil_name: s.soil_name, score: s.match_score,
      })),
      analyzed_at: new Date().toISOString(),
      _v2: rawAnalysis, // full new-format for future UI upgrades
    };
    
    // Save analysis to user history
    const fieldId = body.field_id || null;
    const analysisId = `soil_analysis:${userId}:${fieldId || 'general'}:${Date.now()}`;
    const savedAnalysis = {
      id: analysisId,
      user_id: userId,
      created_at: new Date().toISOString(),
      location: analysisRequest.location || null,
      season: analysisRequest.season || null,
      field_id: fieldId,
      observations_count: analysisRequest.observations.length,
      analysis,
    };
    
    await kv.set(analysisId, savedAnalysis);
    
    // Index under user
    const userAnalysesKey = `user:${userId}:soil_analyses`;
    const existing = await kv.get(userAnalysesKey) || [];
    await kv.set(userAnalysesKey, [analysisId, ...existing.slice(0, 19)]);
    
    return c.json({ success: true, analysis });
    
  } catch (error) {
    console.error('Soil analysis error:', error);
    return c.json({ error: 'Failed to analyze soil: ' + (error as Error).message }, 500);
  }
});

// Get soil analysis history (alias for /soil/analyses)
app.get("/make-server-6fdef95d/soil/analyses", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    const userId = verification.user.id;
    const ids = await kv.get(`user:${userId}:soil_analyses`) || [];
    let analyses: any[] = [];
    if (ids.length > 0) { const d = await kv.mget(ids); analyses = d.filter((a: any) => a); }
    return c.json({ analyses });
  } catch (error) {
    console.error('Soil analyses fetch error:', error);
    return c.json({ error: 'Failed to fetch analyses' }, 500);
  }
});

// Get soil analysis history
app.get("/make-server-6fdef95d/soil/history", async (c) => {
  try {
    const accessToken = getAccessTokenFromRequest(c);
    if (!accessToken) return c.json({ error: 'Authorization required' }, 401);
    
    const verification = await authService.verifyAccessToken(accessToken);
    if (!verification.valid || !verification.user) return c.json({ error: 'Invalid token' }, 401);
    
    const userId = verification.user.id;
    const ids = await kv.get(`user:${userId}:soil_analyses`) || [];
    
    let analyses: any[] = [];
    if (ids.length > 0) {
      const data = await kv.mget(ids);
      analyses = data.filter((d: any) => d);
    }
    
    return c.json({ analyses });
  } catch (error) {
    console.error('Soil history error:', error);
    return c.json({ error: 'Failed to fetch soil history' }, 500);
  }
});

Deno.serve(app.fetch);