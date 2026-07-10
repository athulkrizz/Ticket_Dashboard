export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface AuthUser {
  username: string;
  displayName: string;
  role: 'admin' | 'agent';
  avatar: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}
