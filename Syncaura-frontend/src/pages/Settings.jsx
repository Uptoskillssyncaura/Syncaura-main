import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tab from "../components/settings/TabStyle";

import AccountSecurity from "../components/settings/tabs/AccountSecurity";
import Theme from "../components/settings/tabs/Theme";
import Notifications from "../components/settings/tabs/Notifications";
import Subscription from "../components/settings/tabs/Subscription";
import PrivacyData from "../components/settings/tabs/PrivacyData";

const Settings = () => {
  const [currTab, setCurrTab] = useState("Account & Security");
  const [direction, setDirection] = useState(0);

  const tabData = [
    { title: "Account & Security" },
    { title: "Theme" },
    { title: "Notifications" },
    { title: "Subscription" },
    { title: "Privacy & Data" },
  ];

  const handleTabChange = (tab) => {
    const currentIndex = tabData.findIndex(t => t.title === currTab);
    const nextIndex = tabData.findIndex(t => t.title === tab);

    setDirection(nextIndex > currentIndex ? 1 : -1);
    setCurrTab(tab);
  };

  const tabComponents = {
    "Account & Security": AccountSecurity,
    Theme,
    Notifications,
    Subscription,
    "Privacy & Data": PrivacyData,
  };

  const ActiveComponent = tabComponents[currTab];

  return (
    <div className="w-full py-5 flex flex-col bg-white dark:bg-black mt-2 h-full">
      <div className="px-2 xl:px-6">

        <div className="px-5 py-2">
          <h1 className="font-bold text-3xl text-black dark:text-white">
            Settings
          </h1>
          <h2 className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          {tabData.map(({ title }, idx) => (
            <Tab
              key={idx}
              name={title}
              curr={currTab}
              setCurr={handleTabChange}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex-1">
          <div className="px-6 md:px-10">
            {ActiveComponent && <ActiveComponent />}
          </div>
      </div>
    </div>
  );
};

export default Settings;