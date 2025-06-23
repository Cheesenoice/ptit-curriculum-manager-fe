import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  getAllLecturers,
  addLecturer,
  updateLecturer,
  deleteLecturer,
} from "../../../api/services/giangVienService";
import { showToast } from "../../../components/Common/showToast";
import {
  getAllMonHoc,
  getMonHocByGiangVien,
  updateMonHocGiangVien,
} from "../../../api/services/monHocService";
import GiangVienView from "./GiangVienView";
import { getAllKhoa } from "../../../api/services/khoaService";

const GiangVien = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLecturer, setCurrentLecturer] = useState(null);
  const [form, setForm] = useState({
    maGiangVien: "",
    hoTen: "",
    maKhoa: "",
    email: "",
    ngaySinh: "",
    tenDangNhap: "",
    matKhau: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [monModalOpen, setMonModalOpen] = useState(false);
  const [monList, setMonList] = useState([]);
  const [selectedMon, setSelectedMon] = useState([]);
  const [monModalLecturer, setMonModalLecturer] = useState(null);
  const [khoaList, setKhoaList] = useState([]);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await getAllLecturers(token);
        if (response.data.success) {
          setLecturers(response.data.data);
        } else {
          setError(response.data.message);
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

  const openAddModal = async () => {
    setEditMode(false);
    setForm({
      maGiangVien: "",
      hoTen: "",
      maKhoa: "",
      email: "",
      ngaySinh: "",
      tenDangNhap: "",
      matKhau: "",
    });
    setModalOpen(true);
    // Lấy danh sách khoa
    try {
      const token = localStorage.getItem("access_token");
      const res = await getAllKhoa(token);
      setKhoaList(res.data.data || []);
    } catch {}
  };

  const openEditModal = async (lecturer) => {
    setEditMode(true);
    setCurrentLecturer(lecturer);
    setForm({
      maGiangVien: lecturer.MaGiangVien,
      hoTen: lecturer.HoTen,
      maKhoa: lecturer.MaKhoa,
      email: lecturer.Email || "",
      ngaySinh: lecturer.NgaySinh ? lecturer.NgaySinh.slice(0, 10) : "",
      tenDangNhap: lecturer.TenDangNhap || "",
      matKhau: lecturer.MatKhau || "",
    });
    setModalOpen(true);
    // Lấy danh sách khoa
    try {
      const token = localStorage.getItem("access_token");
      const res = await getAllKhoa(token);
      setKhoaList(res.data.data || []);
    } catch {}
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentLecturer(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true);
      if (editMode) {
        // Chỉ gửi các trường thay đổi ngoài mã
        const updateBody = { maGiangVien: form.maGiangVien };
        [
          "hoTen",
          "maKhoa",
          "email",
          "ngaySinh",
          "tenDangNhap",
          "matKhau",
        ].forEach((key) => {
          if (
            form[key] !== undefined &&
            form[key] !== "" &&
            form[key] !==
              (currentLecturer &&
                (currentLecturer[key.charAt(0).toUpperCase() + key.slice(1)] ||
                  currentLecturer[key]))
          ) {
            updateBody[key] = form[key];
          }
        });
        await updateLecturer(updateBody, token);
        showToast("Cập nhật thành công", "success");
      } else {
        // Validate đủ trường khi thêm
        const required = [
          "maGiangVien",
          "hoTen",
          "maKhoa",
          "email",
          "ngaySinh",
          "tenDangNhap",
          "matKhau",
        ];
        for (let key of required) {
          if (!form[key]) {
            showToast("Vui lòng nhập đủ thông tin", "error");
            setLoading(false);
            return;
          }
        }
        await addLecturer(form, token);
        showToast("Thêm thành công", "success");
      }
      // Refresh list
      const response = await getAllLecturers(token);
      setLecturers(response.data.data);
      closeModal();
    } catch (err) {
      showToast("Có lỗi xảy ra", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true);
      await deleteLecturer(deleteId, token);
      showToast("Xóa thành công", "success");
      setLecturers((prev) => prev.filter((l) => l.MaGiangVien !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showToast("Xóa thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const openMonModal = (lecturer) => {
    setMonModalLecturer(lecturer);
    setMonModalOpen(true);
  };

  const closeMonModal = () => {
    setMonModalOpen(false);
    setMonModalLecturer(null);
  };

  const handleMonCheck = (maMonHoc) => {
    setSelectedMon((prev) =>
      prev.includes(maMonHoc)
        ? prev.filter((m) => m !== maMonHoc)
        : [...prev, maMonHoc]
    );
  };

  const handleSaveMon = async () => {
    if (!monModalLecturer) return;
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true);
      await updateMonHocGiangVien(
        monModalLecturer.MaGiangVien,
        selectedMon.join(","),
        token
      );
      showToast("Cập nhật môn dạy thành công", "success");
      closeMonModal();
    } catch (err) {
      showToast("Cập nhật thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Quản lý Giảng viên
          </h1>
          <p className="text-lg text-base-content">
            Danh sách các giảng viên hiện có
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          Thêm giảng viên
        </button>
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
                    <th>Hành động</th>
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
                      </td>
                      <td>{lecturer.MaKhoa}</td>
                      <td>{lecturer.TenKhoa}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => openEditModal(lecturer)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-xs btn-warning"
                          onClick={() => openMonModal(lecturer)}
                        >
                          Xem môn dạy
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => confirmDelete(lecturer.MaGiangVien)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Modal Thêm/Sửa */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Sửa giảng viên" : "Thêm giảng viên"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input input-bordered w-full"
                name="maGiangVien"
                placeholder="Mã Giảng viên"
                value={form.maGiangVien}
                onChange={handleChange}
                required
                disabled={editMode}
              />
              <input
                className="input input-bordered w-full"
                name="hoTen"
                placeholder="Họ Tên"
                value={form.hoTen}
                onChange={handleChange}
                required={!editMode}
              />
              <select
                className="select select-bordered w-full"
                name="maKhoa"
                value={form.maKhoa}
                onChange={handleChange}
                required={!editMode}
              >
                <option value="">Chọn khoa</option>
                {khoaList.map((khoa) => (
                  <option key={khoa.MaKhoa} value={khoa.MaKhoa}>
                    {khoa.TenKhoa}
                  </option>
                ))}
              </select>
              <input
                className="input input-bordered w-full"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required={!editMode}
                type="email"
              />
              <input
                className="input input-bordered w-full"
                name="ngaySinh"
                placeholder="Ngày Sinh"
                value={form.ngaySinh}
                onChange={handleChange}
                required={!editMode}
                type="date"
              />
              <input
                className="input input-bordered w-full"
                name="tenDangNhap"
                placeholder="Tên Đăng Nhập"
                value={form.tenDangNhap}
                onChange={handleChange}
                required={!editMode}
              />
              <input
                className="input input-bordered w-full"
                name="matKhau"
                placeholder="Mật Khẩu"
                value={form.matKhau}
                onChange={handleChange}
                required={!editMode}
                type="text"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" type="submit">
                  {editMode ? "Lưu" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc muốn xóa giảng viên này?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteId(null)}
              >
                Hủy
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xem/cập nhật môn dạy */}
      <GiangVienView
        lecturer={monModalLecturer}
        open={monModalOpen}
        onClose={closeMonModal}
      />
    </div>
  );
};

export default GiangVien;
