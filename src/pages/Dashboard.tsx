import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Ban,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { sampleTransactions, sampleAlerts } from "@/data/mockData";
import StatCard from "@/components/dashboard/StatCard";
import TransactionRow from "@/components/dashboard/TransactionRow";
import TransactionDetailModal from "@/components/dashboard/TransactionDetailModal";
import RiskGauge from "@/components/dashboard/RiskGauge";
import { Transaction } from "@/data/mockData";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const riskDistribution = [
  { name: "Low", value: 5, color: "hsl(160, 84%, 39%)" },
  { name: "Medium", value: 2, color: "hsl(38, 92%, 50%)" },
  { name: "High", value: 2, color: "hsl(0, 84%, 60%)" },
  { name: "Critical", value: 1, color: "hsl(330, 81%, 60%)" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  transactions: Math.floor(Math.random() * 50) + 10,
  flagged: Math.floor(Math.random() * 5),
}));

const Dashboard = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState(sampleTransactions);

  const totalTx = transactions.length;
  const flaggedTx = transactions.filter((t) => t.status === "flagged").length;
  const blockedTx = transactions.filter((t) => t.status === "blocked").length;
  const avgScore = Math.round(
    transactions.reduce((sum, t) => sum + t.fraudScore, 0) / totalTx
  );

  const handleClearAll = () => {
    setTransactions([sampleTransactions[0]]);
  };

  const handleResetAll = () => {
    setTransactions(sampleTransactions);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time fraud monitoring • {totalTx} transactions today
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            <Ban className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg gradient-primary text-foreground hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          value={totalTx}
          icon={Activity}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Flagged Transactions"
          value={flaggedTx}
          icon={AlertTriangle}
          variant="medium"
          trend={{ value: 3, positive: false }}
        />
        <StatCard
          title="Blocked Transactions"
          value={blockedTx}
          icon={Ban}
          variant="high"
        />
        <StatCard
          title="Avg Risk Score"
          value={avgScore}
          subtitle="Out of 100"
          icon={ShieldCheck}
          variant={avgScore < 30 ? "low" : avgScore < 60 ? "medium" : "high"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Transaction Volume (24h)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 9%)",
                  border: "1px solid hsl(222, 30%, 22%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(210, 40%, 96%)",
                }}
              />
              <Area type="monotone" dataKey="transactions" stroke="hsl(217, 91%, 60%)" fill="url(#txGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="flagged" stroke="hsl(0, 84%, 60%)" fill="url(#flagGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                strokeWidth={0}
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Average Risk Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-5 flex items-center justify-between"
      >
        <div>
          <h3 className="text-sm font-semibold text-foreground">Overall System Risk</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {totalTx} transactions analyzed today
          </p>
          <div className="mt-3 flex gap-3 text-xs">
            <span className="px-2 py-1 rounded-md bg-risk-low/10 text-risk-low">{transactions.filter(t => t.riskLevel === "low").length} Low</span>
            <span className="px-2 py-1 rounded-md bg-risk-medium/10 text-risk-medium">{transactions.filter(t => t.riskLevel === "medium").length} Medium</span>
            <span className="px-2 py-1 rounded-md bg-risk-high/10 text-risk-high">{transactions.filter(t => t.riskLevel === "high").length} High</span>
            <span className="px-2 py-1 rounded-md bg-risk-critical/10 text-risk-critical">{transactions.filter(t => t.riskLevel === "critical").length} Critical</span>
          </div>
        </div>
        <RiskGauge score={avgScore} size={140} />
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <span className="text-xs text-muted-foreground">{transactions.length} total</span>
        </div>
        <div className="space-y-1">
          {transactions.map((tx, i) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              index={i}
              onClick={() => setSelectedTx(tx)}
            />
          ))}
        </div>
      </motion.div>

      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};

export default Dashboard;
