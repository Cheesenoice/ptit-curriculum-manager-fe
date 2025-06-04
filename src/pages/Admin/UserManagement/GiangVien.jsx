import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const GiangVien = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:3000/api/giangvien", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setLecturers(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Không thể lấy danh sách giảng viên");
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const togglePasswordVisibility = (maGiangVien) => {
    setShowPasswords((prev) => ({
      ...prev,
      [maGiangVien]: !prev[maGiangVien],
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
          Quản lý Giảng viên
        </h1>
        <p className="text-lg text-base-content">
          Danh sách các giảng viên hiện có
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
                    <th>Mã Giảng viên</th>
                    <th>Họ Tên</th>
                    <th>Mật Khẩu</th>
                    <th>Mã Khoa</th>
                    <th>Tên Khoa</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturers.map((lecturer) => (
                    <tr key={lecturer.MaGiangVien}>
                      <td>{lecturer.MaGiangVien}</td>
                      <td>{lecturer.HoTen}</td>
                      <td className="flex items-center gap-2">
                        <span className="font-mono">
                          {displayPassword(
                            lecturer.MatKhau,
                            showPasswords[lecturer.MaGiangVien]
                          )}
                        </span>
                        <button
                          onClick={() =>
                            togglePasswordVisibility(lecturer.MaGiangVien)
                          }
                          className="btn btn-ghost btn-xs"
                        >
                          {showPasswords[lecturer.MaGiangVien] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </td>
                      <td>{lecturer.MaKhoa}</td>
                      <td>{lecturer.TenKhoa}</td>
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

export default GiangVien;
