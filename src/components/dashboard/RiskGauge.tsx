import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number;
  size?: number;
}

const getRiskColor = (score: number) => {
  if (score < 30) return { color: "hsl(160, 84%, 39%)", label: "Low Risk" };
  if (score < 60) return { color: "hsl(38, 92%, 50%)", label: "Medium Risk" };
  if (score < 80) return { color: "hsl(0, 84%, 60%)", label: "High Risk" };
  return { color: "hsl(330, 81%, 60%)", label: "Critical" };
};

const RiskGauge = ({ score, size = 120 }: RiskGaugeProps) => {
  const { color, label } = getRiskColor(score);
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        {/* Background arc */}
        <path
          d={`M 8 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none"
          stroke="hsl(222, 30%, 18%)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <motion.path
          d={`M 8 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <text
          x={size / 2}
          y={size / 2 - 5}
          textAnchor="middle"
          className="fill-foreground text-2xl font-bold"
          style={{ fontSize: size / 5 }}
        >
          {score}
        </text>
      </svg>
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  );
};

export default RiskGauge;
