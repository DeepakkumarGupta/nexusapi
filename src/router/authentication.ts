import express from 'express';
import { register, login, logout } from '../controllers/authentication';
import rateLimit from 'express-rate-limit';

// Rate limiter for registration
const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registration attempts per 15 minutes
  message: 'Too many registration attempts, please try again later.',
});

// Rate limiter for login
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
});

export default (router: express.Router) => {
  // Registration route with rate limiter
  router.post('/auth/register', registerRateLimiter, register);
  router.post('/auth/admin/login', loginRateLimiter, login)
  // Login route with rate limiter
  router.post('/auth/login', loginRateLimiter, login);
  router.post('/auth/logout', logout)
};

