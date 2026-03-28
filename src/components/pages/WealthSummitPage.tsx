import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Users, ExternalLink, Mic, Award } from "lucide-react";

const speakers = [
  { name: "Uday Kotak", role: "Founder, Kotak Mahindra Bank", topic: "India's Wealth Decade" },
  { name: "Nilesh Shah", role: "MD, Kotak AMC", topic: "Equity Markets Outlook 2026" },
  { name: "Radhika Gupta", role: "CEO, Edelweiss AMC", topic: "Women & Wealth" },
  { name: "Prashant Jain", role: "Ex-CIO, HDFC AMC", topic: "Long-term Portfolio Strategy" },
];

const events = [
  { title: "ET Wealth Summit 2026", date: "March 15, 2026", location: "Mumbai", type: "FLAGSHIP", seats: "500 seats left" },
  { title: "ET HNI Conclave", date: "April 8, 2026", location: "Delhi", type: "EXCLUSIVE", seats: "100 seats left" },
  { title: "ET Women & Wealth Forum", date: "May 20, 2026", location: "Bangalore", type: "SPECIAL", seats: "200 seats left" },
];

export default function WealthSummitPage() {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-amber-400" /> ET Wealth Summits
            </h2>
            <p className="text-sm text-muted-foreground mt-1">India's premier wealth management events</p>
          </div>
          <a href="https://economictimes.indiatimes.com/wealth" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:opacity-90 transition-all">
            Register <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Upcoming events */}
        <div className="space-y-3">
          {events.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-7 h-7 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{e.type}</span>
                  <span className="text-[10px] text-muted-foreground">{e.seats}</span>
                </div>
                <h3 className="text-sm font-bold">{e.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-semibold hover:bg-amber-500/20 transition-all flex-shrink-0">
                Register
              </button>
            </motion.div>
          ))}
        </div>

        {/* Speakers */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <h3 className="font-display text-base font-semibold mb-4 flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400" /> Featured Speakers
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {speakers.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                  {s.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.role}</p>
                  <p className="text-[10px] text-amber-500 truncate">"{s.topic}"</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Past attendees", value: "50,000+" },
            { icon: Mic, label: "Expert speakers", value: "200+" },
            { icon: Award, label: "Events hosted", value: "15+" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4 text-center shadow-card">
              <s.icon className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
