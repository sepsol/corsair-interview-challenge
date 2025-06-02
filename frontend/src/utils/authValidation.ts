/**
 * Authentication validation utilities
 * Contains reusable validation logic for authentication forms
 */

/**
 * Validation rules for authentication
 */
export const AUTH_VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
} as const;

/**
 * Validate username according to application rules
 * @param username - The username to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < AUTH_VALIDATION.USERNAME.MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Username must be at least ${AUTH_VALIDATION.USERNAME.MIN_LENGTH} characters long` 
    };
  }

  if (username.length > AUTH_VALIDATION.USERNAME.MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Username must be no more than ${AUTH_VALIDATION.USERNAME.MAX_LENGTH} characters long` 
    };
  }

  // Check for valid characters (alphanumeric and underscore)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { 
      isValid: false, 
      error: 'Username can only contain letters, numbers, and underscores' 
    };
  }

  return { isValid: true };
}

/**
 * Validate password according to application rules
 * @param password - The password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < AUTH_VALIDATION.PASSWORD.MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${AUTH_VALIDATION.PASSWORD.MIN_LENGTH} characters long` 
    };
  }

  if (password.length > AUTH_VALIDATION.PASSWORD.MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be no more than ${AUTH_VALIDATION.PASSWORD.MAX_LENGTH} characters long` 
    };
  }

  return { isValid: true };
}

/**
 * Validate both username and password
 * @param username - The username to validate
 * @param password - The password to validate
 * @returns Object with isValid boolean and errors object if invalid
 */
export function validateAuthCredentials(
  username: string, 
  password: string
): { 
  isValid: boolean; 
  errors: { username?: string; password?: string } 
} {
  const usernameValidation = validateUsername(username);
  const passwordValidation = validatePassword(password);

  const errors: { username?: string; password?: string } = {};
  
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
  }
  
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: usernameValidation.isValid && passwordValidation.isValid,
    errors,
  };
}