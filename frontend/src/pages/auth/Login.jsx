import { useState } from "react";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { login } from "@/api/authApi.js";
import { setUser } from "@/redux/userSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const data = await login(formData);

      dispatch(
        setUser({
          user: data.user,
          accessToken: data.accessToken,
        }),
      );

      toast.success(data.message);

      navigate("/");
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
            Login your account
          </CardTitle>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="font-semibold mb-2">Admin Demo Account</p>
            <p className="mb-2 text-gray-700">
              Use this account for admin access.
            </p>

            <div className="space-y-1">
              <p>
                <strong>Email:</strong> shakeeldeveloper501@gmail.com
              </p>
              <p>
                <strong>Password:</strong> Admin@12345
              </p>
            </div>
          </div>

          <CardDescription>
            Enter the details below to login your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="py-4.5"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a password"
                    required
                    value={formData.password}
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

                <div className="-mt-1 text-end">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Forgot Password?
                  </Link>
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
                  Please wait!
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-[16px] pt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;
