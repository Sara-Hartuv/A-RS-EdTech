// src/api/auth.api.ts
import { api } from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth";
import type { User } from "../types/user";

export const login = (credentials: LoginRequest) => {
  return api.post<LoginResponse>('/auth/login', credentials);
};

export const logout = () => {
  return api.post('/auth/logout');
};

export const getCurrentUser = () => {
  return api.get<User>('/users/me');
};

export const register = (userData: Partial<User> & { password: string }) => {
  return api.post<LoginResponse>('/auth/register', userData);
};
