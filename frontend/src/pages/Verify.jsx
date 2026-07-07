
function Verify() {
  return (
    <div className='relative w-full min-h-screen flex items-center justify-center bg-pink-100'>
      <div className='bg-white rounded-xl w-full max-w-120 h-full max-h-100 shadow-md mx-5'>
        <div className='text-center px-10 py-8'>
            <h1 className='text-2xl font-semibold text-green-500 mb-6'>✅ Check Your Email</h1>
            <p className='text-gray-500 text-sm'>We've sent you an email to verify your account. Please check your inbox and click the verification link </p>
        </div>
      </div>
    </div>
  )
}

export default Verify
