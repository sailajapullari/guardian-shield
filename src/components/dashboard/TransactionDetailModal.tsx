import { Transaction } from "@/data/mockData";
import RiskGauge from "./RiskGauge";
import { X, MapPin, Smartphone, Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionDetailModal = ({ transaction, onClose }: TransactionDetailModalProps) => {
  if (!transaction) return null;

  const tx = transaction;
  const time = new Date(tx.timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-lg p-6 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">{tx.userName}</h3>
              <p className="text-sm text-muted-foreground font-mono">{tx.id}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Gauge */}
          <div className="flex items-center justify-center py-2">
            <RiskGauge score={tx.fraudScore} size={160} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="text-lg font-bold text-foreground font-mono">₹{tx.amount.toLocaleString()}</p>
            </div>
            <div className="glass-card p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="text-lg font-bold text-foreground">{tx.type}</p>
            </div>
            <div className="glass-card p-3 rounded-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">{tx.location}</p>
              </div>
            </div>
            <div className="glass-card p-3 rounded-lg flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Device</p>
                <p className="text-sm font-medium text-foreground">{tx.device}</p>
              </div>
            </div>
            <div className="glass-card p-3 rounded-lg flex items-center gap-2 col-span-2">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-foreground">{time}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          {tx.riskFactors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-risk-high" />
                Risk Factors
              </h4>
              <div className="space-y-2">
                {tx.riskFactors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-risk-high/5 border border-risk-high/10 rounded-lg px-3 py-2">
                    <span className="text-risk-high mt-0.5">•</span>
                    {factor}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionDetailModal;
