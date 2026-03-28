import { motion } from "framer-motion";
import { Target, Play, Clock, Users, Star, ExternalLink } from "lucide-react";

const courses = [
  { title: "Portfolio Building from Scratch", instructor: "Prashant Jain, HDFC AMC", duration: "4h 30m", students: "12,400", rating: 4.8, level: "Beginner", tag: "BESTSELLER" },
  { title: "Technical Analysis Masterclass", instructor: "Sudarshan Sukhani", duration: "6h 15m", students: "8,200", rating: 4.7, level: "Intermediate", tag: "NEW" },
  { title: "Mutual Fund Selection Strategy", instructor: "Dhirendra Kumar, Value Research", duration: "3h 45m", students: "15,600", rating: 4.9, level: "Beginner", tag: "TOP RATED" },
  { title: "Options Trading for Professionals", instructor: "Shubham Agarwal", duration: "8h 00m", students: "5,800", rating: 4.6, level: "Advanced", tag: "" },
  { title: "Tax Planning & ELSS Investing", instructor: "Archit Gupta, ClearTax", duration: "2h 30m", students: "20,100", rating: 4.8, level: "Beginner", tag: "POPULAR" },
  { title: "Real Estate vs Equity: Where to Invest", instructor: "Anuj Puri, ANAROCK", duration: "3h 00m", students: "9,300", rating: 4.5, level: "Intermediate", tag: "" },
];

const levelColors: Record<string, string> = {
  Beginner: "text-emerald-500 bg-emerald-500/10",
  Intermediate: "text-amber-500 bg-amber-500/10",
  Advanced: "text-red-500 bg-red-500/10",
};

export default function MasterclassPage() {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-violet-400" /> ET Masterclasses
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Learn from India's top financial experts</p>
          </div>
          <a href="https://economictimes.indiatimes.com/prime/masterclass" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500 text-white text-sm font-medium hover:opacity-90 transition-all">
            Browse All <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Courses", value: "80+" },
            { label: "Expert Instructors", value: "40+" },
            { label: "Learners", value: "1.5L+" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4 text-center shadow-card">
              <p className="text-xl font-bold text-violet-400">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Courses grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  {c.tag && <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{c.tag}</span>}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${levelColors[c.level]}`}>{c.level}</span>
                </div>
              </div>
              <h4 className="text-sm font-bold group-hover:text-violet-400 transition-colors">{c.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{c.instructor}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.students}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-accent" />{c.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
