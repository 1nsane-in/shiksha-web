export class AuthService {
  private static API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Google login
  static async googleLogin(accessToken: string) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google login failed');
      }

      const data = await response.json();
      
      // Store JWT token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  // Google registration
  static async googleRegister(accessToken: string, userData: any) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/google-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          accessToken
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google registration failed');
      }

      const data = await response.json();
      
      // Store JWT token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Google registration error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  }

  // Get token
  static getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // Logout
  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    window.location.href = '/login';
  }
}
