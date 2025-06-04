import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const PhongDaoTao = () => {
  const [trainingRooms, setTrainingRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    const fetchTrainingRooms = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:3000/api/phongdaotao", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setTrainingRooms(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Không thể lấy danh sách phòng đào tạo");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingRooms();
  }, []);

  const togglePasswordVisibility = (maPhong) => {
    setShowPasswords((prev) => ({
      ...prev,
      [maPhong]: !prev[maPhong],
    }));
  };

  // Fixed length for password display (8 characters)
  const displayPassword = (password, show) => {
    if (show) {
      // Pad or truncate password to 8 characters for consistent width
      return password.length > 8
        ? password.slice(0, 8)
        : password.padEnd(8, " ");
    }
    return "********"; // Always show 8 asterisks when masked
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Quản lý Phòng Đào tạo
        </h1>
        <p className="text-lg text-base-content">
          Danh sách các phòng đào tạo hiện có
        </p>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      {!loading && !error && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Mã Phòng</th>
                    <th>Tên Đăng Nhập</th>
                    <th>Mật Khẩu</th>
                    <th>Mã Khoa</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingRooms.map((room) => (
                    <tr key={room.MaPhongDaoTao}>
                      <td>{room.MaPhongDaoTao}</td>
                      <td>{room.TenDangNhap}</td>
                      <td className="flex items-center gap-2">
                        <span className="font-mono">
                          {displayPassword(
                            room.MatKhau,
                            showPasswords[room.MaPhongDaoTao]
                          )}
                        </span>
                        <button
                          onClick={() =>
                            togglePasswordVisibility(room.MaPhongDaoTao)
                          }
                          className="btn btn-ghost btn-xs"
                        >
                          {showPasswords[room.MaPhongDaoTao] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </td>
                      <td>{room.MaKhoa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhongDaoTao;
