import crypto from 'crypto';
import bcrypt from 'bcrypt';

const secret = 'DEEP-DEEP';
const saltRounds = 10; // Number of salt rounds for bcrypt

// Generates a random salt for session tokens
export const random = (): string => crypto.randomBytes(32).toString('hex');

// Hashes the session token with a secret
export const hashSessionToken = (sessionToken: string): string => {
  return crypto.createHash('sha256').update(sessionToken).digest('hex');
};

// Password hashing using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

// Password comparison using bcrypt
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generates an HMAC hash for session token
export const generateSessionToken = (salt: string, userId: string): string => {
  return crypto.createHmac('sha256', salt + userId).update(secret).digest('hex');
};
