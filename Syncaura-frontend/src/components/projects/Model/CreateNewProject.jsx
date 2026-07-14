import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import MotionSelect from "./MotionSelect";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

const CreateNewProject = ({ onClose }) => {
  const teams = ["Design", "Development", "Marketing", "HR", "Sales"];

  const projectStatus = [
    "Backlog",
    "Planning",
    "Not Started",
    "In Progress",
    "Review",
    "Testing",
    "On Hold",
    "Completed",
    "Archived",
    "Cancelled",
  ];
  const members = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Jamie",
    "Avery",
  ];

  const owners = ["Alex Carter", "Jordan Miles", "Taylor Brooks"];

  const priorities = ["Low", "Medium", "High", "Critical"];
  const [selectPriority, setSelectPriority] = useState("Low");
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priority: "Low",
    },
  });
  const startDate = watch("startDate");
  const today = new Date().toISOString().split("T")[0];

  const onSubmit = (data) => {
    onClose();
  };

  const onError = (err) => {
    console.error("FORM ERRORS ", err);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          onClick={onClose}
          className="absolute inset-0 bg-black/60 dark:bg-white/10 backdrop-blur-xs "
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
               relative w-full max-w-md sm:max-w-3xl
               rounded-2xl
               bg-[#C8C6C6] dark:bg-[#000000]
               p-6 max-h-[90vh] overflow-y-auto no-scrollbar
             "
                >
                    <div className="flex flex-col w-full gap-5 ">
                        <div className="flex w-full items-center justify-between ">
                            <h1 className="text-2xl text-[#000000] dark:text-[#FFFFFF] font-bold">New Project</h1>
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-600 dark:text-[#898888] hover:text-black dark:hover:text-white btn-hover"
                            >
                                <X className="size-7" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col w-full gap-4 ">
                            <div className="flex flex-col w-full gap-1 ">
                                <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                    Project Name
                                </h2>
                                <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl">
                                    <input
                                        {...register("projectName", { required: true })}
                                        type="text"
                                        placeholder="eg: Website Redesign "
                                        className="bg-transparent font-semibold outline-none text-[#898888] text-sm placeholder:text-[#898888]"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-1 ">
                                <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                    Project Description
                                </h2>
                                <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl">
                                    <textarea
                                        {...register("description", { required: true })}
                                        type="text"
                                        rows={3}
                                        placeholder="briefly explain the project  "
                                        className="bg-transparent w-full font-semibold outline-none text-[#898888] text-sm placeholder:text-[#898888]"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex sm:flex-row flex-col w-full items-center gap-4 justify-start ">
                                <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                    <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                        Department/ Team
                                    </h2>
                                    <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-1 px-5 rounded-2xl">
                                        <Controller
                                            name="team"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <MotionSelect {...field} startVal="Select Team.." options={teams} />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                    <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                        Project Status
                                    </h2>
                                    <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-1 px-5 rounded-2xl">
                                        <Controller
                                            name="status"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <MotionSelect {...field} startVal="Select Project Status.." options={projectStatus} />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex sm:flex-row flex-col w-full items-center gap-4 justify-start ">
                                <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                    <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                        Priority
                                    </h2>
                                    <div className="relative w-full flex rounded-2xl overflow-hidden bg-[#FFFFFF] dark:bg-[#2E2F2F] ">
                                        <input type="hidden" {...register("priority")} value={selectPriority} />
                                        {priorities.map((item, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectPriority(item)}
                                                className="relative flex-1 cursor-pointer"
                                            >
                                                {/* Animated background */}
                                                {selectPriority === item && (
                                                    <motion.div
                                                        layoutId="priority-bg"
                                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                        className="absolute inset-0 bg-[#2B5EBD] dark:bg-[#73FBFD]"
                                                    />
                                                )}

                        {/* Text */}
                        <div
                          className={`
          relative z-10 py-2 text-center text-base font-semibold transition-colors
          ${selectPriority === item ? "text-white dark:text-[#000000] border-[#2B5EBD] dark:border-[#73FBFD]" : "text-black dark:text-[#898888] border-black"}
          ${idx !== priorities.length - 1 ? "border-r " : ""}
        `}
                                                >
                                                    {item}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                                <div className="flex sm:flex-row flex-col flex-1/2  w-full gap-2 ">
                                    <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                        <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                            Start Date
                                        </h2>
                                        <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl">
                                            <input
                                                type="date"
                                                min={today}
                                                {...register("startDate", { required: true })}

                                                className="bg-transparent w-full date-input font-semibold outline-none text-[#898888] text-sm placeholder:text-[#898888]"
                                            />
                                        </div>

                                    </div>
                                    <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                        <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                            End Date
                                        </h2>
                                        <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl">
                                            <input
                                                type="date"
                                                min={startDate || today}
                                                {...register("endDate", {
                                                    required: "End date is required",
                                                    validate: (value) =>
                                                        !startDate || value > startDate || "End date must be after start date",
                                                })}


                                                className="bg-transparent w-full date-input font-semibold outline-none text-[#898888] text-sm placeholder:text-[#898888]"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="flex sm:flex-row flex-col w-full items-center gap-4 justify-start ">
                                <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                    <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                                        Add Members
                                    </h2>
                                    <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-1 px-5 rounded-2xl">
                                        <Controller
                                            name="members"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <MotionSelect {...field} startVal="Select Members.." options={members} />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                    <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF] ">
                                        Project Owner
                                    </h2>
                                    <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-1 px-5 rounded-2xl">
                                        <Controller
                                            name="owner"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <MotionSelect {...field} startVal="Select owner.." options={owners} />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end w-full">
                                <div className="flex items-center justify-center gap-5 ">
                                    <div className="flex items-center justify-center ">
                                        <button type="button" className="text-[#000000] dark:text-[#FFFFFF] text-base font-medium hover:underline btn-hover" onClick={onClose} >Cancel</button>
                                    </div>
                                    <button type="submit" className="flex items-center justify-center hover:bg-[#4277eb] bg-[#2461E6] rounded-3xl px-5 py-1.5 dark:bg-[#73FBFD] dark:hover:bg-[#14d3d6] btn-hover">
                                        <p className=" text-[#EDEDED] dark:text-[#000000] text-base font-semibold" >Create Project</p>
                                    </button>

                                </div>
                            </div>
                        </form>
                    </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateNewProject;
