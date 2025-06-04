import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const SinhVien = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:3000/api/sinhvien", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setStudents(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Không thể lấy danh sách sinh viên");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const togglePasswordVisibility = (maSinhVien) => {
    setShowPasswords((prev) => ({
      ...prev,
      [maSinhVien]: !prev[maSinhVien],
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

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Quản lý Sinh viên
        </h1>
        <p className="text-lg text-base-content">
          Danh sách các sinh viên hiện có
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
                    <th>Mã Sinh viên</th>
                    <th>Họ Tên</th>
                    <th>Ngày Sinh</th>
                    <th>Mật Khẩu</th>
                    <th>Mã Ngành</th>
                    <th>Tên Ngành</th>
                    <th>Mã Niên Khóa</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.MaSinhVien}>
                      <td>{student.MaSinhVien}</td>
                      <td>{student.HoTen}</td>
                      <td>{formatDate(student.NgaySinh)}</td>
                      <td className="flex items-center gap-2">
                        <span className="font-mono">
                          {displayPassword(
                            student.MatKhau,
                            showPasswords[student.MaSinhVien]
                          )}
                        </span>
                        <button
                          onClick={() =>
                            togglePasswordVisibility(student.MaSinhVien)
                          }
                          className="btn btn-ghost btn-xs"
                        >
                          {showPasswords[student.MaSinhVien] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </td>
                      <td>{student.MaNganh}</td>
                      <td>{student.TenNganh}</td>
                      <td>{student.MaNienKhoa}</td>
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

export default SinhVien;
