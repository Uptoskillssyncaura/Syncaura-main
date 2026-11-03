/**
 * Kundan Kumar (Form Validation):
 * Please write and edit your form validation rules in this file.
 * These rules are imported and spread directly into React Hook Form's register() function.
 * 
 * Example usage:
 * <input {...register("email", validationRules.email)} />
 */

export const validationRules = {
  name: {
    required: "Full name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters"
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: "Name can only contain letters and spaces"
    }
  },
  
  email: {
    required: "Email address is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    }
  },

  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters"
    }
    // TODO (Kundan): Add password complexity validation rules here if needed
  },

  confirmPassword: (passwordWatchValue) => ({
    required: "Please confirm your password",
    validate: (value) => value === passwordWatchValue || "Passwords do not match"
  })
};
