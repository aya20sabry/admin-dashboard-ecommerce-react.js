import React from "react";
import { useTransactionViewModel } from "../../viewmodels-state/useTransactionViewModel";

export default function Transaction() {
  const { transactions, page, limit, filter, isLoading, error, setPage, setLimit, setFilter, fetchTransactions } = useTransactionViewModel();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Transaction</h1>
      <p className="text-gray-600">Recent transactions and status.</p>
      
      {/* TODO: Implement transactions table using transactions state */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

