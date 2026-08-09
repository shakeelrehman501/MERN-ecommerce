import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUser } from "@/redux/userSlice";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Images } from "@/lib/constants.js";
const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  const userId = params.id;

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    }); //preview only
    setImageLoading(true);
  };

  // main function
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    try {
      // use FormData for text + file
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); // image file for backend multer
      }
      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error.response);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/get-user/${userId}`,
        );

        if (res.data.success) {
          setUpdateUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserDetails();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 lg:-mt-20 xl:-mt-25 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 pt-28 sm:pt-8 lg:pl-70 xl:pl-5 ">
          <div className="flex justify-between gap-3 sm:gap-5">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>

            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>
          <div className="w-full flex flex-col items-center sm:flex-row gap-10 justify-between sm:items-start px-7 max-w-2xl">
            {/* profile picture */}
            <div className="flex flex-col items-center relative">
              {imageLoading && (
                <div className="absolute w-32 h-32 inset-0 rounded-full flex items-center justify-center border-4 border-blue-600 bg-gray-200">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
              <img
                src={updateUser?.profilePic || Images.userAvator}
                alt="profile"
                onLoad={() => setImageLoading(false)}
                className={`w-32 h-32 rounded-full object-cover border-4 border-blue-600
                  ${imageLoading ? "opacity-0" : "opacity-100"}
                  `}
              />
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
            <form
              onSubmit={handleSubmit}
              className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
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
                    value={updateUser?.firstName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Rehman"
                    value={updateUser?.lastName}
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
                  value={updateUser?.email}
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
                  value={updateUser?.phoneNo}
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
                  value={updateUser?.address}
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
                    value={updateUser?.city}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 "
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Zip Code</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    placeholder="Enter your zip code"
                    value={updateUser?.zipCode}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 "
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Label className="block text-sm font-medium">Role:</Label>
                <RadioGroup
                  value={updateUser?.role}
                  onValueChange={(value) =>
                    setUpdateUser({ ...updateUser, role: value })
                  }
                  className="flex items-center"
                >
                  <div className="flex items-center space-x-2 ">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
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
  );
};

export default UserInfo;
