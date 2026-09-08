import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { ThemeContext } from "@/contexts/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="min-h-screen pb-24 bg-muted/30">
      <div className="px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] max-w-3xl mx-auto">
        <header className="bg-secondary rounded-[28px] px-5 py-6 shadow-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-secondary-foreground/70 text-xs mb-4">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground font-display">App Settings</h1>
              <p className="text-secondary-foreground/65 text-sm mt-1">Manage your app appearance</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/10 flex items-center justify-center">
              <SettingsIcon size={23} className="text-secondary-foreground" />
            </div>
          </div>
        </header>

        <div className="mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full bg-card rounded-2xl border border-border p-4 flex items-center justify-between text-left"
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {darkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground block">Dark Mode</span>
                <span className="text-xs text-muted-foreground">{darkMode ? "Dark theme is on" : "Light theme is on"}</span>
              </div>
            </div>
            <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${darkMode ? "bg-primary" : "bg-muted-foreground/30"}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
