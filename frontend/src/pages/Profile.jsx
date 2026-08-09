import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import { Loader2 } from "lucide-react";
import { Images } from "@/lib/constants.js";
import { updateUser as updateUserApi } from "@/api/authApi";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const dispatch = useDispatch();

  const { user, accessToken } = useSelector((store) => store.user);

  const { userId } = useParams();

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    setUpdateUser((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(selectedFile),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const data = await updateUserApi(userId, formData);

      dispatch(
        setUser({
          user: data.user,
          accessToken,
        }),
      );

      toast.success(data.message);
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-18  min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto items-center pt-4 sm:pt-10 ">
        <div className="flex flex-col justify-center items-center   bg-gray-100">
          <div className="w-full flex flex-col items-center sm:flex-row gap-2 sm:gap-10 justify-between sm:items-start px-7 max-w-2xl">
            {/* profile picture */}
            <div className="flex flex-col items-center mt-4 sm:mt-16">
              <div className="relative w-32 h-32 bg-gray-200 rounded-full">
                {imageLoading && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center border-4 border-blue-600">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                )}
                <img
                  src={updateUser?.profilePic || Images.userAvator}
                  alt="profile"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  className={`w-32 h-32 rounded-full object-cover border-4 border-blue-600  transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
              {/* <img src="/shakeel.png" alt="profile" className='w-32 h-32 rounded-full object-cover border-4 border-pink-800' /> */}
              <Label className="mt-4 cursor-pointer bg-blue-600 text-white whitespace-nowrap px-4 py-2 rounded hover:bg-pink-700">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>

            {/* profile form */}

            <div className="mt-5 sm:mt-4">
              <h1 className="font-bold mb-3 text-center text-2xl text-gray-800 ">
                Update Profile
              </h1>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 shadow-md p-5 rounded-lg bg-white"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Shakeel"
                      value={updateUser.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Rehman"
                      value={updateUser.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    disabled
                    value={updateUser.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter you Contact No"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 "
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter you address"
                    value={updateUser.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 "
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Enter your city address"
                      value={updateUser.city}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 "
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="Enter your zip code"
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 "
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-lg "
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
