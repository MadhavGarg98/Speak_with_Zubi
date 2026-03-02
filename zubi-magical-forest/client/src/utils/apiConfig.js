// API configuration utility
export const API_BASE_URL = import.meta.env.VITE_API_URL || __API_URL__ || 'http://localhost:3001';

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Export for debugging
export const getApiConfig = () => {
  return {
    baseUrl: API_BASE_URL,
    envVar: import.meta.env.VITE_API_URL,
    definedVar: __API_URL__,
  };
};
