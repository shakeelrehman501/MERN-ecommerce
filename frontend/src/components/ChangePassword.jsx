import { changePassword } from "@/api/authApi.js";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
  e.preventDefault();

  if (passwordLoading) return;

  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = passwordData;

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    toast.error("All password fields are required");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error(
      "New password and confirm password do not match",
    );
    return;
  }

  try {
    setPasswordLoading(true);

    const data = await changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    toast.success(data.message);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err) => {
        toast.error(err.message);
      });
    } else {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password",
      );
    }
  } finally {
    setPasswordLoading(false);
  }
};

  return (
    <form
      onSubmit={handlePasswordSubmit}
      className="space-y-4 shadow-md p-5 rounded-lg bg-white sm:w-100"
    >
      {/* Current Password */}
      <div>
        <Label className="block text-sm font-medium">Current Password</Label>

        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            placeholder="Enter your current password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 pr-12"
          />

          <button
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showCurrentPassword ? (
              <Eye className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <Label className="block text-sm font-medium">New Password</Label>

        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter your new password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 pr-12"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showNewPassword ? (
              <Eye className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div>
        <Label className="block text-sm font-medium">
          Confirm New Password
        </Label>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your new password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 pr-12"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <Eye className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={passwordLoading}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-lg"
      >
        {passwordLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Please wait
          </>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
};

export default ChangePassword;
