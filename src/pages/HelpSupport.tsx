import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleHelp, Calculator, Gauge, WalletCards, AlertCircle } from "lucide-react";

const HelpSupport = () => {
  const navigate = useNavigate();
  const tips = [
    { icon: Calculator, title: "How to audit your balance", text: "Enter your starting balance, previous meter reading, current meter reading and the current money balance shown on your prepaid meter. Add any other known deductions if needed, then tap Audit Balance." },
    { icon: Gauge, title: "Meter readings", text: "Your current meter reading should be equal to or higher than the previous reading. The difference between the two readings is the electricity used in kWh." },
    { icon: WalletCards, title: "Balance results", text: "The app compares the balance you should have with the balance currently shown on your meter and indicates if the deduction appears correct, higher or lower than expected." },
    { icon: AlertCircle, title: "If something looks wrong", text: "Check that all values were entered correctly. You can also review the tariff information in the app and repeat the audit before raising a complaint with your electricity provider." },
  ];

  return (
    <div className="min-h-screen pb-24 bg-muted/30">
      <div className="px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] max-w-3xl mx-auto">
        <header className="bg-secondary rounded-[28px] px-5 py-6 shadow-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-secondary-foreground/70 text-xs mb-4">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground font-display">Help & Support</h1>
              <p className="text-secondary-foreground/65 text-sm mt-1">Quick help for using MeterGuard</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/10 flex items-center justify-center">
              <CircleHelp size={23} className="text-secondary-foreground" />
            </div>
          </div>
        </header>

        <div className="mt-4 space-y-3">
          {tips.map((tip) => (
            <div key={tip.title} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center"><tip.icon size={20} className="text-primary" /></div>
                <div><h2 className="text-sm font-semibold text-foreground font-display">{tip.title}</h2><p className="text-xs leading-5 text-muted-foreground mt-1">{tip.text}</p></div>
              </div>
            </div>
          ))}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground font-display mb-2">Common questions</h2>
            <div className="space-y-3 text-xs leading-5 text-muted-foreground">
              <div><p className="font-medium text-foreground">Does the app change my meter balance?</p><p>No. MeterGuard only performs calculations using the values you enter.</p></div>
              <div><p className="font-medium text-foreground">Where is my audit history stored?</p><p>Your audit history is stored locally in your browser on this device.</p></div>
              <div><p className="font-medium text-foreground">Can I use decimal meter readings?</p><p>Yes. You can enter readings with decimal values.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
