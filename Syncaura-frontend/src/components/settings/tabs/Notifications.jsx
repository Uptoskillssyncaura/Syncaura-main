import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Mail,
  Video,
  ListTodo,
  MessageSquare,
  Volume2,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

const defaultPreferences = {
  taskAlerts: true,
  meetingReminders: true,
  chatMentions: true,
  emailDigests: false,
  soundAlerts: true,
};

const Notifications = () => {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem("syncaura_notif_prefs");
      return stored ? JSON.parse(stored) : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const handleToggle = (key) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("syncaura_notif_prefs", JSON.stringify(updated));
      return updated;
    });
    toast.success("Notification preferences updated", { autoClose: 1500 });
  };

  const notificationOptions = [
    {
      key: "taskAlerts",
      title: "Task Assignments & Deadlines",
      desc: "Receive alerts when tasks are assigned to you or nearing their due dates.",
      icon: ListTodo,
    },
    {
      key: "meetingReminders",
      title: "Meeting & Video Call Alerts",
      desc: "Get notified 10 minutes before scheduled meetings start.",
      icon: Video,
    },
    {
      key: "chatMentions",
      title: "Chat Mentions & Direct Messages",
      desc: "Notify when someone mentions @you in a channel or sends a direct message.",
      icon: MessageSquare,
    },
    {
      key: "emailDigests",
      title: "Weekly Email Digest",
      desc: "Summary report of completed tasks, attendance, and project updates sent to your email.",
      icon: Mail,
    },
    {
      key: "soundAlerts",
      title: "In-App Sound Effects",
      desc: "Play audio tones for incoming incoming chat and notification pings.",
      icon: Volume2,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="w-full rounded-2xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] p-6 sm:p-8 shadow-sm">
        <div className="border-b border-gray-200 dark:border-[#2A2A2A] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("notificationsTab") || "Notification Preferences"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Choose how and when you receive workspace alerts and updates.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {notificationOptions.map(({ key, title, desc, icon: IconComponent }) => {
            const isEnabled = !!prefs[key];
            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-[#222222] bg-gray-50/50 dark:bg-[#111111]/50 hover:border-gray-300 dark:hover:border-[#333333] transition-all"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="p-2 rounded-lg bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 mt-0.5">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEnabled
                      ? "bg-[#2461E6] dark:bg-[#73FBFD]"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isEnabled
                        ? "translate-x-5 dark:bg-black"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
