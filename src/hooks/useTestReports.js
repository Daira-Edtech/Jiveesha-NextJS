"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTestReports = (childId) => {
  return useQuery({
    queryKey: ["testReports", childId],
    queryFn: async () => {
      if (!childId) {
        throw new Error("Child ID is required");
      }

      const response = await axios.get(`/api/test-reports/${childId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch test reports");
      }

      return response.data;
    },
    enabled: !!childId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook for getting filtered test data
export const useFilteredTests = (allTests, currentView) => {
  if (!allTests) return [];

  switch (currentView) {
    case "continuous":
      return allTests.filter((test) => test.type === "continuous");
    case "individual":
      return allTests.filter((test) => test.type !== "continuous");
    default:
      return allTests;
  }
};
