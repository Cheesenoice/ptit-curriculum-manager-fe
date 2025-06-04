import React from "react";

import { Link } from "react-router-dom"; // Nếu bạn đang dùng React Router

const UserManagement = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Quản lý người dùng
        </h1>
      </div>

      {/* Management Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/users/phong-dao-tao"
          className="card bg-base-100 shadow-xl cursor-pointer hover:bg-primary hover:text-white transition-colors block"
        >
          <div className="card-body">
            <h2 className="card-title">Quản lý Phòng Đào tạo</h2>
            <p>Quản lý các phòng đào tạo và lịch sử dụng</p>
          </div>
        </Link>

        <Link
          to="/admin/users/giang-vien"
          className="card bg-base-100 shadow-xl cursor-pointer hover:bg-primary hover:text-white transition-colors block"
        >
          <div className="card-body">
            <h2 className="card-title">Quản lý Giảng viên</h2>
            <p>Quản lý thông tin và lịch giảng dạy</p>
          </div>
        </Link>

        <Link
          to="/admin/users/sinh-vien"
          className="card bg-base-100 shadow-xl cursor-pointer hover:bg-primary hover:text-white transition-colors block"
        >
          <div className="card-body">
            <h2 className="card-title">Quản lý Sinh viên</h2>
            <p>Quản lý thông tin và hồ sơ sinh viên</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserManagement;
