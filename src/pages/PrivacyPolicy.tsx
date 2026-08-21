import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Database, UserRound, History, Trash2 } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: "Information stored on your device",
      text: "Smart Bill Checker stores app data such as your profile details, settings and audit history in your browser's local storage. This lets the app remember your information on the same device and browser.",
    },
    {
      icon: UserRound,
      title: "Profile information",
      text: "If you edit your profile or choose a profile picture, that information is saved locally on your device. The app does not require you to create an online account to use these local features.",
    },
    {
      icon: History,
      title: "Audit information",
      text: "Meter readings, balances and calculated audit results may be stored locally so you can view your audit history. These values are used to perform the calculations you request.",
    },
    {
      icon: Trash2,
      title: "Removing your data",
      text: "You can remove locally stored data by clearing this site's browser storage. Some app actions, such as logging out, may also clear selected profile or settings information.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="bg-secondary px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-6 rounded-b-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-3"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <ShieldCheck size={26} className="text-primary" />
          <div>
            <h1 className="text-xl font-bold text-secondary-foreground font-display">
              Privacy Policy
            </h1>
            <p className="text-secondary-foreground/60 text-xs mt-1">
              How Smart Bill Checker handles your information
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-3 max-w-3xl mx-auto">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-xs leading-5 text-foreground">
            Smart Bill Checker is designed to perform electricity balance audits using information you provide. The current version mainly stores your app data locally in your browser.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                <section.icon size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground font-display">
                  {section.title}
                </h2>
                <p className="text-xs leading-5 text-muted-foreground mt-1">
                  {section.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="text-sm font-semibold text-foreground font-display mb-2">
            Camera and images
          </h2>
          <p className="text-xs leading-5 text-muted-foreground">
            If you use camera, meter scanning or profile image features, your browser may ask for permission. Access only happens after you grant permission. Review your browser or device settings if you want to change those permissions.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="text-sm font-semibold text-foreground font-display mb-2">
            About audit results
          </h2>
          <p className="text-xs leading-5 text-muted-foreground">
            Audit results are estimates based on the readings, balances, tariff values and deductions available to the app. They should be checked against official electricity provider records when needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
