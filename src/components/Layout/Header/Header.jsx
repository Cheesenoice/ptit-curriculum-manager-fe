import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { House, Menu, X } from "lucide-react";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const HeaderContent = () => (
    <div className="flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="group">
        <img
          src="/collection/cong-thong-tin-dao-tao-ptit.png"
          alt="PTIT Logo"
          className="h-12 w-auto transition-transform duration-200 group-hover:scale-105 active:scale-95"
        />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6 font-semibold">
        <Link to="/" className="underline-hover">
          Giới Thiệu Chung
        </Link>
        <Link to="/" className="underline-hover">
          Tin tức
        </Link>
        <Link to="/" className="underline-hover">
          Chương trình đào tạo
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <label htmlFor="nav-drawer" className="btn btn-ghost btn-square">
          <Menu />
        </label>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="bg-primary text-white sm:text-sm text-xs font-semibold py-1 px-4 space-x-2 flex justify-between items-center transition-all duration-300">
        <a className="flex items-center space-x-2" href="/">
          <House />
          <span className="hidden sm:inline underline-hover">
            Cổng thông tin điện tử Học viện Công nghệ Bưu chính Viễn thông
          </span>
          <span className="sm:hidden">Cổng thông tin</span>
        </a>
        {isLoggedIn ? (
          <div className="flex space-x-4">
            <Link to="/user" className="underline-hover">
              Tài khoản của tôi
            </Link>
            <span
              onClick={handleLogout}
              className="cursor-pointer underline-hover"
            >
              Đăng xuất
            </span>
          </div>
        ) : (
          <Link to="/login" className="cursor-pointer underline-hover">
            Đăng nhập
          </Link>
        )}
      </div>

      {/* Main Header */}
      <div className="bg-white text-gray-900 p-4 shadow-md z-30">
        <HeaderContent />
      </div>

      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white shadow-md z-[999] transition-all duration-300 transform ${
          isSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="p-4">
          <HeaderContent />
        </div>
      </div>

      {/* Mobile Drawer Nav */}
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-[9999]">
        <label htmlFor="nav-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Danh mục</span>
            <label
              htmlFor="nav-drawer"
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X />
            </label>
          </div>
          <li>
            <Link to="/">Giới Thiệu Chung</Link>
          </li>
          <li>
            <Link to="/">Tin tức</Link>
          </li>
          <li>
            <Link to="/">Chương trình đào tạo</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
