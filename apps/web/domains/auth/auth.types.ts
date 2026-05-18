export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface GoogleAuthDto {
  accessToken: string;
}

export interface GoogleRegisterDto extends GoogleAuthDto {
  name: string;
  email?: string;
  phone?: string;
  googleId?: string;
  role?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
