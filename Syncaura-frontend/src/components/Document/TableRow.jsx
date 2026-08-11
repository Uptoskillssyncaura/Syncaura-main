import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const TableRow = ({ name, type, version, date, status, docColor }) => {
  const { t } = useTranslation();
  function formatDateYYYYMMDD(isoDate) {
    return new Date(isoDate).toISOString().split("T")[0];
  }

  const statusColor = {
    Final: "bg-[#DCFCE7] text-[#29CC39]",
    Draft: "bg-[#FEF9C3] text-[#954D4E]",
    Revised: "bg-[#DBEAFE] text-[#3053B4]",
  };

  return (
    <>
      <div className="hidden md:flex items-center justify-center w-full px-10">
        <div className="flex items-center gap-5 w-full flex-4/13">
          <FileText className={`size-8 ${docColor}`} />
          <h1 className="text-base font-medium text-black dark:text-[#FFFFFF]">{name}</h1>
        </div>

        <div className="flex-2/13 w-full">
          <h1 className="uppercase text-base text-black font-medium dark:text-[#FFFFFF]">{type}</h1>
        </div>

        <div className="flex-2/13 w-full">
          <h1 className="text-base font-medium text-black dark:text-white">{version}</h1>
        </div>

        <div className="flex-2/13 w-full">
          <h1 className="text-base font-medium text-black dark:text-white">
            {formatDateYYYYMMDD(date)}
          </h1>
        </div>

        <div className="flex-2/13 w-full flex items-center justify-center">
          <div
            className={`w-25 flex items-center justify-center py-1.5 rounded-md text-sm font-medium  ${statusColor[status]}`}
          >
            {status}
          </div>
        </div>

        <div className="flex-1/13 w-full flex justify-end">
          <button className="text-[#2461E6] hover:underline font-medium btn-hover">
            Edit
          </button>
        </div>
      </div>

      <div className="md:hidden w-full px-4">
        <div className="flex flex-col gap-3 rounded-xl border bg-white dark:bg-black p-4 shadow-sm">
        
          <div className="flex items-center gap-3">
            <FileText className={`size-7 ${docColor}`} />
            <h1 className="font-semibold text-black dark:text-white text-sm break-all">
              {name}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">{t("documents_type")}</p>
              <p className="font-medium uppercase text-black dark:text-white">{type}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("documents_version")}</p>
              <p className="font-medium text-black dark:text-white">{version}</p>
            </div>

            <div>
              <p className="text-gray-500">{t("documents_lastModified")}</p>
              <p className="font-medium text-black dark:text-white">
                {formatDateYYYYMMDD(date)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">{t("status")}</p>
              <span
                className={`inline-block px-5 py-1 mt-2 rounded-md text-xs font-medium ${statusColor[status]}`}
              >
                {status}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button className="text-sm font-medium text-[#2461E6] hover:underline btn-hover">
              {t("edit")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableRow;
