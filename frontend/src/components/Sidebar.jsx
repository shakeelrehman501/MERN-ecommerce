import { PackagePlus, PackageSearch, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ setShowMenu }) => {
  return (
    <div className="text-center pt-10 px-3 space-y-2">
      {/* Add Product */}
      <NavLink
        to="/dashboard/add-product"
        onClick={() => setShowMenu?.(false)}
        className={({ isActive }) =>
          `text-xl ${
            isActive ? "bg-blue-600 text-gray-200" : "bg-transparent"
          } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
        }
      >
        <PackagePlus />
        <span>Add Product</span>
      </NavLink>

      {/* Products */}
      <NavLink
        to="/dashboard/products"
        onClick={() => setShowMenu?.(false)}
        className={({ isActive }) =>
          `text-xl ${
            isActive ? "bg-blue-600 text-gray-200" : "bg-transparent"
          } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
        }
      >
        <PackageSearch />
        <span>Products</span>
      </NavLink>

      {/* Users */}
      <NavLink
        to="/dashboard/users"
        onClick={() => setShowMenu?.(false)}
        className={({ isActive }) =>
          `text-xl ${
            isActive ? "bg-blue-600 text-gray-200" : "bg-transparent"
          } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
        }
      >
        <Users />
        <span>User</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
