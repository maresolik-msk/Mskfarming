import React, { useState, useEffect } from 'react';
import { CircleAlert, RefreshCw, Trash2 } from 'lucide-react';

export function DebugPanel() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setAuthToken(token);
    
    // Check if token format is valid
    if (token && !token.startsWith('access_') && !token.startsWith('session_')) {
      setIsValidToken(false);
    }
  }, []);

  const handleClearSession = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hasOnboarded');
    window.location.reload();
  };

  // Only show if there's an invalid token
  if (!authToken || isValidToken) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-1">
              Session Issue Detected
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your authentication token is from an older version. Please clear your session and log in again.
            </p>
            <button
              onClick={handleClearSession}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Clear Session & Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}