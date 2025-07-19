// /lib/routes.js

export const apiAuthPrefix = "/api/auth";

export const publicRoutes = [
  "/", 
  "/about", 
  "/auth/login", 
  "/auth/register",
];

export const authRoutes = [
  "/auth/login", 
  "/auth/register",
];

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
