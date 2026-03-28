import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart2, Bell, ExternalLink, Activity } from "lucide-react";

const indices = [
  { name: "SENSEX", value: "73,847.15", change: "+0.42%", up: true },
  { name: "NIFTY 50", value: "22,402.40", change: "+0.38%", up: true },
  { name: "BANK NIFTY", value: "48,156.30", change: "-0.12%", up: false },
  { name: "NIFTY IT", value: "33,210.80", change: "+1.24%", up: true },
];

const topStocks = [
  { name: "Reliance Industries", ticker: "RELIANCE", price: "₹2,847", change: "+1.2%", up: true },
  { name: "TCS", ticker: "TCS", price: "₹3,920", change: "+0.8%", up: true },
  { name: "HDFC Bank", ticker: "HDFCBANK", price: "₹1,642", change: "-0.3%", up: false },
  { name: "Infosys", ticker: "INFY", price: "₹1,780", change: "+2.1%", up: true },
  { name: "ICICI Bank", ticker: "ICICIBANK", price: "₹1,089", change: "+0.5%", up: true },
  { name: "Wipro", ticker: "WIPRO", price: "₹456", change: "-0.7%", up: false },
];

const sectors = [
  { name: "IT", change: "+1.8%", up: true },
  { name: "Banking", change: "+0.4%", up: true },
  { name: "Auto", change: "-0.2%", up: false },
  { name: "Pharma", change: "+0.9%", up: true },
  { name: "FMCG", change: "+0.1%", up: true },
  { name: "Metals", change: "-1.1%", up: false },
];

export default function MarketsPage() {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" /> ET Markets
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Live market data & insights</p>
          </div>
          <a href="https://economictimes.indiatimes.com/markets" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
            Full Markets <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Indices */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {indices.map((idx, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4 shadow-card">
              <p className="text-xs font-semibold text-muted-foreground">{idx.name}</p>
              <p className="text-lg font-bold mt-1">{idx.value}</p>
              <p className={`text-sm font-semibold mt-0.5 flex items-center gap-1 ${idx.up ? "text-emerald-500" : "text-red-500"}`}>
                {idx.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {idx.change}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Sector heatmap */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" /> Sector Performance
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {sectors.map((s, i) => (
              <div key={i} className={`p-3 rounded-xl text-center ${s.up ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                <p className="text-xs font-semibold">{s.name}</p>
                <p className={`text-sm font-bold mt-1 ${s.up ? "text-emerald-500" : "text-red-500"}`}>{s.change}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top stocks */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Top Stocks</h3>
            <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
              <Bell className="w-3.5 h-3.5" /> Set Alerts
            </button>
          </div>
          <div className="divide-y divide-border">
            {topStocks.map((stock, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors">
                <div>
                  <p className="text-sm font-semibold">{stock.name}</p>
                  <p className="text-xs text-muted-foreground">{stock.ticker}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{stock.price}</p>
                  <p className={`text-xs font-semibold ${stock.up ? "text-emerald-500" : "text-red-500"}`}>{stock.change}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
