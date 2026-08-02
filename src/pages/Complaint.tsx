import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Copy, Check } from "lucide-react";

const Complaint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as any;
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [accountNo, setAccountNo] = useState("");

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">No billing data. Please verify a bill first.</p>
      </div>
    );
  }

  const diff = Math.abs(parseFloat(data.difference));

  const complaintText = `
Dear Sir/Madam,

I am writing to formally dispute my electricity bill.

Customer Name: ${name || "[Your Name]"}
Address: ${address || "[Your Address]"}
Account Number: ${accountNo || "[Account Number]"}

Billing Period Details:
- Previous Reading: ${data.previousReading} kWh
- Current Reading: ${data.currentReading} kWh
- Total Consumption: ${data.consumption} kWh

Bill Comparison:
- ECG Billed Amount: GH₵ ${data.ecgBill}
- Expected Amount (based on PURC tariffs): GH₵ ${data.expectedBill}
- Overcharge Amount: GH₵ ${diff.toFixed(2)}

I kindly request that this discrepancy be investigated and the appropriate adjustments be made to my account.

Thank you for your prompt attention.

Sincerely,
${name || "[Your Name]"}
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="bg-destructive/10 px-5 pt-12 pb-6 rounded-b-3xl border-b border-destructive/20">
        <button onClick={() => navigate(-1)} className="text-foreground/70 text-sm mb-2 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2">
          <FileText className="text-destructive" size={22} />
          <h1 className="text-xl font-bold text-foreground font-display">Complaint Letter</h1>
        </div>
        <p className="text-muted-foreground text-xs mt-1">Auto-generated dispute letter for ECG</p>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* User Details */}
        <input
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="ECG Account Number"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Generated Letter */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <pre className="text-xs text-foreground whitespace-pre-wrap font-body leading-relaxed">
            {complaintText}
          </pre>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center gap-2 font-display font-bold text-sm"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </motion.button>
      </div>
    </div>
  );
};

export default Complaint;
