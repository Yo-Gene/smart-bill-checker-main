import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Bell, LogOut, ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { toast } from "react-hot-toast";
import {
  notificationSupported,
  requestNotificationPermission,
  sendAppNotification,
} from "@/utils/notifications";

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
}

const STORAGE_KEY = "app_settings";

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [settings, setSettings] = useState<AppSettings>({ darkMode, notifications: false });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<AppSettings>;
      const canNotify = notificationSupported() && Notification.permission === "granted";
      setSettings({
        darkMode: typeof parsed.darkMode === "boolean" ? parsed.darkMode : darkMode,
        notifications: parsed.notifications === true && canNotify,
      });
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleDarkMode = () => {
    const next = !settings.darkMode;
    setSettings((current) => ({ ...current, darkMode: next }));
    setDarkMode(next);
  };

  const toggleNotifications = async () => {
    if (settings.notifications) {
      setSettings((current) => ({ ...current, notifications: false }));
      toast.success("Notifications disabled");
      return;
    }
    if (!notificationSupported()) {
      toast.error("This browser does not support notifications");
      return;
    }
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      setSettings((current) => ({ ...current, notifications: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, notifications: true }));
      toast.success("Notifications enabled");
      setTimeout(() => sendAppNotification("Notifications enabled", "MeterGuard can now alert you about audit results, low balance and audit reminders."), 100);
    } else if (permission === "denied") {
      toast.error("Notification permission was blocked in your browser settings");
    } else {
      toast.error("Notifications are not available on this device");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_profile");
    localStorage.removeItem("app_settings");
    toast("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? "bg-gray-900" : "bg-muted/30"}`}>
      <div className="px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] max-w-3xl mx-auto">
        <header className={`${darkMode ? "bg-gray-800" : "bg-secondary"} rounded-[28px] px-5 py-6 shadow-sm`}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-secondary-foreground/70 text-xs mb-4">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground font-display">App Settings</h1>
              <p className="text-secondary-foreground/65 text-sm mt-1">Manage your app preferences</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/10 flex items-center justify-center">
              <SettingsIcon size={23} className="text-secondary-foreground" />
            </div>
          </div>
        </header>

        <div className="mt-4 space-y-4">
          <motion.div whileTap={{ scale: 0.97 }} className="w-full bg-card rounded-2xl border border-border p-4 flex items-center justify-between cursor-pointer" onClick={toggleDarkMode}>
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-sm font-medium text-foreground">Dark Mode</span>
            </div>
            <input type="checkbox" checked={settings.darkMode} readOnly className="cursor-pointer" />
          </motion.div>

          <motion.div whileTap={{ scale: 0.97 }} className="w-full bg-card rounded-2xl border border-border p-4 flex items-center justify-between cursor-pointer" onClick={toggleNotifications}>
            <div className="flex items-center gap-3">
              <Bell size={20} />
              <div className="text-left">
                <span className="text-sm font-medium text-foreground block">Notifications</span>
                <span className="text-xs text-muted-foreground">Audit results, low balance and 7-day reminders</span>
              </div>
            </div>
            <input type="checkbox" checked={settings.notifications} readOnly className="cursor-pointer" />
          </motion.div>

          <motion.button whileTap={{ scale: 0.97 }} className="w-full bg-destructive/5 rounded-2xl border border-destructive/20 p-4 flex items-center gap-3 mt-4 hover:bg-destructive/10 transition" onClick={handleLogout}>
            <LogOut size={18} className="text-destructive" />
            <span className="text-sm font-medium text-destructive">Log Out</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
