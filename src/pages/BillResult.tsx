import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ArrowLeft, Download } from "lucide-react";

const BillResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as any;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-5">
          <p className="text-muted-foreground">No data available.</p>
          <button
            onClick={() => navigate("/bill-input")}
            className="mt-4 text-secondary underline text-sm"
          >
            Audit purchase
          </button>
        </div>
      </div>
    );
  }

  const diff = parseFloat(data.difference);
  const status = data.status as "overcharged" | "undercharged" | "correct";

  // ✅ Map status
  const isOvercharged = status === "overcharged"; // missing units
  const isUndercharged = status === "undercharged"; // extra units
  const isCorrect = status === "correct";

  const StatusIcon = isOvercharged ? AlertTriangle : CheckCircle;

  const statusLabel = isOvercharged
    ? "Possible Overcharge"
    : isUndercharged
    ? "Extra Units Received"
    : "Units Correct";

  // ✅ Smart explanation
  let message = "";
  if (isOvercharged) {
    message =
      "You received significantly fewer units than expected. This may be due to arrears, deductions, or a billing issue.";
  } else if (isUndercharged) {
    message = "You received more units than expected. Check if this is reflected on your meter.";
  } else {
    message = "Your purchase matches expected ECG values.";
  }

  return (
    <div className="min-h-screen pb-24 bg-background">

      {/* Back */}
      <div className="px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground text-sm flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Status Card */}
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
          size={40}
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

        {isOvercharged && (
          <p className="text-destructive font-display font-bold text-2xl mt-3">
            {diff.toFixed(2)} kWh missing
          </p>
        )}

        {isUndercharged && (
          <p className="text-secondary font-display font-bold text-2xl mt-3">
            {Math.abs(diff).toFixed(2)} kWh extra
          </p>
        )}
      </motion.div>

      {/* Breakdown */}
      <div className="mx-5 mt-5 bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="font-display font-semibold text-foreground">
          Purchase Breakdown
        </h3>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="font-display font-semibold text-foreground">
            GH₵ {data.amountPaid}
          </span>
        </div>

        {data.arrears && parseFloat(data.arrears) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Arrears Deducted</span>
            <span className="font-display font-semibold text-destructive">
              GH₵ {data.arrears}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Expected Units</span>
          <span className="font-display font-semibold text-foreground">
            {data.expectedUnits} kWh
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Units Received</span>
          <span className="font-display font-semibold text-foreground">
            {data.unitsReceived} kWh
          </span>
        </div>

        <div className="border-t border-border pt-3 flex justify-between text-sm">
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
            {diff > 0 ? "-" : "+"}
            {Math.abs(diff).toFixed(2)} kWh
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-5 mt-5 flex gap-3">
        {isOvercharged && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              navigate("/complaint", {
                state: data,
              })
            }
            className="flex-1 h-12 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center font-display font-bold text-sm"
          >
            Report Issue
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/history")}
          className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center gap-2 font-display font-bold text-sm"
        >
          <Download size={16} />
          Save Report
        </motion.button>
      </div>
    </div>
  );
};

export default BillResult;