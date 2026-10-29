import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import MotionSelect from "./MotionSelect";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const CreateNewProject = ({ onClose, onAddProject }) => {
  const teams = ["Design", "Development", "Marketing", "HR", "Sales"];

  const initialProjectStatuses = [
    "Not Started",
    "Planning",
    "Backlog",
  ];

  const priorities = ["Low", "Medium", "High", "Critical"];
  const [selectPriority, setSelectPriority] = useState("Low");
  const [submitting, setSubmitting] = useState(false);

  // Dynamic users from database
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    setLoadingUsers(true);
    setUserError(null);
    api
      .get("/users/all")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUsersList(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load users from database:", err);
        setUserError(
          err.response?.data?.message || "Failed to load users from database"
        );
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "Not Started",
      priority: "Low",
      members: [],
    },
  });
  const startDate = watch("startDate");
  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const selectedMembers = Array.isArray(data.members)
        ? data.members
        : [data.members].filter(Boolean);
      const memberAvatars = selectedMembers.map((m) => {
        if (typeof m === "object" && m.profile_pic) return m.profile_pic;
        return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
      });

      const ownerId =
        data.owner && typeof data.owner === "object"
          ? data.owner.id
          : data.owner;

      const memberIds = (
        Array.isArray(data.members) ? data.members : [data.members].filter(Boolean)
      ).map((m) => (typeof m === "object" ? m.id : m));

      const selectedStatus = data.status || "Not Started";

      const response = await api.post("/projects", {
        name: data.projectName,
        description: data.description || data.team,
        status: selectedStatus,
        owner_id: ownerId,
        members: memberIds,
      });
      const createdProject = response.data;

      const newProject = {
        id: createdProject?.id || Date.now(),
        title: createdProject?.name || data.projectName,
        department: data.team || "General",
        priority: selectedStatus,
        progress: selectedStatus === "Completed" ? 100 : 0,
        dueDate: data.endDate || createdProject?.created_at,
        avatars: memberAvatars,
        owner: createdProject?.owner || (typeof data.owner === "object" ? data.owner : null),
        members: createdProject?.members || selectedMembers,
      };

      if (onAddProject) {
        onAddProject(newProject);
      }
      toast.success(`Project "${data.projectName}" created successfully!`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (formErrors) => {
    console.error("FORM ERRORS ", formErrors);
    const firstErrorMessage =
      Object.values(formErrors)[0]?.message ||
      "Please fill in all required fields.";
    toast.error(firstErrorMessage);
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
          className="absolute inset-0 bg-black/60 dark:bg-white/10 backdrop-blur-xs"
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
               bg-[#C8C6C6] dark:bg-[#1E1E1E]
               p-6 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl
             "
        >
          <div className="flex flex-col w-full gap-5">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-2xl text-[#000000] dark:text-[#FFFFFF] font-bold">
                New Project
              </h1>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-600 dark:text-[#898888] hover:text-black dark:hover:text-white btn-hover cursor-pointer"
              >
                <X className="size-7" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="flex flex-col w-full gap-4"
            >
              {/* Project Name */}
              <div className="flex flex-col w-full gap-1">
                <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                  Project Name <span className="text-red-500">*</span>
                </h2>
                <div
                  className={`w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl border ${
                    errors.projectName ? "border-red-500" : "border-transparent"
                  }`}
                >
                  <input
                    {...register("projectName", {
                      required: "Project name is required",
                    })}
                    type="text"
                    placeholder="eg: Website Redesign"
                    className="bg-transparent w-full font-semibold outline-none text-[#1A1A1A] dark:text-[#FFFFFF] text-sm placeholder:text-[#898888]"
                  />
                </div>
                {errors.projectName && (
                  <span className="text-xs text-red-500 font-medium px-2">
                    {errors.projectName.message}
                  </span>
                )}
              </div>

              {/* Project Description */}
              <div className="flex flex-col w-full gap-1">
                <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                  Project Description <span className="text-red-500">*</span>
                </h2>
                <div
                  className={`w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl border ${
                    errors.description ? "border-red-500" : "border-transparent"
                  }`}
                >
                  <textarea
                    {...register("description", {
                      required: "Project description is required",
                    })}
                    rows={3}
                    placeholder="briefly explain the project"
                    className="bg-transparent w-full font-semibold outline-none text-[#1A1A1A] dark:text-[#FFFFFF] text-sm placeholder:text-[#898888]"
                  ></textarea>
                </div>
                {errors.description && (
                  <span className="text-xs text-red-500 font-medium px-2">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Department & Status */}
              <div className="flex sm:flex-row flex-col w-full items-start gap-4 justify-start">
                <div className="flex flex-1/2 flex-col w-full gap-1">
                  <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                    Department/ Team <span className="text-red-500">*</span>
                  </h2>
                  <Controller
                    name="team"
                    control={control}
                    rules={{ required: "Department/Team is required" }}
                    render={({ field }) => (
                      <MotionSelect
                        {...field}
                        startVal="Select Team.."
                        options={teams}
                        hasError={Boolean(errors.team)}
                      />
                    )}
                  />
                  {errors.team && (
                    <span className="text-xs text-red-500 font-medium px-2">
                      {errors.team.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-1/2 flex-col w-full gap-1">
                  <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                    Project Status <span className="text-red-500">*</span>
                  </h2>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Project status is required" }}
                    render={({ field }) => (
                      <MotionSelect
                        {...field}
                        startVal="Not Started"
                        options={initialProjectStatuses}
                        hasError={Boolean(errors.status)}
                      />
                    )}
                  />
                  {errors.status && (
                    <span className="text-xs text-red-500 font-medium px-2">
                      {errors.status.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Priority & Dates */}
              <div className="flex sm:flex-row flex-col w-full items-start gap-4 justify-start">
                <div className="flex flex-1/2 flex-col w-full gap-1">
                  <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                    Priority
                  </h2>
                  <div className="relative w-full flex rounded-2xl overflow-hidden bg-[#FFFFFF] dark:bg-[#2E2F2F]">
                    <input
                      type="hidden"
                      {...register("priority")}
                      value={selectPriority}
                    />
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
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                            className="absolute inset-0 bg-[#2B5EBD] dark:bg-[#73FBFD]"
                          />
                        )}

                        {/* Text */}
                        <div
                          className={`
                            relative z-10 py-2 text-center text-base font-semibold transition-colors
                            ${
                              selectPriority === item
                                ? "text-white dark:text-[#000000] border-[#2B5EBD] dark:border-[#73FBFD]"
                                : "text-black dark:text-[#898888] border-black"
                            }
                            ${idx !== priorities.length - 1 ? "border-r" : ""}
                          `}
                        >
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col flex-1/2 w-full gap-2">
                  <div className="flex flex-1/2 flex-col w-full gap-1">
                    <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                      Start Date <span className="text-red-500">*</span>
                    </h2>
                    <div
                      className={`w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl border ${
                        errors.startDate
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    >
                      <input
                        type="date"
                        {...register("startDate", {
                          required: "Start date is required",
                        })}
                        className="bg-transparent w-full date-input font-semibold outline-none text-[#1A1A1A] dark:text-[#FFFFFF] text-sm placeholder:text-[#898888]"
                      />
                    </div>
                    {errors.startDate && (
                      <span className="text-xs text-red-500 font-medium px-2">
                        {errors.startDate.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1/2 flex-col w-full gap-1">
                    <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                      End Date <span className="text-red-500">*</span>
                    </h2>
                    <div
                      className={`w-full bg-[#FFFFFF] dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl border ${
                        errors.endDate
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    >
                      <input
                        type="date"
                        min={startDate || today}
                        {...register("endDate", {
                          required: "End date is required",
                          validate: (value) =>
                            !startDate ||
                            value >= startDate ||
                            "End date must be on or after start date",
                        })}
                        className="bg-transparent w-full date-input font-semibold outline-none text-[#1A1A1A] dark:text-[#FFFFFF] text-sm placeholder:text-[#898888]"
                      />
                    </div>
                    {errors.endDate && (
                      <span className="text-xs text-red-500 font-medium px-2">
                        {errors.endDate.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Members & Owner */}
              <div className="flex sm:flex-row flex-col w-full items-start gap-4 justify-start">
                <div className="flex flex-1/2 flex-col w-full gap-1">
                  <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                    Add Members <span className="text-red-500">*</span>
                  </h2>
                  <Controller
                    name="members"
                    control={control}
                    rules={{
                      validate: (val) =>
                        (Array.isArray(val) && val.length > 0) ||
                        Boolean(val) ||
                        "Please add at least one member",
                    }}
                    render={({ field }) => (
                      <MotionSelect
                        {...field}
                        startVal="Select Members.."
                        options={usersList}
                        loading={loadingUsers}
                        error={userError}
                        searchable
                        multiple
                        hasError={Boolean(errors.members)}
                        searchPlaceholder="Search members by name or email..."
                      />
                    )}
                  />
                  {errors.members && (
                    <span className="text-xs text-red-500 font-medium px-2">
                      {errors.members.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-1/2 flex-col w-full gap-1">
                  <h2 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
                    Project Owner <span className="text-red-500">*</span>
                  </h2>
                  <Controller
                    name="owner"
                    control={control}
                    rules={{ required: "Project owner is required" }}
                    render={({ field }) => (
                      <MotionSelect
                        {...field}
                        startVal="Select owner.."
                        options={usersList}
                        loading={loadingUsers}
                        error={userError}
                        searchable
                        hasError={Boolean(errors.owner)}
                        searchPlaceholder="Search owner by name or email..."
                      />
                    )}
                  />
                  {errors.owner && (
                    <span className="text-xs text-red-500 font-medium px-2">
                      {errors.owner.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end w-full mt-2">
                <div className="flex items-center justify-center gap-5">
                  <button
                    type="button"
                    className="text-[#000000] dark:text-[#FFFFFF] text-base font-medium hover:underline btn-hover cursor-pointer"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center hover:bg-[#4277eb] bg-[#2461E6] rounded-3xl px-6 py-2 dark:bg-[#73FBFD] dark:hover:bg-[#14d3d6] btn-hover cursor-pointer transition-all disabled:opacity-50"
                  >
                    <p className="text-[#EDEDED] dark:text-[#000000] text-base font-semibold">
                      {submitting ? "Creating..." : "Create Project"}
                    </p>
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

