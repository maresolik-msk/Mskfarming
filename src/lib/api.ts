import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

let authToken: string | null = null;
let runtimeAnonKey: string | null = publicAnonKey; // Start with static key

// Fetch the actual anon key from server
async function fetchRuntimeConfig() {
  try {
    console.log('Fetching runtime config from server...');
    // Use the static key for this initial request
    const response = await fetch(`${API_URL}/config`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey,
      },
    });
    
    if (response.ok) {
      const config = await response.json();
      if (config.publicAnonKey) {
        runtimeAnonKey = config.publicAnonKey;
        console.log('Runtime anon key fetched successfully');
        console.log('Keys match:', publicAnonKey === runtimeAnonKey);
        return true;
      }
    } else {
      console.warn('Config fetch failed with status:', response.status);
    }
  } catch (error) {
    console.warn('Failed to fetch runtime config, using static key:', error);
  }
  return false;
}

// Initialize config - but don't block
const configPromise = fetchRuntimeConfig();

// Get the correct anon key (runtime if available, fallback to static)
function getAnonKey(): string {
  return runtimeAnonKey || publicAnonKey;
}

export function setAuthToken(token: string | null) {
  console.log('setAuthToken called with:', token ? `${token.substring(0, 20)}...` : 'null');
  authToken = token;
  
  // Also persist to localStorage as backup
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
  
  console.log('authToken is now:', authToken ? 'SET' : 'NULL');
}

export function getAuthToken() {
  // If token isn't in memory, try to restore from localStorage
  if (!authToken) {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      console.log('Restoring auth token from localStorage');
      authToken = storedToken;
    }
  }
  
  console.log('getAuthToken called, returning:', authToken ? 'SET' : 'NULL');
  return authToken;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Get the current auth token (with localStorage fallback)
  const currentToken = getAuthToken();
  
  // Public endpoints that don't require user authentication - DON'T send Authorization header at all
  const publicEndpoints = ['/auth/login', '/auth/signup', '/config', '/weather'];
  const isPublicEndpoint = publicEndpoints.some(path => endpoint.startsWith(path));
  
  // Build headers conditionally
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  // For public endpoints, only send the anon key (required by Supabase Edge Functions)
  // For authenticated endpoints, send both Authorization and apikey
  if (isPublicEndpoint) {
    // Public endpoints still need the anon key for Supabase Edge Functions
    headers['Authorization'] = `Bearer ${getAnonKey()}`;
  } else {
    const tokenToUse = currentToken || getAnonKey();
    headers['Authorization'] = `Bearer ${tokenToUse}`;
    headers['apikey'] = getAnonKey();
  }

  // Only log for non-session endpoints to reduce noise
  if (!endpoint.includes('/auth/session')) {
    console.log(`API Request to ${endpoint}:`, {
      hasAuthToken: !!currentToken,
      isPublicEndpoint,
      sendingAuthHeader: !isPublicEndpoint,
      url: `${API_URL}${endpoint}`,
    });
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Only log responses for non-session endpoints
    if (!endpoint.includes('/auth/session')) {
      console.log(`Response from ${endpoint}:`, {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });
    }

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        
        // Only log error details for non-session endpoints
        if (!endpoint.includes('/auth/session')) {
          console.error(`API Error Details:`, {
            endpoint,
            status: response.status,
            error: errorMessage,
            fullErrorData: errorData,
          });
        }
      } catch (parseError) {
        if (!endpoint.includes('/auth/session')) {
          console.error(`API Error (${response.status}): Could not parse error response`, parseError);
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Don't log session check errors - they're expected when not logged in
    if (!endpoint.includes('/auth/session')) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error(`Network error - server may be unavailable:`, {
          endpoint,
          error: error.message,
          url: `${API_URL}${endpoint}`,
        });
      } else {
        console.error(`API request to ${endpoint} failed:`, error);
      }
    }
    throw error;
  }
}

// ============= AUTH API =============

// Client-side only auth (bypasses backend due to JWT issues)
const CLIENT_SIDE_AUTH = true; // Toggle to use client-side auth

// Initialize demo account in localStorage
function initializeDemoAccount() {
  const users = JSON.parse(localStorage.getItem('app_users') || '{}');
  
  // Create demo account if it doesn't exist or if password mismatch
  const demoEmail = 'demo@farmerdemo.com';
  const demoPass = 'demo123';
  
  if (!users[demoEmail] || users[demoEmail].password !== demoPass) {
    users[demoEmail] = {
      id: 'user_demo_12345',
      email: demoEmail,
      password: demoPass,
      name: 'Demo Farmer',
      phone: '9876543210',
      language: 'English',
      location: 'Punjab, India',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('app_users', JSON.stringify(users));
    console.log('Demo account initialized/updated in localStorage');
    console.log('Demo account details:', { email: demoEmail, password: demoPass });
  } else {
    console.log('Demo account verified in localStorage');
    console.log('Stored password:', users[demoEmail].password);
  }
}

// Force reset demo account (useful for fixing corrupted accounts)
export function resetDemoAccount() {
  console.log('Forcing demo account reset...');
  const users = JSON.parse(localStorage.getItem('app_users') || '{}');
  
  const demoEmail = 'demo@farmerdemo.com';
  const demoPass = 'demo123';
  
  users[demoEmail] = {
    id: 'user_demo_12345',
    email: demoEmail,
    password: demoPass,
    name: 'Demo Farmer',
    phone: '9876543210',
    language: 'English',
    location: 'Punjab, India',
    created_at: new Date().toISOString(),
  };
  
  localStorage.setItem('app_users', JSON.stringify(users));
  console.log('Demo account forcefully reset!');
  console.log('New credentials - Email:', demoEmail, 'Password:', demoPass);
  
  return { email: demoEmail, password: demoPass };
}

// Clear all auth data (useful for debugging)
export function clearAllAuthData() {
  console.log('Clearing all auth data...');
  localStorage.removeItem('app_users');
  localStorage.removeItem('current_session');
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('hasOnboarded');
  console.log('All auth data cleared. Reinitializing demo account...');
  initializeDemoAccount();
}

// Initialize demo account on load
if (CLIENT_SIDE_AUTH) {
  initializeDemoAccount();
}

export async function signup(data: {
  email: string;
  password: string;
  phone?: string;
  name: string;
  language: string;
  location: string;
}) {
  if (CLIENT_SIDE_AUTH) {
    // Store user locally
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email: data.email,
      name: data.name,
      phone: data.phone,
      language: data.language,
      location: data.location,
      created_at: new Date().toISOString(),
    };
    
    // Store in localStorage
    const users = JSON.parse(localStorage.getItem('app_users') || '{}');
    users[data.email] = { ...user, password: data.password };
    localStorage.setItem('app_users', JSON.stringify(users));
    
    console.log('User registered locally:', user);
    return { user };
  }
  
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
}

export async function login(email: string, password: string) {
  if (CLIENT_SIDE_AUTH) {
    // Ensure demo account exists
    initializeDemoAccount();
    
    // Check localStorage for user
    const users = JSON.parse(localStorage.getItem('app_users') || '{}');
    const user = users[email];
    
    console.log('Login attempt:', { 
      email, 
      userExists: !!user,
      allUsers: Object.keys(users),
      passwordMatch: user ? user.password === password : 'N/A'
    });
    
    if (!user) {
      throw new Error('No account found with this email. Please sign up first.');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password. Please try again.');
    }
    
    // Create session token
    const sessionToken = `session_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      language: user.language,
      location: user.location,
      created_at: user.created_at,
    };
    
    // Store session
    localStorage.setItem('current_session', JSON.stringify({
      access_token: sessionToken,
      user: userWithoutPassword,
    }));
    
    setAuthToken(sessionToken);
    
    console.log('Login successful (client-side):', userWithoutPassword);
    return {
      session: {
        access_token: sessionToken,
        user: userWithoutPassword,
      },
      user: userWithoutPassword,
    };
  }
  
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  console.log('Login response:', response);
  
  if (response.session?.access_token) {
    console.log('Setting auth token from login');
    setAuthToken(response.session.access_token);
  } else {
    console.error('No access token in login response!');
  }
  
  return response;
}

export async function logout() {
  if (CLIENT_SIDE_AUTH) {
    localStorage.removeItem('current_session');
    setAuthToken(null);
    return { success: true };
  }
  
  const response = await apiRequest('/auth/logout', {
    method: 'POST',
  });
  setAuthToken(null);
  return response;
}

export async function getSession() {
  if (CLIENT_SIDE_AUTH) {
    const session = localStorage.getItem('current_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      setAuthToken(parsedSession.access_token);
      return parsedSession;
    }
    return { user: null };
  }
  
  try {
    const response = await apiRequest('/auth/session');
    return response;
  } catch (error) {
    // Session check failure is completely normal when user is not logged in
    // Don't log anything - this is expected behavior
    return { user: null };
  }
}

// ============= USER PROFILE API =============

export async function getUserProfile() {
  if (CLIENT_SIDE_AUTH) {
    // Get current user from session
    const session = localStorage.getItem('current_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      console.log('Loaded user profile from localStorage:', parsedSession.user);
      return parsedSession.user;
    }
    return null;
  }
  const response = await apiRequest('/user/profile');
  return response.profile;
}

export async function updateUserProfile(profileData: any) {
  if (CLIENT_SIDE_AUTH) {
    // Get current session
    const session = localStorage.getItem('current_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      const updatedUser = { ...parsedSession.user, ...profileData };
      
      // Update session
      parsedSession.user = updatedUser;
      localStorage.setItem('current_session', JSON.stringify(parsedSession));
      
      // Also update in users database
      const users = JSON.parse(localStorage.getItem('app_users') || '{}');
      if (users[updatedUser.email]) {
        users[updatedUser.email] = { ...users[updatedUser.email], ...profileData };
        localStorage.setItem('app_users', JSON.stringify(users));
      }
      
      console.log('User profile updated locally:', updatedUser);
      return { success: true, profile: updatedUser };
    }
    throw new Error('No active session');
  }
  const response = await apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return response; // Return the full response with success flag
}


// Helper to get current user ID for data scoping
function getCurrentUserId(): string | null {
  try {
    const session = localStorage.getItem('current_session');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.user?.id || null;
    }
  } catch (e) {
    console.error('Error getting current user ID:', e);
  }
  return null;
}

// ============= TASKS API =============

export async function getTasks() {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) return []; // No user, no data
    
    const tasks = JSON.parse(localStorage.getItem(`app_tasks_${userId}`) || '[]');
    console.log('Loaded tasks from localStorage:', tasks.length);
    return tasks;
  }
  const response = await apiRequest('/tasks');
  return response;
}

export async function createTask(task: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const tasks = JSON.parse(localStorage.getItem(`app_tasks_${userId}`) || '[]');
    const newTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      user_id: userId,
    };
    tasks.push(newTask);
    localStorage.setItem(`app_tasks_${userId}`, JSON.stringify(tasks));
    console.log('Task created locally:', newTask);
    return newTask;
  }
  const response = await apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
  return response;
}

export async function updateTask(id: string, task: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const tasks = JSON.parse(localStorage.getItem(`app_tasks_${userId}`) || '[]');
    const index = tasks.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...task, updated_at: new Date().toISOString() };
      localStorage.setItem(`app_tasks_${userId}`, JSON.stringify(tasks));
      console.log('Task updated locally:', tasks[index]);
      return tasks[index];
    }
    throw new Error('Task not found');
  }
  const response = await apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  });
  return response;
}

export async function deleteTask(id: string) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const tasks = JSON.parse(localStorage.getItem(`app_tasks_${userId}`) || '[]');
    const filtered = tasks.filter((t: any) => t.id !== id);
    localStorage.setItem(`app_tasks_${userId}`, JSON.stringify(filtered));
    console.log('Task deleted locally:', id);
    return { success: true };
  }
  const response = await apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function toggleTask(id: string, completed: boolean) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const tasks = JSON.parse(localStorage.getItem(`app_tasks_${userId}`) || '[]');
    const index = tasks.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      tasks[index] = { 
        ...tasks[index], 
        completed, 
        updated_at: new Date().toISOString() 
      };
      localStorage.setItem(`app_tasks_${userId}`, JSON.stringify(tasks));
      console.log('Task toggled locally:', tasks[index]);
      return tasks[index];
    }
    throw new Error('Task not found');
  }
  const response = await apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ completed }),
  });
  return response;
}

// ============= EXPENSES API =============

export async function getExpenses() {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const expenses = JSON.parse(localStorage.getItem(`app_expenses_${userId}`) || '[]');
    console.log('Loaded expenses from localStorage:', expenses.length);
    return expenses;
  }
  const response = await apiRequest('/expenses');
  return response;
}

export async function createExpense(expense: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const expenses = JSON.parse(localStorage.getItem(`app_expenses_${userId}`) || '[]');
    const newExpense = {
      ...expense,
      id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      user_id: userId,
    };
    expenses.push(newExpense);
    localStorage.setItem(`app_expenses_${userId}`, JSON.stringify(expenses));
    console.log('Expense created locally:', newExpense);
    return newExpense;
  }
  const response = await apiRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
  return response;
}

export async function updateExpense(id: string, expense: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const expenses = JSON.parse(localStorage.getItem(`app_expenses_${userId}`) || '[]');
    const index = expenses.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...expense, updated_at: new Date().toISOString() };
      localStorage.setItem(`app_expenses_${userId}`, JSON.stringify(expenses));
      console.log('Expense updated locally:', expenses[index]);
      return expenses[index];
    }
    throw new Error('Expense not found');
  }
  const response = await apiRequest(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  });
  return response;
}

export async function deleteExpense(id: string) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const expenses = JSON.parse(localStorage.getItem(`app_expenses_${userId}`) || '[]');
    const filtered = expenses.filter((e: any) => e.id !== id);
    localStorage.setItem(`app_expenses_${userId}`, JSON.stringify(filtered));
    console.log('Expense deleted locally:', id);
    return { success: true };
  }
  const response = await apiRequest(`/expenses/${id}`, {
    method: 'DELETE',
  });
  return response;
}

// ============= JOURNAL API =============

export async function getJournalEntries() {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const entries = JSON.parse(localStorage.getItem(`app_journal_${userId}`) || '[]');
    console.log('Loaded journal entries from localStorage:', entries.length);
    return entries;
  }
  const response = await apiRequest('/journal');
  return response;
}

export async function createJournalEntry(entry: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const entries = JSON.parse(localStorage.getItem(`app_journal_${userId}`) || '[]');
    const newEntry = {
      ...entry,
      id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      user_id: userId,
    };
    entries.push(newEntry);
    localStorage.setItem(`app_journal_${userId}`, JSON.stringify(entries));
    console.log('Journal entry created locally:', newEntry);
    return newEntry;
  }
  const response = await apiRequest('/journal', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  return response;
}

export async function updateJournalEntry(id: string, entry: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const entries = JSON.parse(localStorage.getItem(`app_journal_${userId}`) || '[]');
    const index = entries.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...entry, updated_at: new Date().toISOString() };
      localStorage.setItem(`app_journal_${userId}`, JSON.stringify(entries));
      console.log('Journal entry updated locally:', entries[index]);
      return entries[index];
    }
    throw new Error('Journal entry not found');
  }
  const response = await apiRequest(`/journal/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  });
  return response;
}

export async function deleteJournalEntry(id: string) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const entries = JSON.parse(localStorage.getItem(`app_journal_${userId}`) || '[]');
    const filtered = entries.filter((e: any) => e.id !== id);
    localStorage.setItem(`app_journal_${userId}`, JSON.stringify(filtered));
    console.log('Journal entry deleted locally:', id);
    return { success: true };
  }
  const response = await apiRequest(`/journal/${id}`, {
    method: 'DELETE',
  });
  return response;
}

// ============= WEATHER API =============

export async function getWeather(lat: number, lon: number) {
  try {
    console.log(`🌤️ Fetching live weather data for coordinates: ${lat}, ${lon}`);
    
    // Call backend weather endpoint directly (public endpoint, no JWT required)
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;
    const url = `${baseUrl}/weather?lat=${lat}&lon=${lon}`;
    
    console.log('Fetching weather from backend:', url);
    
    // Make request WITHOUT Authorization header (it's a public endpoint)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Weather API returned error status:', response.status);
      
      // If we get 401, the backend is requiring auth - just use mock data silently
      if (response.status === 401) {
        console.log('⚠️ Weather endpoint requires auth, using local mock data');
        // Return mock data directly (don't throw error)
        return getMockWeatherData();
      }
      
      console.log('Weather API error:', errorText);
      throw new Error(`Weather API returned ${response.status}`);
    }
    
    const weatherData = await response.json();
    
    // Check if backend returned real or mock data
    if (weatherData.isMock) {
      console.log('⚠️ Using mock weather data (API key not configured on server)');
    } else {
      console.log('✅ Live weather data fetched successfully from OpenWeatherMap');
    }
    
    return weatherData;
  } catch (error) {
    console.log('⚠️ Weather API unavailable, using local mock data');
    
    // Return fallback mock data
    return getMockWeatherData();
  }
}

// Helper function to generate consistent mock weather data
function getMockWeatherData() {
  return {
    current: {
      temp: 28,
      humidity: 65,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind_speed: 3.5,
      clouds: 20,
      feels_like: 30,
      pressure: 1012,
      visibility: 10000,
    },
    forecast: {
      list: [
        {
          dt: Date.now() / 1000 + 86400,
          main: { temp: 29, humidity: 60 },
          weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
          wind: { speed: 3.2 },
          rain: {}
        },
        {
          dt: Date.now() / 1000 + 172800,
          main: { temp: 27, humidity: 70 },
          weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
          wind: { speed: 4.5 },
          rain: { '3h': 5 }
        },
        {
          dt: Date.now() / 1000 + 259200,
          main: { temp: 26, humidity: 75 },
          weather: [{ main: 'Rain', description: 'moderate rain', icon: '10d' }],
          wind: { speed: 5.0 },
          rain: { '3h': 10 }
        },
        {
          dt: Date.now() / 1000 + 345600,
          main: { temp: 30, humidity: 55 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
          wind: { speed: 2.8 },
          rain: {}
        },
        {
          dt: Date.now() / 1000 + 432000,
          main: { temp: 31, humidity: 50 },
          weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
          wind: { speed: 3.0 },
          rain: {}
        },
      ]
    },
    isMock: true
  };
}

// ============= FIELDS API =============

export async function getFields() {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const fields = JSON.parse(localStorage.getItem(`app_fields_${userId}`) || '[]');
    console.log('Loaded fields from localStorage:', fields.length);
    return fields;
  }
  const response = await apiRequest('/fields');
  return response.fields;
}

export async function createField(fieldData: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const fields = JSON.parse(localStorage.getItem(`app_fields_${userId}`) || '[]');
    const newField = {
      ...fieldData,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      user_id: userId,
    };
    fields.push(newField);
    localStorage.setItem(`app_fields_${userId}`, JSON.stringify(fields));
    console.log('Field created locally:', newField);
    return newField;
  }
  const response = await apiRequest('/fields', {
    method: 'POST',
    body: JSON.stringify(fieldData),
  });
  return response.field;
}

export async function updateField(fieldId: string, fieldData: any) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const fields = JSON.parse(localStorage.getItem(`app_fields_${userId}`) || '[]');
    const index = fields.findIndex((f: any) => f.id === fieldId);
    if (index !== -1) {
      fields[index] = { ...fields[index], ...fieldData, updated_at: new Date().toISOString() };
      localStorage.setItem(`app_fields_${userId}`, JSON.stringify(fields));
      console.log('Field updated locally:', fields[index]);
      return fields[index];
    }
    throw new Error('Field not found');
  }
  const response = await apiRequest(`/fields/${fieldId}`, {
    method: 'PUT',
    body: JSON.stringify(fieldData),
  });
  return response.field;
}

export async function deleteField(fieldId: string) {
  if (CLIENT_SIDE_AUTH) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const fields = JSON.parse(localStorage.getItem(`app_fields_${userId}`) || '[]');
    const filtered = fields.filter((f: any) => f.id !== fieldId);
    localStorage.setItem(`app_fields_${userId}`, JSON.stringify(filtered));
    console.log('Field deleted locally:', fieldId);
    return { success: true };
  }
  const response = await apiRequest(`/fields/${fieldId}`, {
    method: 'DELETE',
  });
  return response;
}