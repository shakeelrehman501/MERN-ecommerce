import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { verifyEmail } from "@/api/authApi";

function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState(
    token ? "Verifying..." : "❌ Invalid verification link.",
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    let timeoutId;

    const verifyUserEmail = async () => {
      try {
        const data = await verifyEmail({ token });

        if (data.success) {
          setStatus("✅ Email verified successfully.");

          timeoutId = setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
        }
      } catch (error) {
        setStatus(
          error.response?.data?.message ||
            "❌ Verification failed. Please try again.",
        );
      }
    };

    verifyUserEmail();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, navigate]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-pink-100">
      <div className="bg-white rounded-xl w-full max-w-140 h-full max-h-100 shadow-md mx-5">
        <div className="text-center px-10 py-8">
          <h1 className="text-2xl font-semibold text-gray-500">{status}</h1>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
