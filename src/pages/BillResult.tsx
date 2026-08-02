import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Wallet,
  Zap,
} from "lucide-react";
import { AuditStatus } from "@/utils/historyStorage";

interface BillResultData {
  startingBalance: string;
  previousReading: string;
  currentReading: string;
  unitsUsed: string;
  energyCost: string;
  otherDeductions: string;
  expectedDeduction: string;
  expectedBalance: string;
  actualBalance: string;
  difference: string;
  status: AuditStatus;
}

const BillResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as BillResultData | null;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-5">
          <p className="text-muted-foreground">
            No calculation data is available.
          </p>
          <button
            onClick={() => navigate("/bill-input")}
            className="mt-4 text-primary underline text-sm"
          >
            Audit prepaid balance
          </button>
        </div>
      </div>
    );
  }

  const difference = Number.parseFloat(data.difference);
  const otherDeductions = Number.parseFloat(data.otherDeductions);

  const isOvercharged = data.status === "overcharged";
  const isUndercharged = data.status === "undercharged";
  const isCorrect = data.status === "correct";

  const StatusIcon = isOvercharged ? AlertTriangle : CheckCircle;

  const statusLabel = isOvercharged
    ? "Possible Overcharge"
    : isUndercharged
      ? "Balance Higher Than Expected"
      : "Balance Correct";

  const message = isOvercharged
    ? "Your meter balance is lower than expected. More money may have been deducted than the calculated electricity cost."
    : isUndercharged
      ? "Your meter balance is higher than expected. The meter appears to have deducted less money than calculated."
      : "Your meter balance is close to the expected balance based on your electricity usage.";

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground text-sm flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`mx-5 rounded-2xl p-6 text-center ${
          isOvercharged
            ? "bg-destructive/10 border border-destructive/30"
            : isCorrect
              ? "bg-success/10 border border-success/30"
              : "bg-secondary/10 border border-secondary/30"
        }`}
      >
        <StatusIcon
          size={42}
          className={`mx-auto ${
            isOvercharged
              ? "text-destructive"
              : isCorrect
                ? "text-success"
                : "text-secondary"
          }`}
        />

        <h2 className="font-display font-bold text-xl mt-3 text-foreground">
          {statusLabel}
        </h2>

        <p className="text-sm mt-2 text-muted-foreground">{message}</p>

        <p
          className={`font-display font-bold text-2xl mt-4 ${
            isOvercharged
              ? "text-destructive"
              : isCorrect
                ? "text-success"
                : "text-secondary"
          }`}
        >
          GH₵ {Math.abs(difference).toFixed(2)}
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          {isOvercharged
            ? "Extra amount deducted"
            : isUndercharged
              ? "Amount not deducted"
              : "Balance difference"}
        </p>
      </motion.div>

      <div className="mx-5 mt-5 bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={18} className="text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            Balance Breakdown
          </h3>
        </div>

        <div className="space-y-4 text-sm">
          <Row label="Starting Balance" value={`GH₵ ${data.startingBalance}`} />
          <Row label="Expected Deduction" value={`GH₵ ${data.expectedDeduction}`} />
          <Row label="Expected Balance" value={`GH₵ ${data.expectedBalance}`} />
          <Row label="Actual Meter Balance" value={`GH₵ ${data.actualBalance}`} />

          <div className="border-t border-border pt-3 flex justify-between gap-4">
            <span className="text-muted-foreground font-medium">Difference</span>
            <span
              className={`font-display font-bold ${
                isOvercharged
                  ? "text-destructive"
                  : isCorrect
                    ? "text-success"
                    : "text-secondary"
              }`}
            >
              GH₵ {Math.abs(difference).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-5 bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            Electricity Usage
          </h3>
        </div>

        <div className="space-y-4 text-sm">
          <Row label="Previous Meter Reading" value={`${data.previousReading} kWh`} />
          <Row label="Current Meter Reading" value={`${data.currentReading} kWh`} />
          <Row label="Units Used" value={`${data.unitsUsed} kWh`} />
          <Row label="Energy Cost" value={`GH₵ ${data.energyCost}`} />

          {otherDeductions > 0 && (
            <Row
              label="Other Deductions"
              value={`GH₵ ${data.otherDeductions}`}
            />
          )}
        </div>
      </div>

      <div className="mx-5 mt-5 flex gap-3">
        {isOvercharged && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/complaint", { state: data })}
            className="flex-1 h-12 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center font-display font-bold text-sm"
          >
            Report Issue
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/bill-input")}
          className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center font-display font-bold text-sm"
        >
          New Audit
        </motion.button>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-display font-semibold text-foreground text-right">
      {value}
    </span>
  </div>
);

export default BillResult;
