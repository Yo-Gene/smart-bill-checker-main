import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import logo from "@/assets/logo.png";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex flex-col items-center gap-6"
      >
        <img src={logo} alt="Smart ECG Bill Auditor" className="w-28 h-28 rounded-3xl" />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-foreground">
            Smart ECG
          </h1>
          <h2 className="text-3xl font-bold text-primary">Bill Auditor</h2>
          <p className="mt-3 text-secondary-foreground/70 text-sm max-w-xs">
            Verify your electricity bills instantly. Scan, compare, and save money.
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onClick={() => navigate("/")}
        className="mt-16 w-full max-w-xs h-14 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center gap-2 shadow-lg animate-pulse-glow"
      >
        <Zap size={20} />
        Get Started
      </motion.button>
    </div>
  );
};

export default Splash;
