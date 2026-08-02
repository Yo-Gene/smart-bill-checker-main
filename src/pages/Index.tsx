import {
  Calculator,
  History,
  Info,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const quickActions = [
  {
    icon: Calculator,
    label: "Audit Balance",
    description: "Check your prepaid meter deductions",
    path: "/bill-input",
    highlight: true,
  },
  {
    icon: History,
    label: "Audit History",
    description: "View your previous balance checks",
    path: "/history",
    highlight: false,
  },
  {
    icon: Info,
    label: "Tariff Information",
    description: "View electricity tariff rates",
    path: "/tariffs",
    highlight: false,
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="px-5 pt-12">
        <p className="text-sm text-muted-foreground">Welcome to</p>

        <h1 className="text-2xl font-bold text-foreground font-display">
          Smart Bill Checker
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Check how much money your prepaid meter should deduct.
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/bill-input")}
          className="w-full bg-secondary rounded-2xl p-5 flex items-center gap-4 shadow-lg mt-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary-foreground/10 flex items-center justify-center">
            <Wallet size={32} className="text-secondary-foreground" />
          </div>

          <div className="text-left flex-1">
            <h2 className="text-lg font-bold text-secondary-foreground font-display">
              Audit Your Prepaid Balance
            </h2>
            <p className="text-secondary-foreground/70 text-xs mt-1">
              Enter your meter readings and current money balance.
            </p>
          </div>

          <ChevronRight
            className="text-secondary-foreground/60"
            size={24}
          />
        </motion.button>
      </div>

      <div className="px-5 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 font-display">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-start p-4 rounded-xl border ${
                action.highlight
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card border-border"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  action.highlight
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <action.icon size={20} />
              </div>

              <span className="text-sm font-semibold text-foreground font-display">
                {action.label}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 text-left">
                {action.description}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground font-display mb-2">
            How it works
          </h3>
          <p className="text-xs text-muted-foreground">
            Enter your starting balance, previous meter reading, current
            meter reading and current meter balance. The app calculates how
            much money should have been deducted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
