import { ArrowLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const residentialTiers = [
  { range: "0 – 50 kWh", rate: "GH₵ 0.4482", label: "Lifeline" },
  { range: "51 – 300 kWh", rate: "GH₵ 0.6553", label: "Standard" },
  { range: "301 – 600 kWh", rate: "GH₵ 0.7553", label: "High Usage" },
  { range: "600+ kWh", rate: "GH₵ 0.8553", label: "Premium" },
];

const commercialTiers = [
  { range: "0 – 300 kWh", rate: "GH₵ 0.6553", label: "Tier 1" },
  { range: "301 – 600 kWh", rate: "GH₵ 0.7553", label: "Tier 2" },
  { range: "600+ kWh", rate: "GH₵ 0.9553", label: "Tier 3" },
];

const TariffTable = ({ tiers, title }: { tiers: typeof residentialTiers; title: string }) => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden">
    <div className="px-4 py-3 bg-muted/50 border-b border-border">
      <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
    </div>
    <div className="divide-y divide-border">
      {tiers.map((tier, i) => (
        <motion.div
          key={tier.range}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="px-4 py-3 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-foreground">{tier.range}</p>
            <p className="text-[11px] text-muted-foreground">{tier.label}</p>
          </div>
          <span className="font-display font-bold text-sm text-secondary">{tier.rate}/kWh</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const Tariffs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="bg-secondary px-5 pt-12 pb-6 rounded-b-3xl">
        <button onClick={() => navigate("/")} className="text-secondary-foreground/70 text-sm mb-2 flex items-center gap-1">
          <ArrowLeft size={14} /> Home
        </button>
        <div className="flex items-center gap-2">
          <Zap className="text-primary" size={22} />
          <h1 className="text-xl font-bold text-secondary-foreground font-display">ECG Tariff Rates</h1>
        </div>
        <p className="text-secondary-foreground/60 text-xs mt-1">
          Official electricity tariff tiers used for bill calculation
        </p>
      </div>

      <div className="px-5 mt-5 space-y-4">
        <TariffTable tiers={residentialTiers} title="Residential Tariffs" />
        <TariffTable tiers={commercialTiers} title="Commercial / Non-Residential Tariffs" />

        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <p className="text-xs text-foreground">
            <strong>Note:</strong> A service charge of GH₵ 5.16 applies to all bills. Rates are approximate
            and based on the latest published ECG tariff schedule.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tariffs;
