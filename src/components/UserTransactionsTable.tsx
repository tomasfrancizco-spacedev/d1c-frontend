import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchUserTransactions, formatBalance } from "@/lib/api";
import { UserTransaction, CollegeData } from "@/types/api";
import { loadCollegesWithCache } from "@/lib/cache/colleges-cache";
import Link from "next/link";

const UserTransactionsTable = () => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [colleges, setColleges] = useState<{ [id: number]: CollegeData }>({});

  // Load colleges only when we have transactions with linked colleges
  const loadCollegesForTransactions = async (
    transactionsWithColleges: UserTransaction[]
  ) => {
    const collegeIds = transactionsWithColleges
      .filter((t) => t.linkedCollegeId !== null)
      .map((t) => t.linkedCollegeId as number);

    if (collegeIds.length === 0) return; // No need to load colleges if none are linked

    try {
      const { data, error } = await loadCollegesWithCache();
      if (data && data.length > 0) {
        const collegesMap: { [id: number]: CollegeData } = {};
        data.forEach((college: CollegeData) => {
          collegesMap[college.id] = college;
        });
        setColleges(collegesMap);
      } else if (error) {
        console.error("Error loading colleges:", error);
      }
    } catch (err) {
      console.error("Error loading colleges:", err);
    }
  };

  // Fetch user transactions
  useEffect(() => {
    const loadTransactions = async () => {
      if (!publicKey) {
        setLoading(false);
        setTransactions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch transactions using the user's public key directly
        const { data: transactionsData, error: transactionsError } =
          await fetchUserTransactions(publicKey.toString(), 10, 0);

        if (transactionsError) {
          setError(transactionsError);
          setTransactions([]);
        } else if (transactionsData?.transactions) {
          setTransactions(transactionsData.transactions);
          // Only load colleges if we have transactions with linked colleges
          await loadCollegesForTransactions(transactionsData.transactions);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError("Failed to load transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [publicKey]);

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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-center text-center gap-3 mb-12">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
          My Latest Transactions
        </h3>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 max-h-[500px] overflow-y-auto scrollbar-custom">
        <table className="min-w-full table-fixed text-left text-sm text-white/90">
          <thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold min-w-[80px]">
                Signature
              </th>
              <th className="px-4 py-3 text-xs font-semibold min-w-[160px]">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-semibold min-w-[100px]">
                Amount
              </th>
              <th className="px-4 py-3 text-xs font-semibold min-w-[140px]">
                To Address
              </th>
              <th className="px-4 py-3 text-xs font-semibold min-w-[140px]">
                Linked School
              </th>
              <th className="px-4 py-3 text-xs font-semibold min-w-[120px]">
                Amount To School
              </th>
              <th className="px-4 py-3 text-xs font-semibold min-w-[200px]">
                D1C Fee
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="odd:bg-white/0 even:bg-white/[0.03] border-b border-white/5"
                >
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                    <Link
                      href={`https://solscan.io/tx/${transaction.signature}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {transaction.signature.slice(0, 8)}...
                      {transaction.signature.slice(-8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatBalance(transaction.amount)}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                    <Link
                      href={`https://solscan.io/address/${transaction.to}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {transaction.to.slice(0, 8)}...{transaction.to.slice(-8)}
                    </Link>
                  </td>



                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                    {transaction.linkedCollegeId
                      ? colleges[transaction.linkedCollegeId]?.nickname ||
                        "Unknown School"
                      : "No school linked"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                    {transaction.linkedCollegeId &&
                    colleges[transaction.linkedCollegeId]
                      ? formatBalance(parseFloat(transaction.amount) * 0.02)
                      : "0 $D1C"}
                  </td>
                  
                  <td className="px-4 py-3 max-w-[200px] truncate text-xs">
                    {formatBalance(parseFloat(transaction.amount) * 0.01)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/50">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTransactionsTable;
