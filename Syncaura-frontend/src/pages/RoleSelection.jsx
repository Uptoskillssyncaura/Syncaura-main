import { ArrowLeft, ArrowRight, BriefcaseBusiness, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleSelection() {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  const roles = [
    {
      key: "employee",
      title: "Employee",
      description: "Access your employee dashboard and continue with your sign-in.",
      icon: BriefcaseBusiness,
      active: true,
      actionLabel: "Continue to Employee Login",
    },
    {
      key: "admin",
      title: "Admin",
      description: "Administrative access for team management and oversight.",
      icon: ShieldCheck,
      active: true,
      actionLabel: "Continue to Admin",
    },
    {
      key: "co-admin",
      title: "Co-Admin",
      description: "Co-administrative access for collaborative operations.",
      icon: Users,
      active: true,
      actionLabel: "Continue to Co-Admin",
    },
  ];

  return (
    <main
      data-theme={isDark ? "dark" : "light"}
      className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(115,251,253,0.16),_transparent_45%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-12 text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(115,251,253,0.2),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] dark:text-slate-100 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <section className="rounded-[32px] border border-slate-200/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70 sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-[#73FBFD]">
              Choose your role
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Select the access path that fits your role.
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Employee sign-in is available right away. Admin and Co-Admin options are currently being prepared for future release.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = role.active;

              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => {
                    // Navigate to the sign-in page and include role as a query param
                    if (role.key === "employee") navigate("/sign-in?role=employee");
                    if (role.key === "admin") navigate("/sign-in?role=admin");
                    if (role.key === "co-admin") navigate("/sign-in?role=co-admin");
                  }}
                  disabled={!isActive}
                  className={`group flex min-h-[260px] flex-col justify-between rounded-3xl border p-7 text-left transition-all duration-300 ${
                    isActive
                      ? "border-blue-200 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_20px_60px_rgba(37,99,235,0.28)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(37,99,235,0.34)]"
                      : "border-slate-200 bg-slate-50 text-slate-600 opacity-70 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                  }`}>
                  <div>
                    <div className={`mb-5 inline-flex rounded-2xl p-3 ${isActive ? "bg-white/20" : "bg-slate-200/80 dark:bg-slate-700/70"}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-semibold">{role.title}</h2>
                    <p className={`mt-3 text-sm leading-6 ${isActive ? "text-blue-50" : "text-slate-500 dark:text-slate-400"}`}>
                      {role.description}
                    </p>
                  </div>

                  <div className={`inline-flex items-center gap-2 text-sm font-semibold ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`}>
                    {role.actionLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
