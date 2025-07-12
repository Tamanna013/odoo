// services/logger.js
export const logError = (error, errorInfo) => {
  console.error('Error:', error, errorInfo);
  // Send to error tracking service (Sentry, etc.)
};