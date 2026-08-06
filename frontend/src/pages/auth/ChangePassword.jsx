import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { changePassword } from "@/api/authApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ChangePassword() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required.");
    }

    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const data = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success(data.message);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-pink-100 min-h-screen px-4">
      <Card className="w-full max-w-sm px-2 py-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold mb-4">
            Change Password
          </CardTitle>

          <CardDescription>
            Update your account password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">

              {/* Current Password */}
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>

                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="py-4.5"
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {showCurrentPassword ? (
                      <Eye
                        onClick={() => setShowCurrentPassword(false)}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowCurrentPassword(true)}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* New Password */}
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>

                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="py-4.5"
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {showNewPassword ? (
                      <Eye
                        onClick={() => setShowNewPassword(false)}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowNewPassword(true)}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="py-4.5"
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {showConfirmPassword ? (
                      <Eye
                        onClick={() => setShowConfirmPassword(false)}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowConfirmPassword(true)}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>

            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 bg-white border-none">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-500 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default ChangePassword;