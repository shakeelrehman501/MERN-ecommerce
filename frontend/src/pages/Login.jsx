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
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const inputData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/login`, formData,
      );
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-pink-100 min-h-screen">
      <Card className="w-full max-w-sm px-2 py-6">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter the details below to create your account
          </CardDescription>
        </CardHeader>
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
                onChange={inputData}
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
                  placeholder="Enter a password"
                  type={`${showPassword ? "text" : "password"}`}
                  required
                  value={formData.password}
                  onChange={inputData}
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
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 bg-white border-none">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full h-10 bg-blue-600 hover:bg-blue-500 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Please wait!
              </>
            ) : (
              "Login Up"
            )}
          </Button>
          <p className="text-[16px] pt-2">Don't have an account? <Link to={"/signup"} className="text-pink-500 hover:underline">Sign up</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
