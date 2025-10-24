import React from "react";
import { useOverviewViewModel } from "../../viewmodels-state/useOverviewViewModel";

export default function Overview() {
  const { stats, isLoading, fetchStats } = useOverviewViewModel();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Display quick statistics and widgets here.</p>
      
      {/* TODO: Implement dashboard widgets using stats */}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}


