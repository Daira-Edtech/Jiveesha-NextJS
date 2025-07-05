import { useQuery } from "@tanstack/react-query";
import { getCurrentUserId, createUserQueryKey } from "@/lib/cache-utils";

export const useDashboardData = (students = []) => {
  const userId = getCurrentUserId();

  return useQuery({
    queryKey: createUserQueryKey([
      "dashboardData",
      students.map((s) => s.id).sort(),
    ]),
    queryFn: async () => {
      if (!students || students.length === 0) {
        return {
          totalScoresByChild: {},
          highestScore: 0,
          averageScore: 0,
          performanceData: [],
          testCount: 0,
          recentTests: [],
        };
      }
      const res = await fetch("/api/dashboard-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard summary");
      return await res.json();
    },
    enabled: students.length > 0 && !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
