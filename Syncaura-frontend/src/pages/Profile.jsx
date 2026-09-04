import React from 'react';
import ProfileSettings from '../components/settings/tabs/Profile';

export default function Profile() {
  return (
    <div className="w-full py-5 flex flex-col bg-white dark:bg-black mt-2 h-full">
      <div className="px-5 py-2 mb-4">
        <h1 className="font-bold text-3xl text-black dark:text-white">
          My Profile
        </h1>
        <h2 className="text-lg text-gray-500 dark:text-gray-400 mt-1">
          View and manage your profile details
        </h2>
      </div>
      
      <div className="px-6 md:px-10 flex-1">
        <ProfileSettings />
      </div>
    </div>
  );
}