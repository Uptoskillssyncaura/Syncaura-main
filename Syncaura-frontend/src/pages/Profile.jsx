import React from 'react';
import { useTranslation } from 'react-i18next';
import ProfileSettings from '../components/settings/tabs/Profile';

export default function Profile() {
  const { t } = useTranslation();

  return (
    <div className="w-full py-5 flex flex-col bg-white dark:bg-black mt-2 h-full">
      <div className="px-5 sm:px-8 py-2 mb-4">
        <h1 className="font-bold text-3xl text-black dark:text-white">
          {t("myProfile") || "My Profile"}
        </h1>
        <h2 className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
          {t("profileSubtitle") || "View and manage your personal details, activity, and preferences"}
        </h2>
      </div>
      
      <div className="px-4 sm:px-8 flex-1">
        <ProfileSettings />
      </div>
    </div>
  );
}