import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import Tab from "../components/settings/TabStyle";

import AccountSecurity from "../components/settings/tabs/AccountSecurity";
import Theme from "../components/settings/tabs/Theme";
import Notifications from "../components/settings/tabs/Notifications";
import Subscription from "../components/settings/tabs/Subscription";
import PrivacyData from "../components/settings/tabs/PrivacyData";

const Settings = () => {
  const { t } = useTranslation();

  const [currTab, setCurrTab] = useState("accountSecurity");
  const [direction, setDirection] = useState(0);

  const tabData = [
    { key: "accountSecurity", component: AccountSecurity },
    { key: "themeTab", component: Theme },
    { key: "notificationsTab", component: Notifications },
    { key: "subscriptionTab", component: Subscription },
    { key: "privacyData", component: PrivacyData },
  ];

  const handleTabChange = (tab) => {
    const currentIndex = tabData.findIndex((item) => item.key === currTab);
    const nextIndex = tabData.findIndex((item) => item.key === tab);

    setDirection(nextIndex > currentIndex ? 1 : -1);
    setCurrTab(tab);
  };

  const activeTab = tabData.find((tab) => tab.key === currTab);
  const ActiveComponent = activeTab?.component;

  return (
    <div className="w-full py-5 flex flex-col bg-white dark:bg-black mt-2 h-full">
      <div className="px-2 xl:px-6">
        <div className="px-5 py-2">
          <h1 className="font-bold text-3xl text-black dark:text-white">
            {t("settings")}
          </h1>

          <h2 className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            {t("settingsSubtitle")}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          {tabData.map(({ key }) => (
            <Tab
              key={key}
              name={t(key)}
              curr={currTab}
              tabKey={key}
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