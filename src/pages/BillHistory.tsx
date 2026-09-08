import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  MinusCircle,
  Search,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBillHistory, BillRecord } from "@/utils/historyStorage";

const statusConfig = {
  overcharged: {
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    pill: "bg-destructive/10 text-destructive",
    label: "Overcharged",
  },
  correct: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    pill: "bg-success/10 text-success",
    label: "Correct",
  },
  undercharged: {
    icon: MinusCircle,
    color: "text-secondary",
    bg: "bg-secondary/10",
    pill: "bg-secondary/10 text-secondary",
    label: "Undercharged",
  },
};

const BillHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<BillRecord[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setHistory(getBillHistory());
  }, []);

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;

    return history.filter((item) => {
      const date = new Date(item.date).toLocaleDateString().toLowerCase();
      const status = statusConfig[item.status].label.toLowerCase();
      return date.includes(q) || status.includes(q);
    });
  }, [history, query]);

  return (
    <div className="min-h-screen pb-24 bg-muted/30">
      <div className="px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] max-w-2xl mx-auto">
        <header className="bg-secondary rounded-[28px] px-5 py-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground font-display">
                History
              </h1>
              <p className="text-secondary-foreground/65 text-sm mt-1">
                Your saved prepaid balance checks
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/10 flex items-center justify-center">
              <CalendarDays size={23} className="text-secondary-foreground" />
            </div>
          </div>
        </header>

        <div className="mt-4 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your audits..."
            className="w-full h-14 rounded-2xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {history.length === 0 ? (
          <div className="mt-4 bg-card rounded-[28px] border border-border p-8 text-center shadow-sm">
            <CalendarDays size={34} className="mx-auto text-muted-foreground/60" />
            <p className="text-foreground font-semibold mt-3">No audit history yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your completed audits will appear here.
            </p>
            <button
              onClick={() => navigate("/bill-input")}
              className="mt-5 px-5 h-11 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Start an audit
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="mt-4 bg-card rounded-[28px] border border-border p-6 text-center text-sm text-muted-foreground">
            No matching audits found.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filteredHistory.map((item, index) => {
              const config = statusConfig[item.status];
              const Icon = config.icon;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-[24px] border border-border/70 p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${config.bg}`}>
                      <Icon size={19} className={config.color} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-foreground font-display">
                            {new Date(item.date).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(item.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${config.pill}`}>
                          {config.label}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <HistoryValue label="Consumption" value={`${item.unitsUsed.toFixed(2)} kWh`} />
                        <HistoryValue label="Expected" value={`GH₵ ${item.expectedDeduction.toFixed(2)}`} />
                        <HistoryValue label="Actual" value={`GH₵ ${(item.startingBalance - item.actualBalance).toFixed(2)}`} />
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Zap size={13} /> Difference
                        </span>
                        <span className={`text-sm font-bold font-display ${config.color}`}>
                          GH₵ {Math.abs(item.difference).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryValue = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-[11px] text-muted-foreground truncate">{label}</p>
    <p className="text-xs sm:text-sm text-foreground font-bold mt-1 break-words">{value}</p>
  </div>
);

export default BillHistory;
