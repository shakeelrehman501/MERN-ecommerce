import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState("Verifying...")
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/verify",
          {},
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (res.data.success) {
          setStatus("✅ Email Verified Successfully");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        setStatus("❌ Verification failed. Please try again");
      }
    };
    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);
  
  return (
    <div className='relative w-full min-h-screen flex items-center justify-center bg-pink-100'>
      <div className='bg-white rounded-xl w-full max-w-140 h-full max-h-100 shadow-md mx-5'>
        <div className='text-center px-10 py-8'>
          <h1 className='text-2xl font-semibold text-gray-500'>{status}</h1>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
