import React, { useEffect, useState } from "react";
import { Camera, Eye, EyeOff, User } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FileUploader } from "../../components/FileUploader";
import { ProfileSkeleton } from "../../components/shimmer/ProfileSkeleton";
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/api/profileApi";

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("edit-profile");

  const { data, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Works whether the API returns { data: {...} } or the profile directly
  const profile = data?.data ?? data;

  const [name, setName] = useState("");
  const [initialized, setInitialized] = useState(false);

  const [avatar, setAvatar] = useState(""); // local blob preview
  const [avatarFile, setAvatarFile] = useState(null);
  const [loadedSrc, setLoadedSrc] = useState(""); // last src that finished loading
  const [picVersion, setPicVersion] = useState(Date.now()); // cache buster

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fill the name once when profile data arrives
  useEffect(() => {
    if (profile && !initialized) {
      setName(profile.fullName || "");
      setInitialized(true);
    }
  }, [profile, initialized]);

  // Free the blob URL when it is replaced or on unmount
  useEffect(() => {
    return () => {
      if (avatar) URL.revokeObjectURL(avatar);
    };
  }, [avatar]);

  const serverPicture = profile?.picture
    ? `${profile.picture}${profile.picture.includes("?") ? "&" : "?"}v=${picVersion}`
    : "";
  const imageSrc = avatar || serverPicture;
  const imageLoaded = loadedSrc === imageSrc;

  const handleAvatarSelect = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large. Max 2MB allowed.");
    }
    setAvatar(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, profileImage: avatarFile }).unwrap();
      toast.success("Profile updated successfully!");
      setAvatarFile(null);
      setAvatar("");
      setPicVersion(Date.now()); // force the browser to reload the new picture
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    try {
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmNewPassword: passwords.newPassword
      }).unwrap();
      toast.success("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password.");
    }
  };

  // Guards (after all hooks)
  if (isLoading) return <ProfileSkeleton />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load profile. Please try again.
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No profile data found.
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:pt-20 font-sans text-slate-800">
      <ToastContainer theme="colored" />

      {/* Profile Header */}
      <div className="w-full max-w-200 bg-[#F7B115] rounded-[2.5rem] p-8 mb-10 relative flex flex-col items-center shadow-xl">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200 relative ${
              isUpdatingProfile ? "opacity-50" : ""
            }`}
          >
            {imageSrc ? (
              <>
                {!imageLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#F7B115] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <img
                  key={imageSrc}
                  src={imageSrc}
                  alt="Profile"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                  onLoad={() => setLoadedSrc(imageSrc)}
                  onError={() => setLoadedSrc(imageSrc)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <User size={40} />
              </div>
            )}
          </div>

          <FileUploader onFileSelect={handleAvatarSelect} accept="image/*">
            <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer">
              <Camera size={16} />
            </div>
          </FileUploader>
        </div>

        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-white">{name}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 mb-8 border-b w-full max-w-125 justify-center">
        {["edit-profile", "change-password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-bold capitalize ${
              activeTab === tab
                ? "text-[#F7B115] border-b-2 border-[#F7B115]"
                : "text-gray-400"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="w-full max-w-125">
        {activeTab === "edit-profile" ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <FormInput
              label="Full Name"
              icon={<User size={18} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-4 bg-[#F7B115] text-white rounded-2xl font-bold disabled:opacity-60"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <PasswordInput
              label="Current Password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />
            <PasswordInput
              label="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
            <PasswordInput
              label="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-4 bg-[#F7B115] text-white rounded-2xl font-bold disabled:opacity-60"
            >
              {isChangingPassword ? "Saving..." : "Save & Change"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, icon, readOnly }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full p-4 pl-12 rounded-xl border ${
            readOnly ? "bg-gray-100" : "bg-white"
          }`}
        />
        <div className="absolute left-4 inset-y-0 flex items-center text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full p-4 rounded-xl border"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 inset-y-0"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}