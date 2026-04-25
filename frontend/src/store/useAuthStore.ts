import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  email: string;
  role: 'owner' | 'vet';
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem('pettrack_token');
  let initialUser: UserData | null = null;

  if (storedToken) {
    try {
      const decoded: any = jwtDecode(storedToken);
      // Ensure token is not expired
      if (decoded.exp * 1000 > Date.now()) {
        initialUser = {
          email: decoded.sub,
          role: decoded.role,
        };
      } else {
        localStorage.removeItem('pettrack_token');
      }
    } catch (error) {
      localStorage.removeItem('pettrack_token');
    }
  }

  return {
    token: initialUser ? storedToken : null,
    user: initialUser,
    isAuthenticated: !!initialUser,

    login: (token: string) => {
      localStorage.setItem('pettrack_token', token);
      try {
        const decoded: any = jwtDecode(token);
        set({
          token,
          user: { email: decoded.sub, role: decoded.role },
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Invalid token format");
      }
    },

    logout: () => {
      localStorage.removeItem('pettrack_token');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});
