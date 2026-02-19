import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Play, RotateCcw, AlertTriangle, CheckCircle, Ban } from "lucide-react";
import RiskGauge from "@/components/dashboard/RiskGauge";

interface SimResult {
  fraudScore: number;
  riskLevel: string;
  status: string;
  factors: string[];
}

const Simulator = () => {
  const [amount, setAmount] = useState("5000");
  const [type, setType] = useState("UPI");
  const [hour, setHour] = useState("14");
  const [location, setLocation] = useState("domestic");
  const [device, setDevice] = useState("known");
  const [result, setResult] = useState<SimResult | null>(null);

  const simulate = () => {
    let score = 0;
    const factors: string[] = [];
    const amt = parseInt(amount) || 0;

    // Amount scoring
    if (amt > 100000) { score += 35; factors.push("Very high transaction amount (>₹1,00,000)"); }
    else if (amt > 50000) { score += 20; factors.push("High transaction amount (>₹50,000)"); }
    else if (amt > 20000) { score += 10; factors.push("Above average transaction amount"); }

    // Time scoring
    const h = parseInt(hour);
    if (h >= 0 && h <= 5) { score += 25; factors.push(`Transaction at ${h}:00 AM — unusual hour`); }
    else if (h >= 22 || h <= 6) { score += 10; factors.push("Late night / early morning transaction"); }

    // Location scoring
    if (location === "international") { score += 25; factors.push("International transaction from unfamiliar location"); }
    else if (location === "new_city") { score += 10; factors.push("Transaction from a new city"); }

    // Device scoring
    if (device === "unknown") { score += 20; factors.push("Unknown device detected"); }
    else if (device === "new") { score += 8; factors.push("Recently added device"); }

    // Type scoring
    if (type === "Loan") { score += 10; factors.push("Loan application — higher scrutiny"); }
    if (type === "NetBanking" && amt > 50000) { score += 5; factors.push("High-value net banking transfer"); }

    score = Math.min(score, 99);

    const riskLevel = score < 30 ? "Low" : score < 60 ? "Medium" : score < 80 ? "High" : "Critical";
    const status = score < 30 ? "Approved" : score < 60 ? "Flagged for Review" : score < 80 ? "Flagged" : "Blocked";

    setResult({ fraudScore: score, riskLevel, status, factors });
  };

  const reset = () => {
    setAmount("5000");
    setType("UPI");
    setHour("14");
    setLocation("domestic");
    setDevice("known");
    setResult(null);
  };

  const statusIcon = result ? (
    result.fraudScore < 30 ? <CheckCircle className="w-5 h-5 text-risk-low" /> :
    result.fraudScore < 80 ? <AlertTriangle className="w-5 h-5 text-risk-medium" /> :
    <Ban className="w-5 h-5 text-risk-high" />
  ) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transaction Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Test how the ML model scores different transaction scenarios
        </p>
      </div>

      {/* Input Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Transaction Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors font-mono"
              placeholder="5000"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Transaction Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors">
              <option value="UPI">UPI</option>
              <option value="Card">Card Payment</option>
              <option value="NetBanking">Net Banking</option>
              <option value="Wallet">Digital Wallet</option>
              <option value="Loan">Loan Application</option>
            </select>
          </div>

          {/* Hour */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Time of Transaction (Hour)</label>
            <input
              type="range"
              min="0"
              max="23"
              value={hour}
              onChange={e => setHour(e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>12 AM</span>
              <span className="font-medium text-foreground">{parseInt(hour) > 12 ? `${parseInt(hour) - 12} PM` : parseInt(hour) === 0 ? "12 AM" : `${hour} AM`}</span>
              <span>11 PM</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors">
              <option value="domestic">Usual Domestic Location</option>
              <option value="new_city">New City (Domestic)</option>
              <option value="international">International Location</option>
            </select>
          </div>

          {/* Device */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Device</label>
            <select value={device} onChange={e => setDevice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors">
              <option value="known">Known Device</option>
              <option value="new">Newly Added Device</option>
              <option value="unknown">Unknown Device</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={simulate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg gradient-primary text-foreground hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" /> Analyze Transaction
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {statusIcon}
              <div>
                <h3 className="text-lg font-bold text-foreground">Analysis Result</h3>
                <p className="text-sm text-muted-foreground">Risk Level: {result.riskLevel} • Status: {result.status}</p>
              </div>
            </div>
            <RiskGauge score={result.fraudScore} size={120} />
          </div>

          {result.factors.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Detected Risk Factors:</h4>
              <div className="space-y-2">
                {result.factors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-risk-high/5 border border-risk-high/10 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-risk-high mt-0.5 flex-shrink-0" />
                    {factor}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-risk-low bg-risk-low/5 border border-risk-low/10 rounded-lg px-3 py-2">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              No risk factors detected — transaction appears safe
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Simulator;
