import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Shield, RefreshCw } from "lucide-react";
import { sampleAlerts } from "@/data/mockData";

const severityStyles = {
  warning: { bg: "bg-risk-medium/10", border: "border-risk-medium/20", text: "text-risk-medium", icon: AlertTriangle },
  danger: { bg: "bg-risk-high/10", border: "border-risk-high/20", text: "text-risk-high", icon: XCircle },
  critical: { bg: "bg-risk-critical/10", border: "border-risk-critical/20", text: "text-risk-critical", icon: Shield },
};

const Alerts = () => {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? alerts : filter === "resolved" ? alerts.filter(a => a.resolved) : alerts.filter(a => a.severity === filter);

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const handleClearAll = () => {
    setAlerts([]);
  };

  const handleReset = () => {
    setAlerts(sampleAlerts);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground">{alerts.filter(a => !a.resolved).length} unresolved alerts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors">
            Clear All
          </button>
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg gradient-primary text-foreground hover:opacity-90 transition-opacity">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "critical", "danger", "warning", "resolved"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${filter === f ? "gradient-primary text-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <CheckCircle className="w-12 h-12 text-risk-low mx-auto mb-3" />
            <p className="text-foreground font-medium">No alerts to show</p>
            <p className="text-sm text-muted-foreground">All clear or use Reset to reload sample data</p>
          </div>
        )}
        {filtered.map((alert, i) => {
          const style = severityStyles[alert.severity];
          const Icon = style.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 border ${alert.resolved ? "border-glass-border opacity-60" : style.border}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                  <Icon className={`w-5 h-5 ${style.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{alert.message}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${style.bg} ${style.text}`}>{alert.severity}</span>
                    {alert.resolved && <span className="text-xs px-2 py-0.5 rounded-full bg-risk-low/10 text-risk-low">Resolved</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.reason}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground font-mono">{alert.transactionId}</span>
                    <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-risk-low/10 text-risk-low hover:bg-risk-low/20 transition-colors flex-shrink-0"
                  >
                    <CheckCircle className="w-3 h-3" /> Resolve
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;
