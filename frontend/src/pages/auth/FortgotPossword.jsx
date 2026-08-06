import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { forgotPassword } from "../../api/authApi";

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

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const data = await forgotPassword({
        email: normalizedEmail,
      });

      sessionStorage.setItem("resetEmail", normalizedEmail);

      toast.success(data.message);

      navigate("/verify-otp");
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
            Forgot Password
          </CardTitle>

          <CardDescription>
            Enter your registered email address and we'll send you an OTP.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-4.5"
                required
              />
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
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default ForgotPassword;