import React from "react";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl text-error font-semibold">
          Không tìm thấy thông tin người dùng.
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          🧑‍💼 Thông tin cá nhân
        </h1>
        <p className="text-lg text-base-content">
          Đây là thông tin chi tiết của bạn.
        </p>
      </div>

      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
        <div className="card-body">
          <h2 className="card-title text-primary">Thông tin người dùng</h2>
          <div className="space-y-2 mt-4">
            <div>
              <span className="font-semibold">Tên:</span> {user.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-semibold">Vai trò:</span> {user.roles}
            </div>
            {user.phone && (
              <div>
                <span className="font-semibold">Số điện thoại:</span>{" "}
                {user.phone}
              </div>
            )}
            {user.address && (
              <div>
                <span className="font-semibold">Địa chỉ:</span> {user.address}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
