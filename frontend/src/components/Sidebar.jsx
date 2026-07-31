import {  PackagePlus, PackageSearch, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className=" fixed md:block border-r bg-pink-50 border-pink-200 px-10 w-75 p-10 space-y-2 h-screen">
      <div className="text-center pt-10 px-3 space-y-2">

        {/* Add Product */}
        <NavLink
          to="/dashboard/add-product"
          className={({ isActive }) =>
            `text-xl ${
              isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <PackagePlus />
          <span>Add Product</span>
        </NavLink>

        {/* Products */}
        <NavLink
          to="/dashboard/products"
          className={({ isActive }) =>
            `text-xl ${
              isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <PackageSearch />
          <span>Products</span>
        </NavLink>

        {/* Users */}
        <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `text-xl ${
              isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <Users />
          <span>User</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
