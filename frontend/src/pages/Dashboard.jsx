import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="pt-8 max-w-7xl mx-auto relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block md:fixed    border-r bg-pink-50 border-pink-200 px-6 w-75 p-10 space-y-2 min-h-screen">
        <Sidebar />
      </div>
      <div className="flex-1">
        {/* Menu Button */}
        <div className="flex bg-gray-100 z-5 lg:hidden items-center relative ">
          <Button
            onClick={() => setShowMenu(true)}
            className=" cursor-pointer absolute -bottom-22 left-5 md:left-8 bg-blue-600 px-3 py-4.5"
          >
            <Menu className="w-8 h-8 " />
            Menu
          </Button>
        </div>
        {/* Mobile Sidebar */}
        {showMenu && (
          <div
            className="
          border-r bg-pink-50 border-pink-200 px-1  w-65 py-6 space-y-2 min-h-screen
          mt-2 lg:hidden  absolute top-17 left-0  pt-4  z-10  rounded-br-sm  "
          >
            <div
              onClick={() => setShowMenu(false)}
              className="w-7 h-7 bg-gray-500 text-gray-100 absolute right-4 top-4 z-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </div>
            <Sidebar setShowMenu={setShowMenu} />
          </div>
        )}

        <div className="pl-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
