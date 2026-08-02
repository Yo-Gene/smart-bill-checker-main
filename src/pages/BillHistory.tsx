import { useEffect, useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  MinusCircle,
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
    label: "Possible Overcharge",
  },
  correct: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    label: "Balance Correct",
  },
  undercharged: {
    icon: MinusCircle,
    color: "text-secondary",
    bg: "bg-secondary/10",
    label: "Balance Higher",
  },
};

const BillHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<BillRecord[]>([]);

  useEffect(() => {
    setHistory(getBillHistory());
  }, []);

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-5">
          <p className="text-muted-foreground">No audit history found.</p>
          <button
            onClick={() => navigate("/bill-input")}
            className="mt-4 text-primary underline text-sm"
          >
            Start a new audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="bg-secondary px-5 pt-12 pb-6 rounded-b-3xl">
        <button
          onClick={() => navigate("/")}
          className="text-secondary-foreground/70 text-sm mb-2 flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Home
        </button>

        <h1 className="text-xl font-bold text-secondary-foreground font-display">
          Audit History
        </h1>

        <p className="text-secondary-foreground/60 text-xs mt-1">
          Your saved prepaid balance checks
        </p>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {history.map((item, index) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}
                >
                  <Icon size={18} className={config.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground font-display">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <HistoryValue
                      label="Units used"
                      value={`${item.unitsUsed.toFixed(2)} kWh`}
                    />
                    <HistoryValue
                      label="Energy cost"
                      value={`GH₵ ${item.energyCost.toFixed(2)}`}
                    />
                    <HistoryValue
                      label="Expected balance"
                      value={`GH₵ ${item.expectedBalance.toFixed(2)}`}
                    />
                    <HistoryValue
                      label="Actual balance"
                      value={`GH₵ ${item.actualBalance.toFixed(2)}`}
                    />
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Zap size={13} />
                      Difference
                    </span>
                    <span className={`text-sm font-bold font-display ${config.color}`}>
                      GH₵ {Math.abs(item.difference).toFixed(2)}
                    </span>
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

const HistoryValue = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-muted-foreground">{label}</p>
    <p className="text-foreground font-semibold mt-0.5">{value}</p>
  </div>
);

export default BillHistory;
