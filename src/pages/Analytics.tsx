import { motion } from "framer-motion";
import { sampleTransactions } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(222, 47%, 9%)",
  border: "1px solid hsl(222, 30%, 22%)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(210, 40%, 96%)",
};

const typeData = [
  { type: "UPI", count: 3, color: "hsl(217, 91%, 60%)" },
  { type: "Card", count: 2, color: "hsl(160, 84%, 39%)" },
  { type: "NetBanking", count: 3, color: "hsl(38, 92%, 50%)" },
  { type: "Wallet", count: 1, color: "hsl(262, 83%, 58%)" },
  { type: "Loan", count: 1, color: "hsl(0, 84%, 60%)" },
];

const scoreDistribution = [
  { range: "0-20", count: 4 },
  { range: "21-40", count: 1 },
  { range: "41-60", count: 0 },
  { range: "61-80", count: 2 },
  { range: "81-100", count: 3 },
];

const hourlyPattern = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  risk: h >= 0 && h <= 5 ? Math.floor(Math.random() * 30) + 50 : Math.floor(Math.random() * 20) + 5,
}));

const radarData = [
  { feature: "Amount", value: 75 },
  { feature: "Time", value: 60 },
  { feature: "Location", value: 85 },
  { feature: "Device", value: 45 },
  { feature: "Frequency", value: 30 },
  { feature: "History", value: 55 },
];

const Analytics = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Advanced fraud pattern analysis and risk insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fraud Score Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Fraud Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {scoreDistribution.map((_, i) => (
                  <Cell key={i} fill={["hsl(160, 84%, 39%)", "hsl(160, 84%, 39%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(330, 81%, 60%)"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Transaction Types */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Transaction Types</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count" strokeWidth={0}>
                {typeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {typeData.map(item => (
              <div key={item.type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.type}: {item.count}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hourly Risk Pattern */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Hourly Risk Pattern</h3>
          <p className="text-xs text-muted-foreground mb-3">Higher risk detected during midnight-5 AM window</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="risk" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Factor Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Factor Weight Analysis</h3>
          <p className="text-xs text-muted-foreground mb-3">Relative importance of each feature in fraud detection</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222, 30%, 18%)" />
              <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <Radar dataKey="value" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
