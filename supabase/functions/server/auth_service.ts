/**
 * Authentication Service for Indian Crop Intelligence Engine
 * Handles user management, JWT tokens, and role-based access
 */

import * as kv from "./kv_store.tsx";

// User roles
export type UserRole = 'farmer' | 'expert' | 'admin';

// User interface
export interface User {
  id: string;
  mobile_number: string;
  email?: string;
  full_name?: string; // Optional - collected progressively after login
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Additional farmer-specific fields
  location?: string;
  language?: string;
  profile_complete?: boolean;
}

// Session/Token interface
export interface AuthToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
}

// JWT Payload (simplified for MVP - in production use proper JWT library)
export interface JWTPayload {
  user_id: string;
  role: UserRole;
  mobile_number: string;
  iat: number; // Issued at
  exp: number; // Expires at
}

// Token expiry times
const ACCESS_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generate a simple token (for MVP)
 * In production, use proper JWT library with signing
 */
export function generateToken(userId: string, type: 'access' | 'refresh'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const secondRandom = Math.random().toString(36).substring(2, 15);
  return `${type}_${userId}_${timestamp}_${random}${secondRandom}`;
}

/**
 * Generate JWT payload (simplified for MVP)
 */
export function createJWTPayload(user: User): JWTPayload {
  const now = Date.now();
  return {
    user_id: user.id,
    role: user.role,
    mobile_number: user.mobile_number,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + ACCESS_TOKEN_EXPIRY) / 1000),
  };
}

/**
 * Encode JWT (simplified - in production use proper JWT library)
 */
export function encodeJWT(payload: JWTPayload): string {
  // For MVP, just use base64 encoding
  // In production, use proper JWT signing with secret key
  return btoa(JSON.stringify(payload));
}

/**
 * Decode JWT (simplified - in production use proper JWT library)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = atob(token);
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify JWT token
 */
export function verifyJWT(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
  const payload = decodeJWT(token);
  
  if (!payload) {
    return { valid: false, error: 'Invalid token format' };
  }

  const now = Math.floor(Date.now() / 1000);
  
  if (payload.exp < now) {
    return { valid: false, error: 'Token has expired' };
  }

  return { valid: true, payload };
}

/**
 * Create a new user
 */
export async function createUser(
  mobileNumber: string,
  fullName: string,
  role: UserRole = 'farmer',
  additionalData?: Partial<User>
): Promise<User> {
  // Use mobile number as the user ID for simplicity
  const userId = mobileNumber;
  const now = new Date().toISOString();

  const user: User = {
    id: userId,
    mobile_number: mobileNumber,
    full_name: fullName,
    role,
    is_verified: true, // Verified via OTP
    is_active: true,
    created_at: now,
    updated_at: now,
    profile_complete: false,
    ...additionalData,
  };

  // Store user with BOTH keys for consistency
  // Primary key: user:mobile:{number}
  // Secondary key: user:id:{id} (where id = mobile number)
  await kv.set(`user:mobile:${mobileNumber}`, user);
  await kv.set(`user:id:${userId}`, user);

  console.log(`User created with ID: ${userId} (mobile: ${mobileNumber})`);
  console.log(`Stored at keys: user:mobile:${mobileNumber} and user:id:${userId}`);
  
  return user;
}

/**
 * Get user by mobile number
 */
export async function getUserByMobile(mobileNumber: string): Promise<User | null> {
  // Mobile number IS the user ID now - use the mobile key
  const user = await kv.get(`user:mobile:${mobileNumber}`);
  return user as User | null;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  // User ID IS the mobile number now - use the id key
  const user = await kv.get(`user:id:${userId}`);
  return user as User | null;
}

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUserById(userId);
  
  if (!user) {
    return null;
  }

  const updatedUser: User = {
    ...user,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // Update BOTH keys for consistency
  await kv.set(`user:id:${userId}`, updatedUser);
  await kv.set(`user:mobile:${user.mobile_number}`, updatedUser);

  console.log(`User updated: ${userId}`);
  console.log(`Updated at keys: user:id:${userId} and user:mobile:${user.mobile_number}`);
  
  return updatedUser;
}

/**
 * Create authentication tokens
 */
export async function createAuthTokens(user: User): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const now = new Date();
  
  // Generate simple token IDs instead of using base64 JWT
  const accessTokenId = generateToken(user.id, 'access');
  const refreshToken = generateToken(user.id, 'refresh');
  
  const accessExpiresAt = new Date(now.getTime() + ACCESS_TOKEN_EXPIRY);
  const refreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_EXPIRY);

  // Create JWT payload for metadata (not used as token itself)
  const jwtPayload = createJWTPayload(user);

  // Store access token data with simple string key
  const accessTokenData: AuthToken = {
    id: accessTokenId,
    user_id: user.id,
    access_token: accessTokenId,
    refresh_token: refreshToken,
    expires_at: accessExpiresAt.toISOString(),
    created_at: now.toISOString(),
  };

  // Store refresh token data
  const refreshTokenData: AuthToken = {
    id: `refresh_${Date.now()}`,
    user_id: user.id,
    access_token: accessTokenId,
    refresh_token: refreshToken,
    expires_at: refreshExpiresAt.toISOString(),
    created_at: now.toISOString(),
  };

  // Store tokens with simple keys (no special characters)
  await kv.set(`auth:token:${accessTokenId}`, accessTokenData);
  await kv.set(`auth:refresh:${refreshToken}`, refreshTokenData);
  await kv.set(`auth:user:${user.id}:token`, accessTokenData);

  console.log(`Auth tokens created for user ${user.id}`);
  console.log(`Access token: ${accessTokenId.substring(0, 30)}...`);

  return {
    access_token: accessTokenId, // Return simple token instead of JWT
    refresh_token: refreshToken,
    expires_in: Math.floor(ACCESS_TOKEN_EXPIRY / 1000), // seconds
  };
}

/**
 * Verify access token
 */
export async function verifyAccessToken(accessToken: string): Promise<{
  valid: boolean;
  user?: User;
  error?: string;
}> {
  // Check if it's a custom session token (backward compatibility)
  if (accessToken.startsWith('session_')) {
    const session = await kv.get(`session:${accessToken}`);
    if (session && (session as any).userId) {
      const user = await kv.get(`user:id:${(session as any).userId}`);
      if (user) {
        return { valid: true, user: user as User };
      }
    }
    return { valid: false, error: 'Invalid session token' };
  }

  // Check new token system
  const tokenData = await kv.get(`auth:token:${accessToken}`) as AuthToken | null;
  
  if (!tokenData) {
    return { valid: false, error: 'Invalid token' };
  }

  // Check if token has expired
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);
  
  if (now > expiresAt) {
    // Clean up expired token
    await kv.del(`auth:token:${accessToken}`);
    return { valid: false, error: 'Token has expired' };
  }

  // Get user
  const user = await getUserById(tokenData.user_id);
  
  if (!user) {
    return { valid: false, error: 'User not found' };
  }

  if (!user.is_active) {
    return { valid: false, error: 'User account is disabled' };
  }

  return { valid: true, user };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
}> {
  const tokenData = await kv.get(`auth:refresh:${refreshToken}`) as AuthToken | null;
  
  if (!tokenData) {
    return { success: false, error: 'Invalid refresh token' };
  }

  // Check if refresh token has expired
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);
  
  if (now > expiresAt) {
    // Clean up expired token
    await kv.del(`auth:refresh:${refreshToken}`);
    await kv.del(`auth:token:${tokenData.access_token}`);
    return { success: false, error: 'Refresh token has expired' };
  }

  // Get user
  const user = await getUserById(tokenData.user_id);
  
  if (!user || !user.is_active) {
    return { success: false, error: 'User not found or inactive' };
  }

  // Invalidate old tokens
  await kv.del(`auth:token:${tokenData.access_token}`);
  await kv.del(`auth:refresh:${tokenData.refresh_token}`);

  // Create new tokens
  const newTokens = await createAuthTokens(user);

  console.log(`Tokens refreshed for user ${user.id}`);

  return {
    success: true,
    ...newTokens,
  };
}

/**
 * Logout - invalidate tokens
 */
export async function logout(accessToken: string): Promise<{ success: boolean }> {
  const tokenData = await kv.get(`auth:token:${accessToken}`) as AuthToken | null;
  
  if (tokenData) {
    // Delete all token references
    await kv.del(`auth:token:${tokenData.access_token}`);
    await kv.del(`auth:refresh:${tokenData.refresh_token}`);
    await kv.del(`auth:user:${tokenData.user_id}:token`);
    
    console.log(`User ${tokenData.user_id} logged out`);
  }

  return { success: true };
}

/**
 * Validate mobile number format (Indian mobile numbers)
 */
export function validateMobileNumber(mobile: string): { valid: boolean; error?: string } {
  // Remove any spaces or special characters
  const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
  
  // Indian mobile numbers: 10 digits starting with 6-9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  if (!indianMobileRegex.test(cleaned)) {
    return {
      valid: false,
      error: 'Please enter a valid 10-digit Indian mobile number',
    };
  }

  return { valid: true };
}

/**
 * Format mobile number consistently
 */
export function formatMobileNumber(mobile: string): string {
  // Remove any spaces or special characters
  return mobile.replace(/[\s\-\(\)]/g, '');
}