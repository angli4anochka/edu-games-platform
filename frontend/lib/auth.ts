// Authentication utility functions

const USER_KEY = 'current_user';
const USERS_KEY = 'registered_users';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  createdAt: string;
  subscription?: 'free' | 'premium' | 'school';
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'teacher' | 'student';
}

export interface LoginData {
  email: string;
  password: string;
}

// Get all registered users
function getRegisteredUsers(): Record<string, { user: User; passwordHash: string }> {
  if (typeof window === 'undefined') return {};
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
}

// Save registered users
function saveRegisteredUsers(users: Record<string, { user: User; passwordHash: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simple password hashing (in production, use bcrypt or similar on backend)
function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use proper hashing on the backend
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Register a new user
export function register(data: RegisterData): { success: boolean; error?: string; user?: User } {
  const { email, password, name, role } = data;

  // Validation
  if (!email || !password || !name || !role) {
    return { success: false, error: 'Все поля обязательны для заполнения' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Неверный формат email' };
  }

  // Check if user already exists
  const users = getRegisteredUsers();
  if (users[email]) {
    return { success: false, error: 'Пользователь с таким email уже существует' };
  }

  // Create new user
  const user: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
    createdAt: new Date().toISOString(),
    subscription: 'free',
  };

  // Save user
  users[email] = {
    user,
    passwordHash: hashPassword(password),
  };
  saveRegisteredUsers(users);

  // Auto-login after registration
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { success: true, user };
}

// Login user
export function login(data: LoginData): { success: boolean; error?: string; user?: User } {
  const { email, password } = data;

  // Validation
  if (!email || !password) {
    return { success: false, error: 'Email и пароль обязательны' };
  }

  // Check if user exists
  const users = getRegisteredUsers();
  const userRecord = users[email];

  if (!userRecord) {
    return { success: false, error: 'Неверный email или пароль' };
  }

  // Check password
  const passwordHash = hashPassword(password);
  if (userRecord.passwordHash !== passwordHash) {
    return { success: false, error: 'Неверный email или пароль' };
  }

  // Save current user
  localStorage.setItem(USER_KEY, JSON.stringify(userRecord.user));

  return { success: true, user: userRecord.user };
}

// Logout user
export function logout(): void {
  localStorage.removeItem(USER_KEY);
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Update user data
export function updateUser(updates: Partial<User>): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const users = getRegisteredUsers();
  const userRecord = users[currentUser.email];

  if (!userRecord) return false;

  const updatedUser = { ...userRecord.user, ...updates };
  userRecord.user = updatedUser;
  users[currentUser.email] = userRecord;

  saveRegisteredUsers(users);
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

  return true;
}
