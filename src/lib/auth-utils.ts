/**
 * Authentication utility functions
 * Shared validation and helper functions for authentication
 */

// Constants
export const BCRYPT_SALT_ROUNDS = 12;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 100;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email) && email.length <= 255;
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password || typeof password !== "string") {
    return {
      valid: false,
      message: "Password is required",
    };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters`,
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    };
  }

  return { valid: true };
}

/**
 * Sanitize string input by trimming whitespace
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input.trim();
}

/**
 * Validate name format
 */
export function isValidName(name: string): {
  valid: boolean;
  message?: string;
} {
  if (!name || typeof name !== "string") {
    return {
      valid: false,
      message: "Name is required",
    };
  }

  const sanitized = sanitizeInput(name);

  if (sanitized.length < MIN_NAME_LENGTH) {
    return {
      valid: false,
      message: `Name must be at least ${MIN_NAME_LENGTH} characters long`,
    };
  }

  if (sanitized.length > MAX_NAME_LENGTH) {
    return {
      valid: false,
      message: `Name must be less than ${MAX_NAME_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Safe error message for API responses
 * Prevents leaking sensitive information
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Only return safe, generic messages in production
    if (process.env.NODE_ENV === "production") {
      return "An unexpected error occurred";
    }
    return error.message;
  }
  return "An unexpected error occurred";
}
