/**
 * Utility functions for TanStack Query cache management
 */

/**
 * Gets the current user ID from localStorage for use in query keys
 * This helps separate cached data by user
 * @returns {string|null} User ID or null if not available
 */
export const getCurrentUserId = () => {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).id : null;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Clears all user-specific data from localStorage
 * This should be called during logout or when switching users
 */
export const clearUserData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("childId");
    localStorage.removeItem("selectedStudent");
    localStorage.removeItem("selectedTestId");
    localStorage.removeItem("access_token");
  }
};

/**
 * Creates a user-specific query key
 * @param {Array} baseKey - The base query key array
 * @param {string|null} userId - Optional user ID, if not provided will get from localStorage
 * @returns {Array} Query key with user ID appended
 */
export const createUserQueryKey = (baseKey, userId = null) => {
  const currentUserId = userId || getCurrentUserId();
  return [...baseKey, currentUserId];
};
