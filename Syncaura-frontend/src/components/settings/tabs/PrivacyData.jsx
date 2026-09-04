import { useTranslation } from "react-i18next";

const PrivacyData = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl">

      <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
        {t("privacyData")}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("privacyDataDesc")}
      </p>

    </div>
  );
};

export default PrivacyData;
