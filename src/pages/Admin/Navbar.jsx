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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 ${
                      isActive ? "bg-primary text-white" : ""
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-error hover:text-white"
              >
                <LogOut size={20} />
                Logout
              </button>
            </li>
          </ul>
        </div>
        {/* Logo */}
        <Link to="/admin" className="btn btn-ghost text-xl">
          Admin
        </Link>
      </div>
      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 ${
                    isActive ? "bg-primary text-white" : ""
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Logout Button */}
      <div className="navbar-end">
        <button
          onClick={handleLogout}
          className="btn btn-ghost flex items-center gap-2 hover:bg-error hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
