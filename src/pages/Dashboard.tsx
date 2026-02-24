import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Ban,
  TrendingUp,
  RefreshCw,
  Trash2,
  Play,
  RotateCcw,
  Zap,
  CheckCircle,
  Radio,
  Search,
  X,
} from "lucide-react";
import { sampleTransactions, Transaction } from "@/data/mockData";
import StatCard from "@/components/dashboard/StatCard";
import TransactionRow from "@/components/dashboard/TransactionRow";
import TransactionDetailModal from "@/components/dashboard/TransactionDetailModal";
import RiskGauge from "@/components/dashboard/RiskGauge";
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

// Random transaction generator for live feed
const merchants = ["Swiggy", "Amazon", "Flipkart", "PhonePe", "GooglePay", "Zomato", "BigBasket", "Myntra", "Paytm", "CRED", "Unknown Merchant", "Foreign Transfer", "Crypto Exchange", "QuickLoan App"];
const names = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Reddy", "Vikram Singh", "Deepak Joshi", "Meera Nair", "Rajesh Gupta", "Anita Desai", "Karan Mehta", "Pooja Verma", "Suresh Iyer"];
const locations = ["Mumbai, India", "Delhi, India", "Bangalore, India", "Hyderabad, India", "Chennai, India", "Pune, India", "Jaipur, India", "Kolkata, India", "Lagos, Nigeria", "Dubai, UAE"];
const devices = ["iPhone 15 Pro", "Samsung Galaxy S24", "OnePlus 12", "Pixel 8", "Redmi Note 13", "MacBook Pro", "Unknown Device", "Windows PC"];
const types: Transaction["type"][] = ["UPI", "Card", "NetBanking", "Wallet", "Loan"];

let txCounter = 100;

const generateRandomTx = (): Transaction => {
  txCounter++;
  const amount = Math.random() < 0.7 ? Math.floor(Math.random() * 5000) + 100 : Math.floor(Math.random() * 200000) + 10000;
  const locIdx = Math.random() < 0.85 ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 2) + 8;
  const devIdx = Math.random() < 0.8 ? Math.floor(Math.random() * 6) : Math.floor(Math.random() * 2) + 6;
  const hour = new Date().getHours();

  let score = 0;
  const factors: string[] = [];

  if (amount > 100000) { score += 30; factors.push("Very high transaction amount"); }
  else if (amount > 50000) { score += 15; factors.push("High transaction amount"); }
  if (locIdx >= 8) { score += 25; factors.push("Transaction from unfamiliar location"); }
  if (devIdx >= 6) { score += 20; factors.push("Unknown or suspicious device"); }
  if (hour >= 0 && hour <= 5) { score += 20; factors.push("Unusual transaction hour"); }
  if (Math.random() < 0.1) { score += 15; factors.push("Rapid successive transactions detected"); }

  score = Math.min(score + Math.floor(Math.random() * 10), 99);
  const riskLevel: Transaction["riskLevel"] = score < 30 ? "low" : score < 60 ? "medium" : score < 80 ? "high" : "critical";
  const status: Transaction["status"] = score < 30 ? "approved" : score < 70 ? "flagged" : "blocked";

  return {
    id: `TXN-${txCounter}`,
    userId: `USR-${200 + Math.floor(Math.random() * 50)}`,
    userName: names[Math.floor(Math.random() * names.length)],
    amount,
    type: types[Math.floor(Math.random() * types.length)],
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    location: locations[locIdx],
    device: devices[devIdx],
    timestamp: new Date().toISOString(),
    fraudScore: score,
    riskLevel,
    status,
    riskFactors: factors,
  };
};

// Simulator scoring logic
const simulateScore = (amount: number, type: string, hour: number, location: string, device: string) => {
  let score = 0;
  const factors: string[] = [];

  if (amount > 100000) { score += 35; factors.push("Very high transaction amount (>₹1,00,000)"); }
  else if (amount > 50000) { score += 20; factors.push("High transaction amount (>₹50,000)"); }
  else if (amount > 20000) { score += 10; factors.push("Above average transaction amount"); }

  if (hour >= 0 && hour <= 5) { score += 25; factors.push(`Transaction at ${hour}:00 AM — unusual hour`); }
  else if (hour >= 22 || hour <= 6) { score += 10; factors.push("Late night / early morning transaction"); }

  if (location === "international") { score += 25; factors.push("International transaction from unfamiliar location"); }
  else if (location === "new_city") { score += 10; factors.push("Transaction from a new city"); }

  if (device === "unknown") { score += 20; factors.push("Unknown device detected"); }
  else if (device === "new") { score += 8; factors.push("Recently added device"); }

  if (type === "Loan") { score += 10; factors.push("Loan application — higher scrutiny"); }
  if (type === "NetBanking" && amount > 50000) { score += 5; factors.push("High-value net banking transfer"); }

  score = Math.min(score, 99);
  const riskLevel: Transaction["riskLevel"] = score < 30 ? "low" : score < 60 ? "medium" : score < 80 ? "high" : "critical";
  const status: Transaction["status"] = score < 30 ? "approved" : score < 60 ? "flagged" : "blocked";

  return { score, riskLevel, status, factors };
};

const Dashboard = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [isLive, setIsLive] = useState(true);
  const [liveCount, setLiveCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulator state
  const [simAmount, setSimAmount] = useState("5000");
  const [simType, setSimType] = useState("UPI");
  const [simHour, setSimHour] = useState("14");
  const [simLocation, setSimLocation] = useState("domestic");
  const [simDevice, setSimDevice] = useState("known");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // Live feed
  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(() => {
        const newTx = generateRandomTx();
        setTransactions(prev => [newTx, ...prev].slice(0, 50));
        setLiveCount(c => c + 1);
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive]);

  const handleClearAll = () => {
    setTransactions([]);
    setLiveCount(0);
  };

  const handleResetAll = () => {
    setTransactions(sampleTransactions);
    setLiveCount(0);
  };

  const handleSimulate = () => {
    const amt = parseInt(simAmount) || 0;
    const h = parseInt(simHour);
    const { score, riskLevel, status, factors } = simulateScore(amt, simType, h, simLocation, simDevice);

    txCounter++;
    const locMap: Record<string, string> = { domestic: "Mumbai, India", new_city: "Kolkata, India", international: "Dubai, UAE" };
    const devMap: Record<string, string> = { known: "iPhone 15 Pro", new: "Samsung Galaxy S24", unknown: "Unknown Device" };

    const simTx: Transaction = {
      id: `SIM-${txCounter}`,
      userId: "USR-SIM",
      userName: "🧪 Simulated User",
      amount: amt,
      type: simType as Transaction["type"],
      merchant: "Simulated Merchant",
      location: locMap[simLocation] || "Mumbai, India",
      device: devMap[simDevice] || "iPhone 15 Pro",
      timestamp: new Date().toISOString(),
      fraudScore: score,
      riskLevel,
      status,
      riskFactors: factors,
    };

    setTransactions(prev => [simTx, ...prev].slice(0, 50));
  };

  // Computed stats
  const totalTx = transactions.length;
  const flaggedTx = transactions.filter(t => t.status === "flagged").length;
  const blockedTx = transactions.filter(t => t.status === "blocked").length;
  const avgScore = totalTx > 0 ? Math.round(transactions.reduce((sum, t) => sum + t.fraudScore, 0) / totalTx) : 0;

  const riskDistribution = [
    { name: "Low", value: transactions.filter(t => t.riskLevel === "low").length, color: "hsl(160, 84%, 39%)" },
    { name: "Medium", value: transactions.filter(t => t.riskLevel === "medium").length, color: "hsl(38, 92%, 50%)" },
    { name: "High", value: transactions.filter(t => t.riskLevel === "high").length, color: "hsl(0, 84%, 60%)" },
    { name: "Critical", value: transactions.filter(t => t.riskLevel === "critical").length, color: "hsl(330, 81%, 60%)" },
  ];

  // Filtered transactions
  const filteredTransactions = transactions.filter(tx => {
    if (filterRisk && tx.riskLevel !== filterRisk) return false;
    if (filterStatus && tx.status !== filterStatus) return false;
    if (filterType && tx.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!tx.userName.toLowerCase().includes(q) && !tx.id.toLowerCase().includes(q) && !tx.merchant.toLowerCase().includes(q) && !tx.location.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Build hourly data from actual transactions
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const txInHour = transactions.filter(t => new Date(t.timestamp).getHours() === i);
    return {
      hour: `${i}:00`,
      transactions: txInHour.length,
      flagged: txInHour.filter(t => t.status !== "approved").length,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            {isLive && (
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-risk-low/10 text-risk-low border border-risk-low/20">
                <Radio className="w-3 h-3 animate-pulse-glow" />
                LIVE
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time fraud monitoring • {totalTx} transactions • {liveCount} live processed
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isLive ? "bg-risk-low/10 text-risk-low border border-risk-low/20" : "bg-secondary text-muted-foreground"}`}
          >
            <Radio className="w-4 h-4" />
            {isLive ? "Live On" : "Live Off"}
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg gradient-primary text-foreground hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Transactions" value={totalTx} icon={Activity} trend={{ value: 12, positive: true }} />
        <StatCard title="Flagged" value={flaggedTx} icon={AlertTriangle} variant="medium" trend={{ value: 3, positive: false }} />
        <StatCard title="Blocked" value={blockedTx} icon={Ban} variant="high" />
        <StatCard title="Avg Risk Score" value={avgScore} subtitle="Out of 100" icon={ShieldCheck} variant={avgScore < 30 ? "low" : avgScore < 60 ? "medium" : "high"} />
      </div>

      {/* Charts + Simulator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            Transaction Volume (24h)
          </h3>
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
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 30%, 22%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 96%)" }} />
              <Area type="monotone" dataKey="transactions" stroke="hsl(217, 91%, 60%)" fill="url(#txGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="flagged" stroke="hsl(0, 84%, 60%)" fill="url(#flagGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                {riskDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {riskDistribution.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Inline Simulator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Quick Simulator</h3>
          <span className="text-xs text-muted-foreground ml-1">— Test a transaction and see it appear in the live feed</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
            <input type="number" value={simAmount} onChange={e => setSimAmount(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <select value={simType} onChange={e => setSimType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors">
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="NetBanking">Net Banking</option>
              <option value="Wallet">Wallet</option>
              <option value="Loan">Loan</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Hour ({simHour}:00)</label>
            <input type="range" min="0" max="23" value={simHour} onChange={e => setSimHour(e.target.value)} className="w-full accent-primary mt-2" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Location</label>
            <select value={simLocation} onChange={e => setSimLocation(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors">
              <option value="domestic">Domestic</option>
              <option value="new_city">New City</option>
              <option value="international">International</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Device</label>
            <select value={simDevice} onChange={e => setSimDevice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors">
              <option value="known">Known</option>
              <option value="new">New</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={handleSimulate} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg gradient-primary text-foreground hover:opacity-90 transition-opacity">
            <Play className="w-4 h-4" /> Analyze & Add to Feed
          </button>
          <button onClick={() => { setSimAmount("5000"); setSimType("UPI"); setSimHour("14"); setSimLocation("domestic"); setSimDevice("known"); }} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </motion.div>

      {/* Overall Risk Gauge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Overall System Risk</h3>
          <p className="text-xs text-muted-foreground mt-1">Based on {totalTx} transactions analyzed</p>
          <div className="mt-3 flex gap-3 text-xs flex-wrap">
            {riskDistribution.map(r => (
              <span key={r.name} className="px-2 py-1 rounded-md" style={{ backgroundColor: `${r.color.replace(')', ' / 0.1)')}`, color: r.color }}>
                {r.value} {r.name}
              </span>
            ))}
          </div>
        </div>
        <RiskGauge score={avgScore} size={140} />
      </motion.div>

      {/* Transaction List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            Recent Transactions
            {isLive && <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse-glow" />}
          </h3>
          <span className="text-xs text-muted-foreground">{filteredTransactions.length} of {transactions.length}</span>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, ID, merchant, or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Risk Level */}
            <span className="text-xs text-muted-foreground self-center mr-1">Risk:</span>
            {(["low", "medium", "high", "critical"] as const).map(level => (
              <button key={level} onClick={() => setFilterRisk(filterRisk === level ? null : level)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize transition-colors ${filterRisk === level ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary text-muted-foreground border-border hover:text-foreground"}`}>
                {level}
              </button>
            ))}
            <span className="w-px h-5 bg-border self-center mx-1" />
            {/* Status */}
            <span className="text-xs text-muted-foreground self-center mr-1">Status:</span>
            {(["approved", "flagged", "blocked"] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize transition-colors ${filterStatus === s ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary text-muted-foreground border-border hover:text-foreground"}`}>
                {s}
              </button>
            ))}
            <span className="w-px h-5 bg-border self-center mx-1" />
            {/* Type */}
            <span className="text-xs text-muted-foreground self-center mr-1">Type:</span>
            {(["UPI", "Card", "NetBanking", "Wallet", "Loan"] as const).map(t => (
              <button key={t} onClick={() => setFilterType(filterType === t ? null : t)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${filterType === t ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary text-muted-foreground border-border hover:text-foreground"}`}>
                {t}
              </button>
            ))}
            {(filterRisk || filterStatus || filterType || searchQuery) && (
              <>
                <span className="w-px h-5 bg-border self-center mx-1" />
                <button onClick={() => { setFilterRisk(null); setFilterStatus(null); setFilterType(null); setSearchQuery(""); }}
                  className="text-xs px-2.5 py-1 rounded-full border border-risk-high/30 text-risk-high font-medium hover:bg-risk-high/10 transition-colors">
                  Clear Filters
                </button>
              </>
            )}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-risk-low mx-auto mb-3 opacity-50" />
            <p className="text-foreground font-medium">{transactions.length === 0 ? "No transactions" : "No matching transactions"}</p>
            <p className="text-sm text-muted-foreground">{transactions.length === 0 ? "Use the simulator above or turn on Live feed to see transactions appear" : "Try adjusting your search or filters"}</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-thin">
            <AnimatePresence>
              {filteredTransactions.map((tx, i) => (
                <TransactionRow key={tx.id} transaction={tx} index={i} onClick={() => setSelectedTx(tx)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
};

export default Dashboard;
