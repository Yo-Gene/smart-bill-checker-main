import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Bell, LogOut, ArrowLeft } from "lucide-react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { toast } from "react-hot-toast";

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
}

const STORAGE_KEY = "app_settings";

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [settings, setSettings] = useState<AppSettings>({
    darkMode: darkMode,
    notifications: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key: keyof AppSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    if (key === "darkMode") setDarkMode(newSettings.darkMode);
    if (key === "notifications") toast.success(newSettings.notifications ? "Notifications Enabled" : "Notifications Disabled");
  };

  const handleLogout = () => {
    localStorage.removeItem("user_profile");
    localStorage.removeItem("app_settings");
    toast("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
      {/* Header */}
      <div className={`bg-secondary px-5 pt-12 pb-6 rounded-b-3xl flex items-center gap-3 ${darkMode ? "bg-gray-800" : "bg-secondary"}`}>
        <button onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-secondary-foreground font-display">Settings</h1>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Dark Mode */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="w-full bg-card rounded-xl border border-border p-4 flex items-center justify-between cursor-pointer"
          onClick={() => toggle("darkMode")}
        >
          <div className="flex items-center gap-3">
            {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
            <span className="text-sm font-medium text-foreground">Dark Mode</span>
          </div>
          <input type="checkbox" checked={settings.darkMode} readOnly className="cursor-pointer" />
        </motion.div>

        {/* Notifications */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="w-full bg-card rounded-xl border border-border p-4 flex items-center justify-between cursor-pointer"
          onClick={() => toggle("notifications")}
        >
          <div className="flex items-center gap-3">
            <Bell size={20} />
            <span className="text-sm font-medium text-foreground">Notifications</span>
          </div>
          <input type="checkbox" checked={settings.notifications} readOnly className="cursor-pointer" />
        </motion.div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-destructive/5 rounded-xl border border-destructive/20 p-4 flex items-center gap-3 mt-4 hover:bg-destructive/10 transition"
          onClick={handleLogout}
        >
          <LogOut size={18} className="text-destructive" />
          <span className="text-sm font-medium text-destructive">Log Out</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Settings;