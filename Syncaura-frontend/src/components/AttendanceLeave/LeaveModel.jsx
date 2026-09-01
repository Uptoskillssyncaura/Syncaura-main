import { AnimatePresence, motion } from "framer-motion"
import { FileText, X } from "lucide-react"
import MotionSelect from "../projects/Model/MotionSelect"
import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import api from "../../config/axios"

const leaveTypes = [
    "Casual Leave",
    "Sick Leave",
    "Emergency Leave",
    "Paid Leave",
    "Earned Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Work From Home",
    "Bereavement Leave",
    "Annual Leave",
    "Study Leave",
    "Festival Leave"
];

const LeaveModel = ({ onClose, setLeaveData, editingLeave = null, onSuccess = null }) => {
    const user = useSelector((state) => state.auth.user);
    const [submitting, setSubmitting] = useState(false);

    const getInitialLeaveType = () => {
        if (!editingLeave?.type && !editingLeave?.leave_type) return "Casual Leave";
        const t = editingLeave.type || editingLeave.leave_type;
        return t.toLowerCase().endsWith("leave") || t.toLowerCase() === "work from home" ? t : `${t} Leave`;
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            leaveType: getInitialLeaveType(),
            startDate: editingLeave?.startDate ? new Date(editingLeave.startDate).toISOString().split("T")[0] : "",
            endDate: editingLeave?.endDate ? new Date(editingLeave.endDate).toISOString().split("T")[0] : "",
            reason: editingLeave?.reason || "",
        },
    });

    useEffect(() => {
        reset({
            leaveType: getInitialLeaveType(),
            startDate: editingLeave?.startDate ? new Date(editingLeave.startDate).toISOString().split("T")[0] : "",
            endDate: editingLeave?.endDate ? new Date(editingLeave.endDate).toISOString().split("T")[0] : "",
            reason: editingLeave?.reason || "",
        });
    }, [editingLeave, reset]);

    const startDate = watch("startDate");
    const today = new Date().toISOString().split("T")[0];

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const userKey = user?.id || user?.email || "current-user";
            let responseData = null;

            if (editingLeave?.id) {
                // Editing existing pending leave
                const res = await api.put(`/leave/${editingLeave.id}`, {
                    fromDate: data.startDate,
                    toDate: data.endDate,
                    reason: data.reason,
                    leaveType: data.leaveType || "Casual Leave",
                });
                responseData = res.data?.data;
                toast.success("Leave request updated successfully");
            } else {
                // Applying new leave
                const res = await api.post("/leave/applyleave", {
                    fromDate: data.startDate,
                    toDate: data.endDate,
                    reason: data.reason,
                    leaveType: data.leaveType || "Casual Leave",
                });
                responseData = res.data?.data;
                toast.success("Leave request submitted successfully");
            }

            const currData = {
                id: responseData?.id || editingLeave?.id,
                startDate: new Date(`${data.startDate}T00:00:00Z`).toISOString(),
                endDate: new Date(`${data.endDate}T00:00:00Z`).toISOString(),
                from_date: new Date(`${data.startDate}T00:00:00Z`).toISOString(),
                to_date: new Date(`${data.endDate}T00:00:00Z`).toISOString(),
                type: data.leaveType || "Casual Leave",
                leave_type: data.leaveType || "Casual Leave",
                reason: data.reason,
                status: editingLeave ? editingLeave.status : "Pending",
                user_id: user?.id,
                userId: user?.id,
                user_name: user?.name || user?.email || "Employee",
                employee_name: user?.name || user?.email || "Employee",
                user_email: user?.email,
                appliedBy: userKey,
                isSelfLeave: true,
            };

            if (typeof setLeaveData === "function") {
                if (editingLeave) {
                    setLeaveData((prev) =>
                        prev.map((item) =>
                            item === editingLeave || (item.id && item.id === editingLeave.id)
                                ? { ...item, ...currData }
                                : item
                        )
                    );
                } else {
                    setLeaveData((prev) => [currData, ...prev]);
                }
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error submitting leave:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to submit leave request");
        } finally {
            setSubmitting(false);
        }
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
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center justify-center gap-3">
                            <FileText className="size-6 text-[#000000] dark:text-[#FFFFFF]" />
                            <h1 className="text-2xl font-medium text-[#000000] dark:text-[#F8F8F8]">
                                {editingLeave ? "Edit Leave Request" : "Apply For Leave"}
                            </h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white btn-hover cursor-pointer"
                        >
                            <X className="size-7" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col items-center justify-center gap-y-5 px-1 md:px-3 py-4">
                        <div className="flex flex-col w-full gap-1 items-start justify-center">
                            <h1 className="text-base font-medium w-full text-[#000000] dark:text-[#F8F8F8]">
                                Leave Type
                            </h1>
                            <div className="flex w-full rounded-xl px-1 md:px-3 py-1 dark:bg-[#2E2F2F]">
                                <Controller
                                    name="leaveType"
                                    control={control}
                                    rules={{ required: "Leave type is required" }}
                                    render={({ field }) => (
                                        <MotionSelect {...field} startVal={getInitialLeaveType()} options={leaveTypes} />
                                    )}
                                />
                                {errors.leaveType && (
                                    <p className="text-red-500 text-xs mt-1">{errors.leaveType.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex sm:flex-row flex-col flex-1/2 w-full gap-2">
                            <div className="flex flex-1/2 flex-col w-full gap-1">
                                <h2 className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                                    From Date
                                </h2>
                                <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-xl">
                                    <input
                                        type="date"
                                        min={editingLeave ? undefined : today}
                                        {...register("startDate", { required: "Start date is required" })}
                                        className="bg-transparent w-full date-input font-semibold outline-none text-[#898888] text-sm placeholder:text-[#898888]"
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-1/2 flex-col w-full gap-1">
                                <h2 className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                                    To Date
                                </h2>
                                <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-xl">
                                    <input
                                        type="date"
                                        min={startDate || (editingLeave ? undefined : today)}
                                        {...register("endDate", {
                                            required: "End date is required",
                                            validate: (value) =>
                                                !startDate || value >= startDate || "End date must be on or after start date",
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
                        <div className="flex flex-col w-full gap-1">
                            <h2 className="text-base font-medium text-[#000000] dark:text-[#FFFFFF]">
                                Reason / Details
                            </h2>
                            <div className="w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl">
                                <textarea
                                    {...register("reason", {
                                        required: "Reason is required",
                                        minLength: {
                                            value: 5,
                                            message: "Reason must be at least 5 characters",
                                        },
                                        maxLength: {
                                            value: 300,
                                            message: "Reason must not exceed 300 characters",
                                        },
                                    })}
                                    rows={3}
                                    placeholder="Briefly explain the reason for your leave request"
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
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex cursor-pointer items-center justify-center bg-[#2461E6] dark:bg-[#73FBFD] px-8 py-2.5 rounded-4xl btn-hover disabled:opacity-50"
                            >
                                <p className="dark:text-[#2E2F2F] text-[#FFFFFF] text-base lg:text-lg font-semibold">
                                    {submitting ? "Processing..." : editingLeave ? "Update Leave" : "Apply Leave"}
                                </p>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default LeaveModel