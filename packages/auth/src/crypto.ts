import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password securely using bcrypt
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Compares a plaintext password against a bcrypt hash
 */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP
 */
export function generateNumericOtp(): string {
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

/**
 * Hashes an OTP or Token using SHA-256
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
