import { useTranslation } from "react-i18next";

const Subscription = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl">

      {/* Section Title */}
      <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
        {t("subscriptionTab")} {/* ← was t("subscription") */}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
      {t("subscriptionDesc")}
      </p>
    </div>
  );
};

export default Subscription;
