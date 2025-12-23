import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

let authToken: string | null = null;
let runtimeAnonKey: string | null = null; // Will be fetched from server

// Fetch the actual anon key from server
async function fetchRuntimeConfig() {
  try {
    console.log('Fetching runtime config from server...');
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
      }
    }
  } catch (error) {
    console.warn('Failed to fetch runtime config:', error);
  }
}

// Initialize config
fetchRuntimeConfig();

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
  
  // For auth endpoints (login/signup), use publicAnonKey
  // For other endpoints, use current user token or fallback to publicAnonKey
  const isAuthEndpoint = endpoint === '/auth/login' || endpoint === '/auth/signup';
  const tokenToUse = (isAuthEndpoint || !currentToken) ? getAnonKey() : currentToken;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenToUse}`,
    'apikey': getAnonKey(), // Use runtime anon key
    ...options.headers as Record<string, string>,
  };

  // Only log for non-session endpoints to reduce noise
  if (!endpoint.includes('/auth/session')) {
    console.log(`API Request to ${endpoint}:`, {
      hasAuthToken: !!currentToken,
      usingToken: currentToken ? 'user token' : 'public anon key',
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

export async function signup(data: {
  email: string;
  password: string;
  phone?: string;
  name: string;
  language: string;
  location: string;
}) {
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
}

export async function login(email: string, password: string) {
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
  const response = await apiRequest('/auth/logout', {
    method: 'POST',
  });
  setAuthToken(null);
  return response;
}

export async function getSession() {
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
  const response = await apiRequest('/user/profile');
  return response.profile;
}

export async function updateUserProfile(profileData: any) {
  const response = await apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return response; // Return the full response with success flag
}

// ============= TASKS API =============

export async function getTasks() {
  const response = await apiRequest('/tasks');
  return response.tasks;
}

export async function createTask(taskData: any) {
  const response = await apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
  return response.task;
}

export async function toggleTask(taskId: string, completed: boolean) {
  const response = await apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({ completed }),
  });
  return response;
}

export async function deleteTask(taskId: string) {
  const response = await apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
  return response;
}

// ============= JOURNAL API =============

export async function getJournalEntries() {
  const response = await apiRequest('/journal');
  return response.entries;
}

export async function createJournalEntry(entryData: any) {
  const response = await apiRequest('/journal', {
    method: 'POST',
    body: JSON.stringify(entryData),
  });
  return response.entry;
}

// ============= EXPENSES API =============

export async function getExpenses() {
  const response = await apiRequest('/expenses');
  return response.expenses;
}

export async function createExpense(expenseData: any) {
  const response = await apiRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
  return response.expense;
}

// ============= WEATHER API =============

export async function getWeather(lat: number, lon: number) {
  try {
    const response = await apiRequest(`/weather?lat=${lat}&lon=${lon}`);
    
    // If backend returns mock data, don't log it as an error
    if (response.isMock) {
      console.log('Using mock weather data (API key not configured or API unavailable)');
    }
    
    return response;
  } catch (error) {
    console.log('Weather API request failed, using fallback data:', error);
    // Return mock data on error
    return {
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
    };
  }
}

// ============= FIELDS API =============

export async function getFields() {
  const response = await apiRequest('/fields');
  return response.fields;
}

export async function createField(fieldData: any) {
  const response = await apiRequest('/fields', {
    method: 'POST',
    body: JSON.stringify(fieldData),
  });
  return response.field;
}

export async function updateField(fieldId: string, fieldData: any) {
  const response = await apiRequest(`/fields/${fieldId}`, {
    method: 'PUT',
    body: JSON.stringify(fieldData),
  });
  return response.field;
}

export async function deleteField(fieldId: string) {
  const response = await apiRequest(`/fields/${fieldId}`, {
    method: 'DELETE',
  });
  return response;
}