import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Images } from "@/lib/constants.js";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getAllUsers } from "@/api/userApi.js";

const AdminUsers = () => {


const [users, setUsers] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [loading, setLoading] = useState(false);

const navigate = useNavigate();

// ====================
// Get All Users
// ====================

useEffect(() => {
  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();

      setUsers(data.users);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users",
      );
    } finally {
      setLoading(false);
    }
  };

  loadUsers();
}, []);
  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className=" pt-26 pb-10 px-3 sm:px-4 md:px-7 mx-auto lg:pl-80 bg-gray-100 min-h-screen">
      <h1 className="font-bold text-2xl">User Management</h1>
      <p>View and manage registered users</p>

      <div className="flex relative w-75 mt-6">
        <Search className="absolute left-2 top-1 text-gray-600 w-5" />

        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          placeholder="Search Users...."
        />
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2  gap-5 mt-7 ">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative bg-pink-100 p-5 rounded-lg w-full max-w-120 min-w-40 h-25 flex"
            >
              <Skeleton className="flex items-center rounded-full gap-2 w-18 h-18 bg-pink-200" />
              <div className="flex flex-col gap-2 rounded-sm ml-4 mt-2">
                <Skeleton className="bg-pink-200  w-25 h-6 " />
                <Skeleton className="bg-pink-200  w-60 h-6" />
              </div>

              <Skeleton className="absolute top-0 right-4 flex gap-3 mt-3 bg-pink-200 w-20 h-6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2  gap-5 mt-7 ">
          {filteredUsers.map((user, index) => {
            return (
              <div
                key={index}
                className="relative bg-pink-100 p-3 sm:p-5 rounded-lg w-full max-w-120 min-w-40"
              >
                <div className="flex items-center gap-2 ">
                  <img
                    src={user?.profilePic || Images.userAvator}
                    alt=""
                    className={`rounded-full w-16 aspect-square object-cover border border-blue-600`}
                  />

                  <div>
                    <h1 className="font-semibold">
                      {user?.firstName} {user?.lastName}
                    </h1>

                    <h3 className="text-sm sm:text-[16px]">{user?.email}</h3>
                  </div>
                </div>

                <div className="absolute top-0 right-4 flex gap-3 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                  >
                    <Edit />
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
