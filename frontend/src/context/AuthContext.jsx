import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          // Set axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Restore auth state
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { ...user, token }
          });
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      // Handle successful response
      if (res.data?.success && res.data?.data) {
        const userData = res.data.data;
        const token = userData.token;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: userData
        });
        
        return userData;
      } else {
        throw new Error(res.data?.message || 'Login failed');
      }
    } catch (error) {
      // Handle API error responses
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please try again.');
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      // Handle successful response
      if (res.data?.success && res.data?.data) {
        const userInfo = res.data.data;
        const token = userInfo.token;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: userInfo
        });
        
        return userInfo;
      } else {
        throw new Error(res.data?.message || 'Registration failed');
      }
    } catch (error) {
      // Handle API error responses
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please try again.');
      }
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};