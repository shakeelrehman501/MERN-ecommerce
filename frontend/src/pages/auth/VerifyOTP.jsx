
import { verifyOTP } from "@/api/authApi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


function VerifyOTP() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
   const email = sessionStorage.getItem("resetEmail");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const inputRefs = useRef([]);

  // ====================
  // Check Email
  // ====================

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // ====================
  // Handle OTP Change
  // ====================

  const handleChange = (value, index) => {
    // Only numbers allowed
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    // Only keep last entered digit
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    // Move to next input
    if (
      value &&
      index < otp.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ====================
  // Handle Backspace
  // ====================

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ====================
  // Paste OTP
  // ====================

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6);

    // Only 6 digit numbers
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedData
      .split("")
      .forEach((digit, index) => {
        newOtp[index] = digit;
      });

    setOtp(newOtp);

    // Focus last entered digit
    const lastIndex =
      Math.min(pastedData.length, 6) - 1;

    if (lastIndex >= 0) {
      inputRefs.current[
        lastIndex
      ]?.focus();
    }
  };

  // ====================
  // Verify OTP
  // ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const enteredOtp = otp.join("");

    // OTP validation
    if (enteredOtp.length !== 6) {
      toast.error(
        "Please enter complete OTP",
      );
      return;
    }

    // Email validation
    if (!email) {
      toast.error(
        "Email is missing. Please try again.",
      );

      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyOTP({
        email,
        otp: enteredOtp,
      });

      toast.success(data.message);

      navigate("/reset-password");
    } catch (error) {
      // Zod validation errors
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(
          (err) => {
            toast.error(err.message);
          },
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex justify-center items-center px-5">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">Verify OTP</h1>

        <p className="text-gray-500 text-center mt-3 mb-8">
          Enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-12 h-12 border rounded-lg text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
