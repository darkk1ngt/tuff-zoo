export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  return { valid: true };
}

export function validateRequired(
  value: string,
  fieldName: string,
): ValidationResult {
  if (!value || !value.trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
}

export function validatePositiveNumber(
  value: number,
  fieldName: string,
): ValidationResult {
  if (value <= 0) {
    return { valid: false, message: `${fieldName} must be greater than 0` };
  }
  return { valid: true };
}

export function validateDateRange(
  checkIn: string,
  checkOut: string,
): ValidationResult {
  if (!checkIn || !checkOut) {
    return {
      valid: false,
      message: 'Both check-in and check-out dates are required',
    };
  }
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { valid: false, message: 'Check-in date cannot be in the past' };
  }
  if (end <= start) {
    return {
      valid: false,
      message: 'Check-out date must be after check-in date',
    };
  }
  return { valid: true };
}
