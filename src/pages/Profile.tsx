import { useState, useEffect, ChangeEvent } from "react";
import {
  User,
  Settings,
  HelpCircle,
  Shield,
  Camera,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

const STORAGE_KEY = "user_profile";

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: "Guest User",
    email: "guest@example.com",
    avatarUrl: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUser((current) => ({ ...current, avatarUrl: reader.result as string }));
      toast.success("Avatar updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setUser((current) => ({ ...current, [field]: value }));
  };

  const menuItems = [
    {
      icon: Settings,
      label: "App Settings",
      description: "Theme, preferences and more",
      path: "/settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help with the audit system",
      path: "/help",
    },
    {
      icon: Shield,
      label: "Privacy Policy",
      description: "Read how your local data is handled",
      path: "/privacy",
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-muted/30">
      <div className="px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] max-w-2xl mx-auto">
        <header className="bg-secondary rounded-[28px] px-5 py-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground font-display">
                Profile
              </h1>
              <p className="text-secondary-foreground/65 text-sm mt-1">
                Manage your preferences
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/10 flex items-center justify-center">
              <User size={23} className="text-secondary-foreground" />
            </div>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-card rounded-[28px] border border-border/70 shadow-sm p-6 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto relative ring-4 ring-background shadow-sm">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User size={40} className="text-primary" />
            )}

            <label className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-md">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {editing ? (
            <div className="mt-5 space-y-3 max-w-sm mx-auto">
              <input
                value={user.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Name"
              />
              <input
                value={user.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Email"
              />
              <button
                className="w-full h-11 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold"
                onClick={() => {
                  setEditing(false);
                  toast.success("Profile saved!");
                }}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-foreground font-display mt-5">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              <button
                className="mt-3 text-primary text-sm font-semibold"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </motion.section>

        <div className="mt-4 space-y-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(item.path)}
              className="w-full bg-card rounded-[22px] border border-border/70 p-4 flex items-center gap-4 text-left shadow-sm hover:bg-primary/5 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon size={19} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {item.description}
                </p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
