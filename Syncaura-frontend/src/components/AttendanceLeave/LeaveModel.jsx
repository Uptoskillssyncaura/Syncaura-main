import { AnimatePresence, motion } from "framer-motion"
import { FileText, X } from "lucide-react"
import MotionSelect from "../projects/Model/MotionSelect"
import { Controller, useForm } from "react-hook-form"

const LeaveModel = ({ onClose, setHistory }) => {

    const leaveTypes = [
        "Casual",
        "Sick",
        "Earned",
        "Paid",
        "Unpaid",
        "Maternity",
        "Paternity",
        "Marriage",
        "Bereavement",
        "Annual",
        "Study",
        "Work From Home",
        "Emergency",
        "Festival"
    ];


    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
    });
    const startDate = watch("startDate");
    const today = new Date().toISOString().split("T")[0];

    const onSubmit = (data) => {
        const currData = {
            startDate: new Date(`${data["startDate"]}T00:00:00Z`).toISOString(),
            endDate: new Date(`${data["endDate"]}T00:00:00Z`).toISOString(),
            type: data["leaveType"],
            reason: data["reason"],
            status: "Pending"
        }
        setHistory((prev)=>[currData, ...prev])


        onClose();
    };

    const onError = (err) => {
        console.error("FORM ERRORS ", err);
    };


    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center px-4  "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 dark:bg-white/10 backdrop-blur-xs"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 30, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="
            relative w-full max-w-md sm:max-w-lg
            rounded-2xl
            bg-[#f0f0f0] dark:bg-[#000000]
            p-6 shadow-2xl
          "
                >
                    {/* Close */}
                    <div className="flex items-center justify-between w-full ">
                        <div className="flex items-center justify-center gap-3  ">
                            <FileText className="size-6 text-[#000000] dark:text-[#FFFFFF]" />
                            <h1 className="text-2xl font-medium text-[#000000] dark:text-[#F8F8F8]" >Apply Leave</h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white btn-hover"
                        >
                            <X className="size-7" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col items-center justify-center gap-y-5 px-1 md:px-3 py-4" >
                        <div className="flex flex-col w-full gap-1 items-start justify-center ">
                            <h1 className="text-base font-medium w-full text-[#000000] dark:text-[#F8F8F8]">
                                Leave Type
                            </h1>
                            <div className="flex w-full rounded-xl px-1 md:px-3 py-1 dark:bg-[#2E2F2F] ">
                                <Controller
                                    name="leaveType"
                                    control={control}
                                    rules={{ required: "Leave type is required" }}
                                    render={({ field }) => (
                                        <MotionSelect {...field} startVal="Casual Leave" options={leaveTypes} />
                                    )}
                                />
                                {errors.leaveType && (
                                    <p className="text-red-500 text-xs mt-1">{errors.leaveType.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex sm:flex-row flex-col flex-1/2  w-full gap-2 ">
                            <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                <h2 className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                                    From
                                </h2>
                                <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-xl">
                                    <input
                                        type="date"
                                        min={today}
                                        {...register("startDate", { required: "Start date is required" })}

                                        className="bg-transparent w-full date-input font-semibold outline-none text-[#898888] text-sm placeholder:text-[#898888]"
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
                                    )}
                                </div>

                            </div>
                            <div className="flex flex-1/2 flex-col w-full gap-1 ">
                                <h2 className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                                    To
                                </h2>
                                <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-xl">
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
                                    {errors.endDate && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.endDate.message}
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-1 ">
                            <h2 className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                                Reason
                            </h2>
                            <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl">
                                <textarea
                                    {...register("reason", {
                                        required: "Reason is required",
                                        minLength: {
                                            value: 10,
                                            message: "Reason must be at least 10 characters",
                                        },
                                        maxLength: {
                                            value: 200,
                                            message: "Reason must not exceed 200 characters",
                                        },
                                    })}
                                    rows={3}
                                    placeholder="Briefly explain the reason"
                                    className="bg-transparent w-full font-semibold outline-none text-[#898888] text-sm placeholder:text-[#898888]"
                                ></textarea>
                                {errors.reason && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.reason.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center mt-5 w-full">
                            <button type="submit" className="flex cursor-pointer items-center justify-center bg-[#2461E6] dark:bg-[#73FBFD] px-7 py-2 rounded-4xl btn-hover">
                                <p className="dark:text-[#2E2F2F] text-[#FFFFFF] text-lg font-medium" >Apply Leave</p>
                            </button>
                        </div>

                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default LeaveModel