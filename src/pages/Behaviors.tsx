import { motion } from "framer-motion";
import { sampleBehaviors } from "@/data/mockData";
import {
  User,
  MapPin,
  Smartphone,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const riskColors = {
  low: "bg-risk-low/10 text-risk-low border-risk-low/20",
  medium: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
  high: "bg-risk-high/10 text-risk-high border-risk-high/20",
};

const Behaviors = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Behavior Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Behavioral patterns and anomaly detection for monitored users
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sampleBehaviors.map((user, i) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.userName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{user.userId}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border capitalize font-medium ${riskColors[user.riskProfile]}`}>
                {user.riskProfile} risk
              </span>
            </div>

            {/* Behavior Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Avg: ₹{user.avgSpending.toLocaleString()}/day</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{user.typicalTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{user.commonLocation}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{user.usualDevice}</span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center flex-1">
                <p className="text-lg font-bold text-foreground">{user.txFrequency}</p>
                <p className="text-xs text-muted-foreground">Tx/Day</p>
              </div>
              <div className="text-center flex-1">
                <p className={`text-lg font-bold ${user.anomalyCount > 0 ? "text-risk-high" : "text-risk-low"}`}>
                  {user.anomalyCount}
                </p>
                <p className="text-xs text-muted-foreground">Anomalies</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground">Last Active</p>
                <p className="text-xs font-medium text-foreground">
                  {new Date(user.lastActive).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {user.anomalyCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-risk-high bg-risk-high/5 border border-risk-high/10 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {user.anomalyCount} behavioral anomalies detected — review recommended
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Behaviors;
