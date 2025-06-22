import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../../../api/services/sinhVienService";
import { showToast } from "../../../components/Common/showToast";
import SinhVienFilter from "./SinhVienFilter";

const SinhVien = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [form, setForm] = useState({
    maSinhVien: "",
    hoTen: "",
    ngaySinh: "",
    maNganh: "",
    namNhapHoc: "",
    email: "",
    tenDangNhap: "",
    matKhau: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [selectedNganh, setSelectedNganh] = useState("");
  const [selectedNienKhoa, setSelectedNienKhoa] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await getAllStudents(token);
        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError(response.data.message);
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

  const openAddModal = () => {
    setEditMode(false);
    setForm({
      maSinhVien: "",
      hoTen: "",
      ngaySinh: "",
      maNganh: "",
      namNhapHoc: "",
      email: "",
      tenDangNhap: "",
      matKhau: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditMode(true);
    setCurrentStudent(student);
    setForm({
      maSinhVien: student.MaSinhVien,
      hoTen: student.HoTen,
      ngaySinh: student.NgaySinh ? student.NgaySinh.slice(0, 10) : "",
      maNganh: student.MaNganh,
      namNhapHoc: student.NamNhapHoc || student.namNhapHoc || "",
      email: student.Email || "",
      tenDangNhap: student.TenDangNhap || "",
      matKhau: student.MatKhau || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentStudent(null);
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
        const updateBody = { maSinhVien: form.maSinhVien };
        [
          "hoTen",
          "ngaySinh",
          "maNganh",
          "namNhapHoc",
          "email",
          "tenDangNhap",
          "matKhau",
        ].forEach((key) => {
          if (
            form[key] !== undefined &&
            form[key] !== "" &&
            form[key] !==
              (currentStudent &&
                (currentStudent[key.charAt(0).toUpperCase() + key.slice(1)] ||
                  currentStudent[key]))
          ) {
            updateBody[key] = form[key];
          }
        });
        await updateStudent(updateBody, token);
        showToast("Cập nhật thành công", "success");
      } else {
        // Validate đủ trường khi thêm
        const required = [
          "maSinhVien",
          "hoTen",
          "ngaySinh",
          "maNganh",
          "namNhapHoc",
          "email",
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
        await addStudent(form, token);
        showToast("Thêm thành công", "success");
      }
      // Refresh list
      const response = await getAllStudents(token);
      setStudents(response.data.data);
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
      await deleteStudent(deleteId, token);
      showToast("Xóa thành công", "success");
      setStudents((prev) => prev.filter((s) => s.MaSinhVien !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showToast("Xóa thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách ngành và niên khóa duy nhất từ students
  const nganhList = Array.from(
    students
      .reduce((acc, sv) => {
        if (sv.MaNganh && sv.TenNganh)
          acc.set(sv.MaNganh, { MaNganh: sv.MaNganh, TenNganh: sv.TenNganh });
        return acc;
      }, new Map())
      .values()
  );
  const nienKhoaList = Array.from(
    new Set(
      students
        .map(
          (sv) => sv.NienKhoa || sv.nienKhoa || sv.MaNienKhoa || sv.namNhapHoc
        )
        .filter(Boolean)
    )
  ).sort();

  const filteredStudents = students.filter((sv) => {
    const matchNganh = !selectedNganh || sv.MaNganh === selectedNganh;
    const nienKhoa =
      sv.NienKhoa || sv.nienKhoa || sv.MaNienKhoa || sv.namNhapHoc;
    const matchNienKhoa = !selectedNienKhoa || nienKhoa == selectedNienKhoa;
    return matchNganh && matchNienKhoa;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Quản lý Sinh viên
          </h1>
          <p className="text-lg text-base-content">
            Danh sách các sinh viên hiện có
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          Thêm sinh viên
        </button>
      </div>

      {/* Content */}
      <SinhVienFilter
        nganhList={nganhList}
        nienKhoaList={nienKhoaList}
        selectedNganh={selectedNganh}
        selectedNienKhoa={selectedNienKhoa}
        onNganhChange={setSelectedNganh}
        onNienKhoaChange={setSelectedNienKhoa}
      />
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
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
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
                      </td>
                      <td>{student.MaNganh}</td>
                      <td>{student.TenNganh}</td>
                      <td>{student.NienKhoa}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => openEditModal(student)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => confirmDelete(student.MaSinhVien)}
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
              {editMode ? "Sửa sinh viên" : "Thêm sinh viên"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input input-bordered w-full"
                name="maSinhVien"
                placeholder="Mã Sinh viên"
                value={form.maSinhVien}
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
                name="maNganh"
                placeholder="Mã Ngành"
                value={form.maNganh}
                onChange={handleChange}
                required={!editMode}
              />
              <input
                className="input input-bordered w-full"
                name="namNhapHoc"
                placeholder="Năm Nhập Học"
                value={form.namNhapHoc}
                onChange={handleChange}
                required={!editMode}
                type="number"
                min="2000"
                max="2100"
              />
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
            <p>Bạn có chắc muốn xóa sinh viên này?</p>
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
    </div>
  );
};

export default SinhVien;
