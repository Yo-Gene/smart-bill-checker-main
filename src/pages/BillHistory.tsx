import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle, MinusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBillHistory, removeBillRecord, BillRecord } from "@/utils/historyStorage";

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
    label: "Units Correct",
  },
  undercharged: {
    icon: MinusCircle,
    color: "text-secondary",
    bg: "bg-secondary/10",
    label: "Extra Units",
  },
};

const BillHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<BillRecord[]>([]);

  useEffect(() => {
    const records = getBillHistory();
    setHistory(records);
  }, []);

  const handleDelete = (id: number) => {
    removeBillRecord(id);
    setHistory(getBillHistory());
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-5">
          <p className="text-muted-foreground">No history found.</p>

          <button
            onClick={() => navigate("/bill-input")}
            className="mt-4 text-primary underline text-sm"
          >
            Add a new reading
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
          Bill History
        </h1>

        <p className="text-secondary-foreground/60 text-xs mt-1">
          Your past meter scans
        </p>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {history.map((item, index) => {
          const config =
            statusConfig[item.status as keyof typeof statusConfig];
          const Icon = config.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}
                >
                  <Icon size={18} className={config.color} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground font-display">
                      {new Date(item.date).toLocaleDateString()}
                    </span>

                    <span className={`text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {item.meterReading} kWh
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-destructive/80 text-sm font-bold"
              >
                Delete
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BillHistory;