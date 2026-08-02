import { ScanLine, FileText, History, Info, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-illustration.png";

const quickActions = [
{
  icon: ScanLine,
  label: "Scan Meter",
  description: "Use your camera to read meter",
  path: "/scan",
  highlight: true
},
{
  icon: FileText,
  label: "Enter Details",
  description: "Manually input bill info",
  path: "/bill-input"
},
{
  icon: History,
  label: "Bill History",
  description: "View past verifications",
  path: "/history"
},
{
  icon: Info,
  label: "Tariff Info",
  description: "View ECG tariff rates",
  path: "/tariffs"
}];


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="">
        <div className="">
          
        </div>
        {/* Hero scan card */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/scan")}
          className="w-full bg-secondary rounded-2xl p-5 flex items-center gap-4 shadow-lg">
          
          <img alt="Scan meter" className="w-20 h-20 object-contain" src="https://cdn3d.iconscout.com/3d/premium/thumb/electric-meter-box-3d-icon-png-download-10367959.png" />
          <div className="text-left flex-1">
            <h2 className="text-lg font-bold text-secondary-foreground font-display">Scan Your Meter</h2>
            <p className="text-secondary-foreground/70 text-xs mt-1">
              Point your camera at the meter to instantly verify your bill
            </p>
          </div>
          <ChevronRight className="text-secondary-foreground/60" size={24} />
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 font-display">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) =>
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-start p-4 rounded-xl border border-border ${
            action.highlight ?
            "bg-primary/10 border-primary/30" :
            "bg-card"}`
            }>
            
              <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              action.highlight ?
              "bg-primary text-primary-foreground" :
              "bg-muted text-muted-foreground"}`
              }>
              
                <action.icon size={20} />
              </div>
              <span className="text-sm font-semibold text-foreground font-display">{action.label}</span>
              <span className="text-[11px] text-muted-foreground mt-0.5 text-left">{action.description}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Recent Activity Teaser */}
      <div className="px-5 mt-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground font-display mb-2">Recent Activity</h3>
          <p className="text-xs text-muted-foreground">No verifications yet. Scan your meter to get started!</p>
        </div>
      </div>
    </div>);

};

export default Index;