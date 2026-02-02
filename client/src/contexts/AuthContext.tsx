import {
  createContext,
  createSignal,
  type JSX,
  onMount,
  useContext,
} from 'solid-js';
import * as authApi from '../api/auth';
import type { User } from '../types';

interface AuthContextValue {
  user: () => User | null;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isLoading: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>();

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  const isAuthenticated = () => user() !== null;
  const isAdmin = () => user()?.role === 'admin';

  const checkAuth = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (_error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authApi.register({ email, password, name });
    setUser(response.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  onMount(() => {
    checkAuth();
  });

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
