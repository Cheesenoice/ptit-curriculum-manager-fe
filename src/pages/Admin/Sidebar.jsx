import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Settings,
  LogOut,
  BookOpen,
  BookOpenText,
  SquareChartGantt,
  FolderTree,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: BookOpen, label: "Môn Học", path: "/admin/monhoc" },
    {
      icon: BookOpenText,
      label: "Khối Kiến Thức",
      path: "/admin/khoikienthuc-monhoc",
    },
    {
      icon: SquareChartGantt,
      label: "Chương trình đào tạo",
      path: "/admin/chuongtrinhdaotao",
    },
    { icon: Users, label: "Người dùng", path: "/admin/users" },
    {
      icon: FolderTree,
      label: "Khoa - Ngành - Chuyên Ngành",
      path: "/admin/khoa-nganh-chuyennganh",
    },
    {
      icon: FolderTree,
      label: "Niên khóa - Kỳ học",
      path: "/admin/nienkhoa-kyhoc",
    },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-base-100 to-base-200 shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out rounded-r-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-base-300 flex items-center justify-center">
            <div className="h-12 w-full flex items-center">
              <h2 className="text-2xl font-bold text-primary tracking-wide truncate">
                Admin
              </h2>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-primary/10 text-base-content"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-base-300">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-error hover:text-white text-base-content transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
