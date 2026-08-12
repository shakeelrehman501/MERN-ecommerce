import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { reVerifyEmail } from "@/api/authApi.js";

function CheckEmail() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const email = sessionStorage.getItem("verifyEmail");

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  const handleResendEmail = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const data = await reVerifyEmail({ email });

      toast.success(data.message);
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
    <div className="relative w-full min-h-screen flex items-center justify-center bg-pink-100">
      <div className="bg-white rounded-xl w-full max-w-120 h-full max-h-100 shadow-md mx-5">
        <div className="text-center px-10 py-8">
          <h1 className="text-2xl font-semibold text-green-500 mb-6">
            ✅ Check Your Email
          </h1>

          <p className="text-gray-500 text-sm">
            We've sent you an email to verify your account. Please check your
            inbox. If you don't receive the email, check your{" "}
            <strong className="font-extrabold text-gray-700">
              Spam folder and click the verification button
            </strong>
            .
          </p>

          {email && (
            <p className="mt-4 text-sm text-gray-600 font-medium break-all">
              {email}
            </p>
          )}

          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="mt-8 text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Resend Verification Email"
            )}
          </button>

          <div className="mt-8">
            <Link
              to="/login"
              className="text-pink-500 hover:underline font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;
