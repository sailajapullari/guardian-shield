import { Transaction } from "@/data/mockData";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface TransactionRowProps {
  transaction: Transaction;
  index: number;
  onClick?: () => void;
}

const riskBadge = {
  low: "bg-risk-low/10 text-risk-low border-risk-low/20",
  medium: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
  high: "bg-risk-high/10 text-risk-high border-risk-high/20",
  critical: "bg-risk-critical/10 text-risk-critical border-risk-critical/20",
};

const statusBadge = {
  approved: "bg-risk-low/10 text-risk-low",
  flagged: "bg-risk-medium/10 text-risk-medium",
  blocked: "bg-risk-high/10 text-risk-high",
};

const TransactionRow = ({ transaction: tx, index, onClick }: TransactionRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
    >
      {/* Fraud Score */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border ${riskBadge[tx.riskLevel]}`}>
        {tx.fraudScore}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{tx.userName}</span>
          <span className="text-xs text-muted-foreground font-mono">{tx.id}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{tx.merchant}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{tx.location}</span>
        </div>
      </div>

      {/* Type */}
      <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
        {tx.type}
      </span>

      {/* Amount */}
      <span className="text-sm font-semibold text-foreground w-24 text-right font-mono">
        ₹{tx.amount.toLocaleString()}
      </span>

      {/* Status */}
      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusBadge[tx.status]}`}>
        {tx.status}
      </span>

      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default TransactionRow;
