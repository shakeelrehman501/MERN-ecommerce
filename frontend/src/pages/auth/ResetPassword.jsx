import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { resetPassword } from "@/api/authApi";

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

function ResetPassword() {
  const navigate = useNavigate();

  // Read sessionStorage only once
  const [email] = useState(() => sessionStorage.getItem("resetEmail"));

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", {
        replace: true,
      });
    }
  }, [email, navigate]);

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

    if (!formData.newPassword || !formData.confirmPassword) {
      return toast.error("All fields are required.");
    }

    if (formData.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters.");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const data = await resetPassword({
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(data.message);

      sessionStorage.removeItem("resetEmail");

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
            Reset Password
          </CardTitle>

          <CardDescription>
            Enter your new password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">
                  New Password
                </Label>

                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="py-4.5"
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex">
                    {showPassword ? (
                      <Eye
                        onClick={() => setShowPassword(false)}
                        className="w-5 h-5 text-gray-400 hover:cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(true)}
                        className="w-5 h-5 text-gray-400 hover:cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password
                </Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="py-4.5"
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex">
                    {showConfirmPassword ? (
                      <Eye
                        onClick={() => setShowConfirmPassword(false)}
                        className="w-5 h-5 text-gray-400 hover:cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowConfirmPassword(true)}
                        className="w-5 h-5 text-gray-400 hover:cursor-pointer"
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
                  Changing Password...
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

export default ResetPassword;