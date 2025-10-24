import { useState } from "react";

export const useOverviewViewModel = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement API calls to fetch dashboard statistics
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Example API call
      // const data = await overviewApi.getStats();
      // setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    fetchStats,
  };
};


