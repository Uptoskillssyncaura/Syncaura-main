import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Camera } from "lucide-react";
import { updateUserProfile } from "../../redux/features/authThunks";
import { toast } from "react-toastify";
import { updateFrontendProfilePhoto } from "../../redux/slices/authSlice";

export default function MyProfileModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user, profileLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    phone: "",
    language: "en"
  });

  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        language: user.language || "en"
      });
      setProfilePic(user.profilePic || user.profile_pic || null);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file.");
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        profile_pic: profilePic
      };
      await dispatch(updateUserProfile(payload)).unwrap();
      if (profilePic) {
        dispatch(updateFrontendProfilePhoto(profilePic));
      }
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#2E2F2F] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-black dark:text-white">My Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white btn-hover">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative size-24 rounded-full overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {(formData.first_name || formData.name || "U").charAt(0).toUpperCase()}
                </span>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                <Camera size={28} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click image to upload</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#1C1C1C] text-black dark:text-white outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#1C1C1C] text-black dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#1C1C1C] text-black dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#1C1C1C] text-black dark:text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors btn-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileLoading}
              className="px-6 py-2 bg-[#007AFF] hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
