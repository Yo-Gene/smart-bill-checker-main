import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Gauge, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import { auditPrepaidBalance } from "@/utils/billCalculator";
import { addBillRecord, AuditStatus } from "@/utils/historyStorage";
import { notifyAuditResult } from "@/utils/notifications";

const BillInput = () => {
  const navigate = useNavigate();

  const [startingBalance, setStartingBalance] = useState("");
  const [previousReading, setPreviousReading] = useState("");
  const [currentReading, setCurrentReading] = useState("");
  const [actualBalance, setActualBalance] = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [error, setError] = useState("");

  const inputClass =
    "w-full h-14 rounded-2xl border border-border bg-background px-4 text-base font-display font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";

  const handleCalculate = () => {
    setError("");

    const starting = Number.parseFloat(startingBalance);
    const previous = Number.parseFloat(previousReading);
    const current = Number.parseFloat(currentReading);
    const actual = Number.parseFloat(actualBalance);
    const deductions = otherDeductions ? Number.parseFloat(otherDeductions) : 0;

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

    const result = auditPrepaidBalance(starting, previous, current, actual, deductions);

    let status: AuditStatus = "correct";
    if (result.difference > 1) status = "overcharged";
    else if (result.difference < -1) status = "undercharged";

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

    notifyAuditResult(status, result.difference, result.actualBalance);

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
    <div className="min-h-screen pb-24 bg-muted/30">
      <div className="px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] max-w-2xl mx-auto">
        <header className="bg-secondary rounded-[28px] px-5 py-6 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="text-secondary-foreground/70 text-xs mb-4"
          >
            ← Back
          </button>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground font-display">
                Audit
              </h1>
              <p className="text-secondary-foreground/65 text-sm mt-1">
                Check your prepaid electricity usage
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/10 flex items-center justify-center">
              <Calculator size={23} className="text-secondary-foreground" />
            </div>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-card rounded-[28px] border border-border/70 shadow-sm p-5 sm:p-6"
        >
          <h2 className="text-lg font-bold text-foreground font-display">Enter Your Details</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Fill in the information below to audit your meter balance.
          </p>

          <div className="space-y-5">
            <Field label="Previous Meter Reading (kWh)" icon={Gauge}>
              <input type="number" step="0.01" value={previousReading} onChange={(e) => setPreviousReading(e.target.value)} placeholder="e.g., 1245.8" className={inputClass} />
            </Field>

            <Field label="Current Meter Reading (kWh)" icon={Gauge}>
              <input type="number" step="0.01" value={currentReading} onChange={(e) => setCurrentReading(e.target.value)} placeholder="e.g., 1267.5" className={inputClass} />
            </Field>

            <Field label="Starting Balance / Top-up Amount (GH₵)" icon={WalletCards}>
              <input type="number" step="0.01" value={startingBalance} onChange={(e) => setStartingBalance(e.target.value)} placeholder="e.g., 200.00" className={inputClass} />
            </Field>

            <Field label="Current Meter Balance (GH₵)" icon={WalletCards}>
              <input type="number" step="0.01" value={actualBalance} onChange={(e) => setActualBalance(e.target.value)} placeholder="e.g., 158.30" className={inputClass} />
            </Field>

            <Field label="Other Deductions (Optional)" icon={WalletCards}>
              <input type="number" step="0.01" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} placeholder="e.g., 2.50" className={inputClass} />
            </Field>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCalculate}
            disabled={!isValid}
            className={`w-full h-14 rounded-2xl font-display font-bold text-base flex items-center justify-center gap-2 mt-7 transition ${
              isValid
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Calculator size={20} />
            Calculate Audit
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
};

const Field = ({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Icon size={15} className="text-primary" />
      <label className="text-sm font-semibold text-foreground">{label}</label>
    </div>
    {children}
  </div>
);

export default BillInput;
