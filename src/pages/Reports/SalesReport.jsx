import React from "react";
import { useSalesReportViewModel } from "../../viewmodels-state/useSalesReportViewModel";

export default function SalesReport() {
  const { reportData, dateRange, isLoading, error, setDateRange, fetchSalesReport, exportReport } = useSalesReportViewModel();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Sales Report</h1>
      <p className="text-gray-600">Analytics and downloadable sales reports.</p>
      
      {/* TODO: Implement sales report charts and data using reportData */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}


