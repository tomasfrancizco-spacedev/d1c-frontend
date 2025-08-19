"use client";
import React, { useMemo, useState, useEffect } from "react";
import { FeeJobLog } from "@/types/api";
import {
  fetchFeeJobLogs,
  fetchTotalFees,
  fetchUnharvestedTransactionsCount,
  fetchUndistributedTransactionsCount,
  triggerAutomatedProcessing,
} from "@/lib/api";

export default function FeeManagement() {
  const [jobLogs, setJobLogs] = useState<FeeJobLog[]>([]);
  const [totalFees, setTotalFees] = useState<number>(0);
  const [unharvestedCount, setUnharvestedCount] = useState<number>(0);
  const [undistributedCount, setUndistributedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Load all fee management data
  const loadFeeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [logsResponse, feesResponse, unharvestedResponse, undistributedResponse] = 
        await Promise.all([
          fetchFeeJobLogs(10),
          fetchTotalFees(),
          fetchUnharvestedTransactionsCount(),
          fetchUndistributedTransactionsCount(),
        ]);

      // Handle job logs
      if (logsResponse.error) {
        setError(logsResponse.error);
      } else if (logsResponse.data?.data) {
        setJobLogs(logsResponse.data.data);
      }

      // Handle total fees
      if (feesResponse.data?.data) {
        setTotalFees(feesResponse.data.data.totalFees);
      }

      // Handle unharvested count
      if (unharvestedResponse.data?.data) {
        setUnharvestedCount(unharvestedResponse.data.data.count);
      }

      // Handle undistributed count
      if (undistributedResponse.data?.data) {
        setUndistributedCount(undistributedResponse.data.data.count);
      }
    } catch (err) {
      setError("Failed to load fee management data");
      console.error("Error loading fee data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeData();
  }, []);

  // Handle triggering automated processing
  const handleTriggerProcessing = async () => {
    setProcessing(true);
    try {
      const { data, error } = await triggerAutomatedProcessing();
      
      if (error) {
        console.error('Failed to trigger processing:', error);
        alert('Failed to trigger automated processing. Please try again.');
      } else if (data?.data) {
        const { harvestResult, distributionResult } = data.data;
        
        // Show success message with details
        let message = 'Automated processing completed successfully!\n\n';
        message += `Harvest: ${harvestResult.success ? 'Success' : 'Failed'}\n`;
        message += `- Transactions processed: ${harvestResult.transactionsProcessed}\n`;
        message += `- Total fees harvested: ${harvestResult.totalFeesHarvested}\n\n`;
        message += `Distribution: ${distributionResult.success ? 'Success' : 'Failed'}\n`;
        message += `- Transactions processed: ${distributionResult.transactionsProcessed}\n`;
        message += `- College amount: ${distributionResult.collegeAmount}\n`;
        message += `- Burned amount: ${distributionResult.burnedAmount}\n`;
        
        if (distributionResult.signatures.length > 0) {
          message += `- Signatures: ${distributionResult.signatures.length}`;
        }
        
        alert(message);
        
        // Reload data after successful processing
        await loadFeeData();
      }
    } catch (err) {
      console.error('Error triggering processing:', err);
      alert('Failed to trigger automated processing. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const sortedJobLogs = useMemo(
    () => jobLogs.slice().sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()),
    [jobLogs]
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#03211e] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8">
        <div className="text-center text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Fee Management</h3>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Fees Available For Distribution</div>
          <div className="text-2xl font-bold text-white">{totalFees.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Unharvested Transactions</div>
          <div className="text-2xl font-bold text-orange-400">{unharvestedCount}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Undistributed Transactions</div>
          <div className="text-2xl font-bold text-yellow-400">{undistributedCount}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center justify-center">
          <button
            onClick={handleTriggerProcessing}
            disabled={processing}
            className="cursor-pointer w-full px-4 py-2 rounded-md bg-[#15C0B9] text-white hover:bg-[#15C0B9]/80 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {processing ? 'Processing...' : 'Trigger Processing'}
          </button>
        </div>
      </div>

      {/* Job Logs Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Recent Job Logs</h3>
          <button
            onClick={loadFeeData}
            className="cursor-pointer px-3 py-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors outline-none focus:ring-2 focus:ring-[#15C0B9] text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 max-h-[500px] overflow-y-auto scrollbar-custom">
          <table className="min-w-full table-fixed text-left text-sm text-white/90">
            <thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold min-w-[80px]">ID</th>
                <th className="px-4 py-3 text-xs font-semibold min-w-[160px]">Executed At</th>
                <th className="px-4 py-3 text-xs font-semibold min-w-[100px]">Status</th>
                <th className="px-4 py-3 text-xs font-semibold min-w-[140px]">Harvested Amount</th>
                <th className="px-4 py-3 text-xs font-semibold min-w-[140px]">Distributed Amount</th>
                <th className="px-4 py-3 text-xs font-semibold min-w-[120px]">Burned Amount</th>
                <th className="px-4 py-3 text-xs font-semibold min-w-[200px]">Error Message</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobLogs.length > 0 ? (
                sortedJobLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="odd:bg-white/0 even:bg-white/[0.03] border-b border-white/5"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{log.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {new Date(log.executedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.success
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                      {parseFloat(log.harvestedAmount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                      {parseFloat(log.distributedAmount).toFixed(8)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                      {parseFloat(log.burnedAmount).toFixed(8)}
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-xs">
                      {log.errorMessage || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-white/50">
                    No job logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
