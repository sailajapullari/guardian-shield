import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  BarChart3,
  Shield,
  ArrowRight,
  Database,
  Cpu,
  Eye,
} from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "1. Data Collection",
    description: "The system collects transaction details: amount, time, location, device, merchant, and user history. This raw data forms the foundation for all analysis.",
    features: ["Transaction amount & type", "Timestamp & location", "Device fingerprint", "User account history"],
  },
  {
    icon: Brain,
    title: "2. ML Risk Scoring",
    description: "A Machine Learning model (Random Forest / XGBoost) processes each transaction through trained patterns. It outputs a fraud probability score from 0 (safe) to 100 (fraudulent).",
    features: ["Random Forest / XGBoost model", "Trained on historical fraud data", "Real-time inference < 50ms", "Continuous model retraining"],
  },
  {
    icon: Activity,
    title: "3. Behavioral Analysis",
    description: "The system compares the transaction against the user's established behavioral baseline. Deviations from normal patterns (spending, timing, location) increase the risk score.",
    features: ["Spending pattern tracking", "Time-of-day analysis", "Location consistency check", "Device change detection"],
  },
  {
    icon: Cpu,
    title: "4. Risk Classification",
    description: "Based on the combined ML score and behavioral analysis, each transaction is classified into Low (0-29), Medium (30-59), High (60-79), or Critical (80-100) risk levels.",
    features: ["Composite risk scoring", "Dynamic thresholds", "Multi-factor weighting", "Adaptive classification"],
  },
  {
    icon: Eye,
    title: "5. Decision & Action",
    description: "The system automatically approves low-risk transactions, flags medium/high-risk ones for review, and blocks critical-risk transactions to prevent fraud.",
    features: ["Auto-approve safe transactions", "Flag suspicious activity", "Block critical threats", "Generate detailed explanations"],
  },
  {
    icon: BarChart3,
    title: "6. Dashboard & Reporting",
    description: "All results are visualized in a real-time dashboard showing risk scores, trends, alerts, and explainable reasons for each flagged transaction.",
    features: ["Real-time monitoring", "Risk trend analysis", "Explainable AI reasons", "Alert management"],
  },
];

const HowItWorks = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">How It Works</h1>
        <p className="text-sm text-muted-foreground">
          Understanding the AI-Based Adaptive Fraud Detection pipeline — from data ingestion to actionable insights
        </p>
      </div>

      {/* Flow */}
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <step.icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {step.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center mt-4">
                <div className="w-px h-4 bg-primary/30" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Key Advantage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-6 border-primary/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Key Advantage: Adaptive Learning</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Unlike static rule-based systems, GuardianPay continuously adapts to each user's evolving behavior. 
          The ML model retrains on new data, behavioral baselines update automatically, and risk thresholds 
          adjust dynamically. This means the system catches new fraud patterns that traditional systems miss, 
          while reducing false positives on legitimate transactions.
        </p>
      </motion.div>
    </div>
  );
};

export default HowItWorks;
