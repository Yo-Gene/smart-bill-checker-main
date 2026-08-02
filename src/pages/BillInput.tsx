import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { auditPrepaidPurchase } from "@/utils/billCalculator";
import { addBillRecord } from "@/utils/historyStorage";

const BillInput = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [amountPaid, setAmountPaid] = useState("");
  const [unitsReceived, setUnitsReceived] = useState("");
  const [arrears, setArrears] = useState("");
  const [error, setError] = useState("");

  // ✅ Auto-fill from scanner
  useEffect(() => {
    if (location.state?.scannedUnits) {
      setUnitsReceived(location.state.scannedUnits.toString());
    }
  }, [location.state]);

  const handleCalculate = () => {
    setError("");

    const amount = parseFloat(amountPaid);
    const units = parseFloat(unitsReceived);
    const arrearsValue = arrears ? parseFloat(arrears) : 0;

    // ✅ Validation
    if (isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount paid");
      return;
    }

    if (isNaN(units) || units <= 0) {
      setError("Enter valid units received");
      return;
    }

    if (arrears && isNaN(arrearsValue)) {
      setError("Invalid arrears value");
      return;
    }

    const result = auditPrepaidPurchase(amount, units, arrearsValue);

    // ✅ Status mapping (fixed logic)
    let status: "overcharged" | "correct" | "undercharged" = "correct";

    if (result.difference > 15) {
      status = "overcharged";
    } else if (result.difference < -5) {
      status = "undercharged";
    }

    // ✅ Save to history
    addBillRecord({
      id: Date.now(),
      date: new Date().toISOString(),
      amountPaid: amount,
      unitsReceived: units,
      expectedUnits: result.expectedUnits,
      difference: result.difference,
      status,
    });

    // ✅ Navigate to results
    navigate("/bill-result", {
      state: {
        amountPaid: amount.toFixed(2),
        unitsReceived: units.toFixed(2),
        arrears: arrearsValue.toFixed(2),
        expectedUnits: result.expectedUnits.toFixed(2),
        difference: result.difference.toFixed(2),
        status,
      },
    });
  };

  const isValid =
    amountPaid.trim() !== "" && unitsReceived.trim() !== "";

  return (
    <div className="min-h-screen pb-24 bg-background">

      {/* Header */}
      <div className="bg-secondary px-5 pt-12 pb-6 rounded-b-3xl">
        <button
          onClick={() => navigate(-1)}
          className="text-secondary-foreground/70 text-sm mb-2"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold text-secondary-foreground font-display">
          Audit Prepaid Purchase
        </h1>

        <p className="text-secondary-foreground/60 text-xs mt-1">
          Check if ECG gave you the correct electricity units
        </p>
      </div>

      <div className="px-5 mt-6 space-y-4">

        {/* Amount Paid */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Amount Paid (GH₵)
          </label>

          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="e.g., 200"
            className="w-full h-14 rounded-xl border border-border bg-card px-4 text-lg font-display font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Units Received */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Units Received (kWh)
          </label>

          <input
            type="number"
            value={unitsReceived}
            onChange={(e) => setUnitsReceived(e.target.value)}
            placeholder="e.g., 80"
            className="w-full h-14 rounded-xl border border-border bg-card px-4 text-lg font-display font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Hint if auto-filled */}
          {location.state?.scannedUnits && (
            <p className="text-xs text-primary mt-1">
              Auto-filled from meter scan
            </p>
          )}
        </div>

        {/* Arrears */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Arrears / Previous Debt (Optional)
          </label>

          <input
            type="number"
            value={arrears}
            onChange={(e) => setArrears(e.target.value)}
            placeholder="e.g., 20"
            className="w-full h-14 rounded-xl border border-border bg-card px-4 text-lg font-display font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-destructive text-sm font-medium">
            {error}
          </p>
        )}

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCalculate}
          disabled={!isValid}
          className={`w-full h-14 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2 mt-6 transition-colors ${
            isValid
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          <Calculator size={20} />
          Audit Purchase
        </motion.button>

      </div>
    </div>
  );
};

export default BillInput;