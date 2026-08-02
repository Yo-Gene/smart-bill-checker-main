import { useState, useEffect, ChangeEvent, useContext } from "react";
import { User, Settings, HelpCircle, Shield, LogOut, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@/contexts/ThemeContext"; // we’ll create this context
import { toast } from "react-hot-toast"; // for notifications

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

const STORAGE_KEY = "user_profile";

const Profile = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [user, setUser] = useState<UserProfile>({
    name: "Guest User",
    email: "guest@example.com",
    avatarUrl: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const [editing, setEditing] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUser({ ...user, avatarUrl: reader.result as string });
      toast.success("Avatar updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("app_settings");
    toast("Logged out successfully!");
    navigate("/login");
  };

  const menuItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
    { icon: Shield, label: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? "bg-gray-900" : "bg-background"}`}>
      {/* Header */}
      <div className={`px-5 pt-12 pb-8 rounded-b-3xl text-center ${darkMode ? "bg-gray-800" : "bg-secondary"}`}>
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 relative">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <User size={40} className="text-primary" />
          )}
          <label className="absolute bottom-0 right-0 bg-primary/30 p-1 rounded-full cursor-pointer">
            <Camera size={16} className="text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>

        {editing ? (
          <div className="space-y-2">
            <input
              value={user.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-52 px-3 py-1 rounded border border-border text-sm text-foreground"
              placeholder="Name"
            />
            <input
              value={user.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-52 px-3 py-1 rounded border border-border text-sm text-foreground"
              placeholder="Email"
            />
            <button
              className="mt-1 text-primary font-bold text-sm"
              onClick={() => { setEditing(false); toast.success("Profile saved!"); }}
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-secondary-foreground font-display">{user.name}</h1>
            <p className="text-secondary-foreground/60 text-xs">{user.email}</p>
            <button
              className="mt-1 text-primary underline text-sm"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Menu */}
      <div className="px-5 mt-5 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="w-full bg-card rounded-xl border border-border p-4 flex items-center gap-3 hover:bg-primary/5 transition"
            onClick={() => navigate(item.path)}
          >
            <item.icon size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </motion.button>
        ))}

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

export default Profile;