import { useTranslation } from "react-i18next";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  CreditCard,
  ShieldCheck,
  Building2,
  HardDrive,
  Users,
  Video,
} from "lucide-react";
import { useSelector } from "react-redux";

const Subscription = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const userRole = (user?.role || "user").toUpperCase();

  const features = [
    { name: "Unlimited Projects & Task Management", icon: CheckCircle2 },
    { name: "High-Definition Video Meetings & Screen Sharing", icon: Video },
    { name: "Real-time Workspace Channels & Direct Chat", icon: Users },
    { name: "50 GB Cloud Document & Asset Storage", icon: HardDrive },
    { name: "Custom Roles, Audit Logs & Co-Admin Delegations", icon: ShieldCheck },
    { name: "24/7 Priority Support & 99.9% Uptime SLA", icon: Zap },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Current Plan Overview Banner */}
      <div className="w-full rounded-2xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[#2A2A2A]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CURRENT PLAN
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Flowbit Workspace Enterprise
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your organization account is active with full features enabled.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Active</span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Auto-renewing</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="pt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Included in your plan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {features.map(({ name, icon: IconComponent }, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-[#222222] bg-gray-50/50 dark:bg-[#111111]/50"
              >
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD]">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organization Billing Details */}
      <div className="w-full rounded-2xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Workspace Billing & License
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Managed centrally by Workspace Administrators ({userRole})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <CreditCard className="w-4 h-4" />
            Invoice Billed
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
