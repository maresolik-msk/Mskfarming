import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

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
  console.log(`Incoming request: ${c.req.method} ${path}`);
  console.log('Headers:', {
    authorization: c.req.header('Authorization') ? 'Present' : 'Missing',
    apikey: c.req.header('apikey') ? 'Present' : 'Missing',
  });
  await next();
});

// Health check endpoint
app.get("/make-server-6fdef95d/health", (c) => {
  return c.json({ status: "ok" });
});

// Get Supabase configuration (public info only)
app.get("/make-server-6fdef95d/config", (c) => {
  return c.json({ 
    supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
    publicAnonKey: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  });
});

// ============= AUTHENTICATION ROUTES =============

// Sign up a new user
app.post("/make-server-6fdef95d/auth/signup", async (c) => {
  try {
    console.log('=== SIGNUP REQUEST ===');
    const authHeader = c.req.header('Authorization');
    console.log('Authorization header present:', !!authHeader);
    
    const { email, password, name, phone, language, location } = await c.req.json();
    
    console.log('Email:', email);
    console.log('Name:', name);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Create the user with SERVICE_ROLE_KEY and auto-confirm email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, language, location },
      email_confirm: true, // Auto-confirm since no email server is configured
    });
    
    if (error) {
      console.error('Signup error during user creation:', error);
      return c.json({ error: error.message }, 400);
    }
    
    console.log('User created successfully!');
    console.log('User ID:', data.user?.id);
    console.log('User confirmed:', !!data.user?.email_confirmed_at);
    
    // Return the user (frontend will auto-login after signup)
    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup error in request processing:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Sign in with email/password
app.post("/make-server-6fdef95d/auth/login", async (c) => {
  try {
    console.log('=== LOGIN REQUEST RECEIVED ===');
    const authHeader = c.req.header('Authorization');
    const apikeyHeader = c.req.header('apikey');
    console.log('Authorization header present:', !!authHeader);
    console.log('apikey header present:', !!apikeyHeader);
    
    // Log first 20 chars of each for debugging
    if (authHeader) {
      console.log('Authorization header preview:', authHeader.substring(0, 30) + '...');
    }
    if (apikeyHeader) {
      console.log('apikey header preview:', apikeyHeader.substring(0, 30) + '...');
    }
    
    // Log what the server expects
    const expectedAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    console.log('Expected SUPABASE_ANON_KEY preview:', expectedAnonKey?.substring(0, 30) + '...');
    
    const { email, password } = await c.req.json();
    
    console.log('Email:', email);
    
    // Create a fresh Supabase client for login (don't use any existing auth context)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('Login error during authentication:', {
        message: error.message,
        status: error.status,
        name: error.name,
        code: error.__isAuthError ? 'AuthError' : 'Unknown',
      });
      return c.json({ error: error.message || 'Invalid credentials' }, 400);
    }
    
    console.log('Login successful!');
    console.log('Session exists:', !!data.session);
    console.log('Access token exists:', !!data.session?.access_token);
    console.log('User exists:', !!data.user);
    
    return c.json({ session: data.session, user: data.user });
  } catch (error) {
    console.log('Login error in request processing:', error);
    return c.json({ error: 'Failed to log in' }, 500);
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
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !data.user) {
      return c.json({ session: null, user: null }, 200);
    }
    
    return c.json({ user: data.user });
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

// ============= USER PROFILE ROUTES =============

// Get user profile
app.get("/make-server-6fdef95d/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const profile = await kv.get(`user:${user.id}:profile`);
    
    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-6fdef95d/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const profileData = await c.req.json();
    
    console.log('=== Profile Update Request ===');
    console.log('Has Authorization header:', !!c.req.header('Authorization'));
    console.log('Access token present:', !!accessToken);
    console.log('Profile data received:', JSON.stringify(profileData).substring(0, 200));
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      console.log('Profile update - Unauthorized. Error:', error);
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    console.log(`Updating profile for user ${user.id}`);
    
    // Add onboardingComplete flag and user ID to profile data
    const completeProfileData = {
      ...profileData,
      userId: user.id,
      onboardingComplete: true,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`user:${user.id}:profile`, completeProfileData);
    
    console.log('Profile updated successfully');
    return c.json({ success: true, profile: completeProfileData });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ success: false, error: 'Failed to update profile' }, 500);
  }
});

// ============= TASKS ROUTES =============

// Get all tasks for user
app.get("/make-server-6fdef95d/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const tasks = await kv.get(`user:${user.id}:tasks`) || [];
    
    return c.json({ tasks });
  } catch (error) {
    console.log('Get tasks error:', error);
    return c.json({ error: 'Failed to get tasks' }, 500);
  }
});

// Create new task
app.post("/make-server-6fdef95d/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const taskData = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const tasks = await kv.get(`user:${user.id}:tasks`) || [];
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
    };
    tasks.push(newTask);
    
    await kv.set(`user:${user.id}:tasks`, tasks);
    
    return c.json({ task: newTask });
  } catch (error) {
    console.log('Create task error:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// Toggle task completion
app.put("/make-server-6fdef95d/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const taskId = c.req.param('id');
    const { completed } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const tasks = await kv.get(`user:${user.id}:tasks`) || [];
    const updatedTasks = tasks.map((task: any) => 
      task.id === taskId ? { ...task, completed } : task
    );
    
    await kv.set(`user:${user.id}:tasks`, updatedTasks);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Update task error:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

// Delete task
app.delete("/make-server-6fdef95d/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const taskId = c.req.param('id');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const tasks = await kv.get(`user:${user.id}:tasks`) || [];
    const updatedTasks = tasks.filter((task: any) => task.id !== taskId);
    
    await kv.set(`user:${user.id}:tasks`, updatedTasks);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete task error:', error);
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

// ============= JOURNAL ROUTES =============

// Get all journal entries for user
app.get("/make-server-6fdef95d/journal", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const entries = await kv.get(`user:${user.id}:journal`) || [];
    
    return c.json({ entries });
  } catch (error) {
    console.log('Get journal entries error:', error);
    return c.json({ error: 'Failed to get journal entries' }, 500);
  }
});

// Create journal entry
app.post("/make-server-6fdef95d/journal", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const entryData = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const entries = await kv.get(`user:${user.id}:journal`) || [];
    const newEntry = {
      ...entryData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    entries.unshift(newEntry);
    
    await kv.set(`user:${user.id}:journal`, entries);
    
    return c.json({ entry: newEntry });
  } catch (error) {
    console.log('Create journal entry error:', error);
    return c.json({ error: 'Failed to create journal entry' }, 500);
  }
});

// ============= EXPENSES ROUTES =============

// Get all expenses for user
app.get("/make-server-6fdef95d/expenses", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const expenses = await kv.get(`user:${user.id}:expenses`) || [];
    
    return c.json({ expenses });
  } catch (error) {
    console.log('Get expenses error:', error);
    return c.json({ error: 'Failed to get expenses' }, 500);
  }
});

// Create expense
app.post("/make-server-6fdef95d/expenses", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const expenseData = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const expenses = await kv.get(`user:${user.id}:expenses`) || [];
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    expenses.unshift(newExpense);
    
    await kv.set(`user:${user.id}:expenses`, expenses);
    
    return c.json({ expense: newExpense });
  } catch (error) {
    console.log('Create expense error:', error);
    return c.json({ error: 'Failed to create expense' }, 500);
  }
});

// ============= FIELDS ROUTES =============

// Get all fields for user
app.get("/make-server-6fdef95d/fields", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const fields = await kv.get(`user:${user.id}:fields`) || [];
    
    return c.json({ fields });
  } catch (error) {
    console.log('Get fields error:', error);
    return c.json({ error: 'Failed to get fields' }, 500);
  }
});

// Create new field
app.post("/make-server-6fdef95d/fields", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const fieldData = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const fields = await kv.get(`user:${user.id}:fields`) || [];
    
    // Calculate progress if crop is planted
    let calculatedField = { ...fieldData };
    if (fieldData.plantingDate && fieldData.expectedHarvestDate) {
      const plantDate = new Date(fieldData.plantingDate);
      const harvestDate = new Date(fieldData.expectedHarvestDate);
      const today = new Date();
      
      const totalDays = Math.ceil((harvestDate.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24));
      const currentDay = Math.ceil((today.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24));
      const progress = Math.min(Math.round((currentDay / totalDays) * 100), 100);
      
      calculatedField = {
        ...fieldData,
        day: Math.max(currentDay, 0),
        totalDays,
        progress: Math.max(progress, 0),
      };
    }
    
    const newField = {
      ...calculatedField,
      id: Date.now().toString(),
    };
    
    fields.push(newField);
    await kv.set(`user:${user.id}:fields`, fields);
    
    return c.json({ field: newField });
  } catch (error) {
    console.log('Create field error:', error);
    return c.json({ error: 'Failed to create field' }, 500);
  }
});

// Update field
app.put("/make-server-6fdef95d/fields/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const fieldId = c.req.param('id');
    const fieldData = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const fields = await kv.get(`user:${user.id}:fields`) || [];
    const fieldIndex = fields.findIndex((f: any) => f.id === fieldId);
    
    if (fieldIndex === -1) {
      return c.json({ error: 'Field not found' }, 404);
    }
    
    // Calculate progress if crop is planted
    let calculatedData = { ...fieldData };
    if (fieldData.plantingDate && fieldData.expectedHarvestDate) {
      const plantDate = new Date(fieldData.plantingDate);
      const harvestDate = new Date(fieldData.expectedHarvestDate);
      const today = new Date();
      
      const totalDays = Math.ceil((harvestDate.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24));
      const currentDay = Math.ceil((today.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24));
      const progress = Math.min(Math.round((currentDay / totalDays) * 100), 100);
      
      calculatedData = {
        ...fieldData,
        day: Math.max(currentDay, 0),
        totalDays,
        progress: Math.max(progress, 0),
      };
    }
    
    fields[fieldIndex] = { ...fields[fieldIndex], ...calculatedData };
    await kv.set(`user:${user.id}:fields`, fields);
    
    return c.json({ field: fields[fieldIndex] });
  } catch (error) {
    console.log('Update field error:', error);
    return c.json({ error: 'Failed to update field' }, 500);
  }
});

// Delete field
app.delete("/make-server-6fdef95d/fields/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const fieldId = c.req.param('id');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const fields = await kv.get(`user:${user.id}:fields`) || [];
    const updatedFields = fields.filter((f: any) => f.id !== fieldId);
    
    await kv.set(`user:${user.id}:fields`, updatedFields);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete field error:', error);
    return c.json({ error: 'Failed to delete field' }, 500);
  }
});

// ============= WEATHER ROUTES =============

// Get weather data from OpenWeatherMap API
app.get("/make-server-6fdef95d/weather", async (c) => {
  try {
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    
    if (!lat || !lon) {
      console.log('Weather request missing coordinates');
      return c.json({ error: 'Latitude and longitude are required' }, 400);
    }
    
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!apiKey) {
      console.log('OpenWeather API key not configured');
      // Return mock data if API key is not configured
      return c.json({ 
        current: {
          temp: 28,
          humidity: 65,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
          wind_speed: 3.5,
          clouds: 20
        },
        forecast: {
          list: []
        },
        isMock: true
      });
    }
    
    console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
    
    // Fetch current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const currentResponse = await fetch(currentUrl);
    
    if (!currentResponse.ok) {
      console.log('Failed to fetch current weather:', currentResponse.status, currentResponse.statusText);
      throw new Error(`Weather API returned ${currentResponse.status}`);
    }
    
    const currentWeather = await currentResponse.json();
    console.log('Current weather fetched successfully');
    
    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      console.log('Failed to fetch forecast, using current weather only');
      // Return current weather but empty forecast
      return c.json({ 
        current: currentWeather,
        forecast: {
          list: []
        },
        isMock: false
      });
    }
    
    const forecastData = await forecastResponse.json();
    
    console.log('Weather data fetched successfully');
    return c.json({ 
      current: currentWeather,
      forecast: forecastData,
      isMock: false
    });
  } catch (error) {
    console.log('Weather fetch error:', error);
    
    // Return mock data instead of error
    return c.json({ 
      current: {
        temp: 28,
        humidity: 65,
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind_speed: 3.5,
        clouds: 20
      },
      forecast: {
        list: []
      },
      isMock: true
    });
  }
});

// ============= SATELLITE MONITORING / VEGETATION ROUTES =============

// Get vegetation data for a specific field
app.get("/make-server-6fdef95d/fields/:id/vegetation", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const fieldId = c.req.param('id');
    const date = c.req.query('date'); // 'latest' or specific date
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get the field to access boundary
    const fields = await kv.get(`user:${user.id}:fields`) || [];
    const field = fields.find((f: any) => f.id === fieldId);
    
    if (!field) {
      return c.json({ error: 'Field not found' }, 404);
    }
    
    // For MVP: Return simulated vegetation data
    // In production: This would call Google Earth Engine API
    // to fetch Sentinel-2 imagery and compute NDVI
    
    console.log(`Generating vegetation data for field ${fieldId}`);
    
    // Simulate different health statuses based on field name/random
    const healthStatuses = ['healthy', 'moderate', 'stressed', 'poor'];
    const randomStatus = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
    
    // Generate realistic NDVI based on status
    let avgNdvi = 0.5;
    let stressPercent = 0;
    
    switch (randomStatus) {
      case 'healthy':
        avgNdvi = 0.65 + Math.random() * 0.15; // 0.65-0.8
        stressPercent = Math.floor(Math.random() * 5); // 0-5%
        break;
      case 'moderate':
        avgNdvi = 0.45 + Math.random() * 0.15; // 0.45-0.6
        stressPercent = Math.floor(Math.random() * 15) + 5; // 5-20%
        break;
      case 'stressed':
        avgNdvi = 0.25 + Math.random() * 0.15; // 0.25-0.4
        stressPercent = Math.floor(Math.random() * 20) + 20; // 20-40%
        break;
      case 'poor':
        avgNdvi = 0.1 + Math.random() * 0.1; // 0.1-0.2
        stressPercent = Math.floor(Math.random() * 30) + 40; // 40-70%
        break;
    }
    
    const vegetationData = {
      date: new Date().toISOString(),
      avg_ndvi: parseFloat(avgNdvi.toFixed(3)),
      health_status: randomStatus,
      stress_zones_percent: stressPercent,
      cloud_cover: Math.floor(Math.random() * 30), // Random cloud cover
      data_available: true,
      source: 'simulated', // In production: 'sentinel-2'
    };
    
    // Store the vegetation data for this field
    await kv.set(`field:${fieldId}:vegetation:latest`, vegetationData);
    
    return c.json(vegetationData);
  } catch (error) {
    console.log('Get vegetation data error:', error);
    return c.json({ error: 'Failed to fetch vegetation data' }, 500);
  }
});

// Get vegetation time series/trend for a field
app.get("/make-server-6fdef95d/fields/:id/vegetation/trend", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const fieldId = c.req.param('id');
    const days = parseInt(c.req.query('days') || '60');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // For MVP: Return simulated trend data
    // In production: Query historical satellite data
    
    console.log(`Generating ${days}-day vegetation trend for field ${fieldId}`);
    
    const trend = [];
    const now = new Date();
    
    // Generate data points every 5 days (Sentinel-2 frequency)
    for (let i = days; i >= 0; i -= 5) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulate NDVI trend with some variation
      const baseNdvi = 0.5 + Math.sin(i / 10) * 0.2;
      const variation = (Math.random() - 0.5) * 0.1;
      const ndvi = Math.max(0.1, Math.min(0.8, baseNdvi + variation));
      
      let status = 'moderate';
      if (ndvi > 0.6) status = 'healthy';
      else if (ndvi > 0.4) status = 'moderate';
      else if (ndvi > 0.2) status = 'stressed';
      else status = 'poor';
      
      trend.push({
        date: date.toISOString().split('T')[0],
        avg_ndvi: parseFloat(ndvi.toFixed(3)),
        health_status: status,
      });
    }
    
    return c.json({ trend, days });
  } catch (error) {
    console.log('Get vegetation trend error:', error);
    return c.json({ error: 'Failed to fetch vegetation trend' }, 500);
  }
});

Deno.serve(app.fetch);