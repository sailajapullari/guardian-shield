import { useState } from "react";
import { format } from "date-fns";
import { ArrowUpDown, History } from "lucide-react";
import { fetchPaymentHistory, PaymentHistoryItem } from "@/lib/payments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

type SortKey =
  | "created_at"
  | "amount"
  | "time_spent"
  | "transaction_frequency";

type SortDirection = "asc" | "desc";

const TransactionHistory = () => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const sortedData = [...data].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortKey) {
      case "amount":
        return (a.amount - b.amount) * dir;
      case "time_spent":
        return ((a.time_spent || 0) - (b.time_spent || 0)) * dir;
      case "transaction_frequency":
        return (a.transaction_frequency - b.transaction_frequency) * dir;
      case "created_at":
      default:
        return (
          (new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()) * dir
        );
    }
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const loadHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email to view history.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const items = await fetchPaymentHistory(email);
      setData(items);
    } catch (error: any) {
      toast({
        title: "Failed to load history",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="w-6 h-6" />
            Transaction History
          </h1>
          <p className="text-sm text-muted-foreground">
            View detailed analytics of your past payments.
          </p>
        </div>
      </div>

      <form
        onSubmit={loadHistory}
        className="glass-card p-4 flex flex-col md:flex-row gap-3 items-start md:items-end"
      >
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Loading..." : "Load History"}
        </button>
      </form>

      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[90px]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    onClick={() => toggleSort("amount")}
                  >
                    Amount (₹) <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="min-w-[120px]">Spending Range</TableHead>
                <TableHead className="min-w-[140px]">Location</TableHead>
                <TableHead className="min-w-[120px]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    onClick={() => toggleSort("time_spent")}
                  >
                    Time Spent (s) <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="min-w-[130px]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    onClick={() => toggleSort("transaction_frequency")}
                  >
                    Txn Count (24h) <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="min-w-[160px]">Device Used</TableHead>
                <TableHead className="min-w-[160px]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    onClick={() => toggleSort("created_at")}
                  >
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="min-w-[90px] text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-sm text-muted-foreground py-8"
                  >
                    {email
                      ? "No transactions found for this email."
                      : "Enter an email and load history to see transactions."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((item) => (
                  <TableRow key={item.order_id}>
                    <TableCell className="font-mono text-xs">
                      {item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.spending_range || "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.location || "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.time_spent != null
                        ? item.time_spent.toFixed(1)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.transaction_frequency}
                    </TableCell>
                    <TableCell className="text-xs max-w-[220px] truncate">
                      {item.device_used || "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(item.created_at), "dd MMM yyyy, HH:mm")}
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 border text-[10px] font-semibold ${
                          item.status === "paid"
                            ? "border-emerald-500 text-emerald-500 bg-emerald-500/10"
                            : item.status === "failed"
                            ? "border-red-500 text-red-500 bg-red-500/10"
                            : "border-amber-500 text-amber-500 bg-amber-500/10"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;

