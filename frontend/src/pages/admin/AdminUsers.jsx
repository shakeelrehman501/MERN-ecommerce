import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/user/all-user",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="pl-88 py-20 pr-20 mx-auto px-4">
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

      <div className="grid grid-cols-2 gap-7 mt-7 ">
        {filteredUsers.map((user, index) => {
          return (
            <div
              key={index}
              className="relative bg-pink-100 p-5 rounded-lg w-100"
            >
              <div className="flex items-center gap-2 ">
                <img
                  src={user?.profilePic || "/user.png"}
                  alt=""
                  className="rounded-full w-16 aspect-square object-cover border border-pink-600"
                />

                <div>
                  <h1 className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h1>

                  <h3>{user?.email}</h3>
                </div>
              </div>

              <div className="absolute top-0 right-2 flex gap-3 mt-3">
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
    </div>
  );
};

export default AdminUsers;
