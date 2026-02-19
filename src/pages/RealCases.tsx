import { motion } from "framer-motion";
import { realWorldCases } from "@/data/mockData";
import {
  Smartphone,
  Key,
  FileWarning,
  ShieldAlert,
  Store,
  AlertTriangle,
  Search,
  Shield,
} from "lucide-react";

const iconMap: Record<string, any> = {
  smartphone: Smartphone,
  key: Key,
  "file-warning": FileWarning,
  "shield-alert": ShieldAlert,
  store: Store,
};

const RealCases = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Real-World Fraud Cases</h1>
        <p className="text-sm text-muted-foreground">
          Common fraud patterns in Indian digital payments — and how our system detects them
        </p>
      </div>

      <div className="space-y-4">
        {realWorldCases.map((caseItem, i) => {
          const Icon = iconMap[caseItem.icon] || Shield;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-risk-high/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-risk-high" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-bold text-foreground">{caseItem.title}</h3>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-risk-high/10 text-risk-high border border-risk-high/20">
                        Impact: {caseItem.impact}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-risk-medium/10 text-risk-medium border border-risk-medium/20">
                        Freq: {caseItem.frequency}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{caseItem.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-risk-medium" />
                        <span className="text-xs font-semibold text-foreground">How It Happens</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{caseItem.how}</p>
                    </div>
                    <div className="bg-risk-low/5 border border-risk-low/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Search className="w-3.5 h-3.5 text-risk-low" />
                        <span className="text-xs font-semibold text-foreground">How We Detect It</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{caseItem.detection}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RealCases;
