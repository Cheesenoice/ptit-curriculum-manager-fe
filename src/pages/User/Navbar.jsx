import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  BookOpen,
  User,
  SquareChartGantt,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/user" },
    {
      icon: BookOpen,
      label: "Khối kiến thức môn học",
      path: "/user/khoikienthuc-monhoc",
    },
    {
      icon: SquareChartGantt,
      label: "Chương trình đào tạo",
      path: "/user/chuongtrinhdaotao",
    },
    { icon: User, label: "Profile", path: "/user/profile" },
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
        <Link to="/user" className="btn btn-ghost text-xl">
          User
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
