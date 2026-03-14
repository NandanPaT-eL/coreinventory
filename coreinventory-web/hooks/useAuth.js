import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';
import apiClient from '../lib/api-client';

// Helper to set cookie
function setTokenCookie(token) {
  if (typeof document !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict`; // 7 days
  }
}

function removeTokenCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('📤 Sending login request for:', email);
      
      const response = await apiClient.post('/auth/signin', { 
        email, 
        password 
      });
      
      console.log('📥 Response data:', response.data);
      
      if (response.data && response.data.success === true) {
        const { user, token } = response.data.data;
        
        console.log('✅ Login successful for user:', user.name);
        
        // Store in Zustand
        setAuth(user, token);
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set cookie for middleware
        setTokenCookie(token);
        
        console.log('➡️ Redirecting to dashboard...');
        
        // Force a hard navigation to ensure middleware picks up the cookie
        window.location.href = '/dashboard';
        
        return { success: true };
      } else {
        console.error('❌ Login failed:', response.data?.message);
        return { 
          success: false, 
          error: response.data?.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      console.log('📤 Sending signup request for:', userData.email);
      
      const response = await apiClient.post('/auth/signup', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'manager'
      });
      
      console.log('📥 Signup response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Signup successful, redirecting to login');
        router.push('/auth/login?registered=true');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    removeTokenCookie();
    clearAuth();
    window.location.href = '/auth/login';
  };

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return null;
      }
      
      console.log('📤 Fetching current user...');
      const response = await apiClient.get('/auth/me');
      console.log('📥 User data response:', response.data);
      
      if (response.data.success) {
        return response.data.data.user;
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    getCurrentUser,
  };
}

export default useAuth;
