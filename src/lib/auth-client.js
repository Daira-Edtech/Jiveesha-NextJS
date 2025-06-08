import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const getUser = async () => {
  try {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      if (storedUser && storedUser.name) {
        return storedUser;
      }
    }
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
  }

  try {
    const { data } = await authClient.getSession();
    if (data && data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    }
  } catch (apiError) {
    console.error("Failed to fetch user session from API:", apiError);
  }

  return null; // Return null if user data can't be retrieved from either source
};
