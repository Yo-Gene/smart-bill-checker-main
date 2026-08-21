import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { auditPrepaidBalance } from "@/utils/billCalculator";
import { addBillRecord, AuditStatus } from "@/utils/historyStorage";

const BillInput = () => {
  const navigate = useNavigate();

  const [startingBalance, setStartingBalance] = useState("");
  const [previousReading, setPreviousReading] = useState("");
  const [currentReading, setCurrentReading] = useState("");
  const [actualBalance, setActualBalance] = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [error, setError] = useState("");

  const inputClass =
    "w-full h-14 rounded-xl border border-border bg-card px-4 text-lg font-display font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary";

  const handleCalculate = () => {
    setError("");

    const starting = Number.parseFloat(startingBalance);
    const previous = Number.parseFloat(previousReading);
    const current = Number.parseFloat(currentReading);
    const actual = Number.parseFloat(actualBalance);
    const deductions = otherDeductions
      ? Number.parseFloat(otherDeductions)
      : 0;

    if (!Number.isFinite(starting) || starting <= 0) {
      setError("Enter a valid starting balance");
      return;
    }

    if (!Number.isFinite(previous) || previous < 0) {
      setError("Enter a valid previous meter reading");
      return;
    }

    if (!Number.isFinite(current) || current < 0) {
      setError("Enter a valid current meter reading");
      return;
    }

    if (current < previous) {
      setError("Current meter reading cannot be lower than the previous reading");
      return;
    }

    if (!Number.isFinite(actual) || actual < 0) {
      setError("Enter a valid current meter balance");
      return;
    }

    if (!Number.isFinite(deductions) || deductions < 0) {
      setError("Enter a valid deduction amount");
      return;
    }

    const result = auditPrepaidBalance(
      starting,
      previous,
      current,
      actual,
      deductions
    );

    let status: AuditStatus = "correct";

    if (result.difference > 1) {
      status = "overcharged";
    } else if (result.difference < -1) {
      status = "undercharged";
    }

    addBillRecord({
      id: Date.now(),
      date: new Date().toISOString(),
      startingBalance: starting,
      previousReading: previous,
      currentReading: current,
      unitsUsed: result.unitsUsed,
      energyCost: result.energyCost,
      otherDeductions: result.otherDeductions,
      expectedDeduction: result.expectedDeduction,
      expectedBalance: result.expectedBalance,
      actualBalance: result.actualBalance,
      difference: result.difference,
      status,
    });

    navigate("/bill-result", {
      state: {
        startingBalance: starting.toFixed(2),
        previousReading: previous.toFixed(2),
        currentReading: current.toFixed(2),
        unitsUsed: result.unitsUsed.toFixed(2),
        energyCost: result.energyCost.toFixed(2),
        otherDeductions: result.otherDeductions.toFixed(2),
        expectedDeduction: result.expectedDeduction.toFixed(2),
        expectedBalance: result.expectedBalance.toFixed(2),
        actualBalance: result.actualBalance.toFixed(2),
        difference: result.difference.toFixed(2),
        status,
      },
    });
  };

  const isValid =
    startingBalance.trim() !== "" &&
    previousReading.trim() !== "" &&
    currentReading.trim() !== "" &&
    actualBalance.trim() !== "";

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="bg-secondary px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-6 rounded-b-3xl">
        <button
          onClick={() => navigate(-1)}
          className="text-secondary-foreground/70 text-sm mb-2"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold text-secondary-foreground font-display">
          Audit Prepaid Balance
        </h1>

        <p className="text-secondary-foreground/60 text-xs mt-1">
          Check how much money should remain after electricity use
        </p>
      </div>

      <div className="px-5 mt-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Starting Balance / Top-up Amount (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            placeholder="e.g., 200"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Previous Meter Reading (kWh)
          </label>
          <input
            type="number"
            step="0.01"
            value={previousReading}
            onChange={(e) => setPreviousReading(e.target.value)}
            placeholder="e.g., 1245.8"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Current Meter Reading (kWh)
          </label>
          <input
            type="number"
            step="0.01"
            value={currentReading}
            onChange={(e) => setCurrentReading(e.target.value)}
            placeholder="e.g., 1267.5"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Current Meter Balance (GH₵)
          </label>
          <input
            type="number"
            step="0.01"
            value={actualBalance}
            onChange={(e) => setActualBalance(e.target.value)}
            placeholder="e.g., 158.30"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Other Deductions (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={otherDeductions}
            onChange={(e) => setOtherDeductions(e.target.value)}
            placeholder="e.g., 2.50"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-destructive text-sm font-medium">{error}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCalculate}
          disabled={!isValid}
          className={`w-full h-14 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2 mt-6 ${
            isValid
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          <Calculator size={20} />
          Audit Balance
        </motion.button>
      </div>
    </div>
  );
};

export default BillInput;
