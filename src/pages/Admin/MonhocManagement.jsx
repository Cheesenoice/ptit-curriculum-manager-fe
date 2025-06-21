import React, { useState, useEffect } from "react";
import {
  fetchAllMonHoc,
  createMonHoc,
  updateMonHoc,
  deleteMonHoc,
} from "../../api/services/monHocService";
import { showToast } from "../../components/Common/showToast";

const MonhocManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [khoiKienThucFilter, setKhoiKienThucFilter] = useState("");
  const [loaiMonFilter, setLoaiMonFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    maMonHoc: "",
    tenMonHoc: "",
    soTinChi: 0,
    soTietLiThuyet: 0,
    soTietBaiTap: 0,
    soTietThucHanh: 0,
    soTietTuHoc: 0,
    ngonNguDay: "Tiếng Việt",
    loaiMon: "Bắt buộc",
    maKhoiKienThuc: "",
    maMonHocTruoc: null,
    maMonHocTienQuyet: null,
    maMonHocSongHanh: null,
    tenMonHocTiengAnh: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetchAllMonHoc();
      if (res.success) {
        const filteredData = res.data.filter(
          (course) => !course.TenMonHoc.toLowerCase().includes("tự chọn")
        );
        setCourses(filteredData);
        setFilteredCourses(filteredData);
        setLoading(false);
      } else {
        setError("Không thể tải danh sách môn học");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.TenMonHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.MaMonHoc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (khoiKienThucFilter) {
      filtered = filtered.filter(
        (course) => course.MaKhoiKienThuc === khoiKienThucFilter
      );
    }
    if (loaiMonFilter) {
      filtered = filtered.filter((course) => course.LoaiMon === loaiMonFilter);
    }
    setFilteredCourses(filtered);
  }, [searchTerm, khoiKienThucFilter, loaiMonFilter, courses]);

  const uniqueKhoiKienThuc = [
    ...new Set(courses.map((course) => course.MaKhoiKienThuc)),
  ];
  const uniqueLoaiMon = [
    ...new Set(courses.map((course) => course.LoaiMon)),
  ].filter(Boolean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (isEdit) {
      res = await updateMonHoc(formData.maMonHoc, formData);
    } else {
      res = await createMonHoc(formData);
    }

    if (res.success) {
      showToast(res.message, "success");
      const fetchRes = await fetchAllMonHoc();
      if (fetchRes.success) {
        const filteredData = fetchRes.data.filter(
          (course) => !course.TenMonHoc.toLowerCase().includes("tự chọn")
        );
        setCourses(filteredData);
        setFilteredCourses(filteredData);
      }
      setShowModal(false);
      resetForm();
    } else {
      showToast(res.message, "error");
    }
  };

  const handleEdit = (course) => {
    setFormData({
      maMonHoc: course.MaMonHoc || "",
      tenMonHoc: course.TenMonHoc || "",
      soTinChi: course.SoTinChi || 0,
      soTietLiThuyet: course.SoTietLiThuyet || 0,
      soTietBaiTap: course.SoTietBaiTap || 0,
      soTietThucHanh: course.SoTietThucHanh || 0,
      soTietTuHoc: course.SoTietTuHoc || 0,
      ngonNguDay: course.NgonNguDay || "Tiếng Việt",
      loaiMon: course.LoaiMon || "Bắt buộc",
      maKhoiKienThuc: course.MaKhoiKienThuc || "",
      maMonHocTruoc: course.MaMonHocTruoc || null,
      maMonHocTienQuyet: course.MaMonHocTienQuyet || null,
      maMonHocSongHanh: course.MaMonHocSongHanh || null,
      tenMonHocTiengAnh: course.TenMonHocTiengAnh || "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (maMonHoc) => {
    if (window.confirm("Bạn có chắc muốn xóa môn học này?")) {
      const res = await deleteMonHoc(maMonHoc);
      if (res.success) {
        showToast(res.message, "success");
        setCourses(courses.filter((c) => c.MaMonHoc !== maMonHoc));
        setFilteredCourses(
          filteredCourses.filter((c) => c.MaMonHoc !== maMonHoc)
        );
      } else {
        showToast(res.message, "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      maMonHoc: "",
      tenMonHoc: "",
      soTinChi: 0,
      soTietLiThuyet: 0,
      soTietBaiTap: 0,
      soTietThucHanh: 0,
      soTietTuHoc: 0,
      ngonNguDay: "Tiếng Việt",
      loaiMon: "Bắt buộc",
      maKhoiKienThuc: "",
      maMonHocTruoc: null,
      maMonHocTienQuyet: null,
      maMonHocSongHanh: null,
      tenMonHocTiengAnh: "",
    });
    setIsEdit(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý môn học</h1>

      <div className="mb-4">
        <div className="stats shadow mb-4">
          <div className="stat">
            <div className="stat-title">Tổng số môn học</div>
            <div className="stat-value">{filteredCourses.length}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã môn học"
            className="input input-bordered w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="select select-bordered w-full max-w-xs"
            value={khoiKienThucFilter}
            onChange={(e) => setKhoiKienThucFilter(e.target.value)}
          >
            <option value="">Tất cả khối kiến thức</option>
            {uniqueKhoiKienThuc.map((khoi) => (
              <option key={khoi} value={khoi}>
                {
                  courses.find((c) => c.MaKhoiKienThuc === khoi)
                    ?.TenKhoiKienThuc
                }
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-full max-w-xs"
            value={loaiMonFilter}
            onChange={(e) => setLoaiMonFilter(e.target.value)}
          >
            <option value="">Tất cả loại môn</option>
            {uniqueLoaiMon.map((loai) => (
              <option key={loai} value={loai}>
                {loai}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Thêm môn học
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Thứ tự</th>
              <th>Tên môn học</th>
              <th>Mã môn học</th>
              <th>Số TC</th>
              <th>Môn tiên quyết</th>
              <th>Môn học trước</th>
              <th>Môn song hành</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course, index) => (
              <tr key={course.MaMonHoc}>
                <td>{index + 1}</td>
                <td>{course.TenMonHoc}</td>
                <td>{course.MaMonHoc}</td>
                <td>{course.SoTinChi}</td>
                <td>{course.TenMonHocTienQuyet || "-"}</td>
                <td>{course.TenMonHocTruoc || "-"}</td>
                <td>{course.TenMonHocSongHanh || "-"}</td>
                <td>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleEdit(course)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => handleDelete(course.MaMonHoc)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">
              {isEdit ? "Sửa môn học" : "Thêm môn học"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Mã môn học</label>
                  <input
                    type="text"
                    name="maMonHoc"
                    value={formData.maMonHoc}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    disabled={isEdit}
                  />
                </div>
                <div>
                  <label className="label">Tên môn học</label>
                  <input
                    type="text"
                    name="tenMonHoc"
                    value={formData.tenMonHoc}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">Tên môn học (Tiếng Anh)</label>
                  <input
                    type="text"
                    name="tenMonHocTiengAnh"
                    value={formData.tenMonHocTiengAnh}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Số tín chỉ</label>
                  <input
                    type="number"
                    name="soTinChi"
                    value={formData.soTinChi}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">Số tiết lý thuyết</label>
                  <input
                    type="number"
                    name="soTietLiThuyet"
                    value={formData.soTietLiThuyet}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Số tiết bài tập</label>
                  <input
                    type="number"
                    name="soTietBaiTap"
                    value={formData.soTietBaiTap}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Số tiết thực hành</label>
                  <input
                    type="number"
                    name="soTietThucHanh"
                    value={formData.soTietThucHanh}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Số tiết tự học</label>
                  <input
                    type="number"
                    name="soTietTuHoc"
                    value={formData.soTietTuHoc}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Ngôn ngữ dạy</label>
                  <input
                    type="text"
                    name="ngonNguDay"
                    value={formData.ngonNguDay}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Loại môn</label>
                  <select
                    name="loaiMon"
                    value={formData.loaiMon}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="Bắt buộc">Bắt buộc</option>
                    <option value="Tùy chọn">Tùy chọn</option>
                  </select>
                </div>
                <div>
                  <label className="label">Mã khối kiến thức</label>
                  <select
                    name="maKhoiKienThuc"
                    value={formData.maKhoiKienThuc}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Chọn khối kiến thức</option>
                    {uniqueKhoiKienThuc.map((khoi) => (
                      <option key={khoi} value={khoi}>
                        {
                          courses.find((c) => c.MaKhoiKienThuc === khoi)
                            ?.TenKhoiKienThuc
                        }
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Mã môn học trước</label>
                  <input
                    type="text"
                    name="maMonHocTruoc"
                    value={formData.maMonHocTruoc || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Mã môn học tiên quyết</label>
                  <input
                    type="text"
                    name="maMonHocTienQuyet"
                    value={formData.maMonHocTienQuyet || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Mã môn học song hành</label>
                  <input
                    type="text"
                    name="maMonHocSongHanh"
                    value={formData.maMonHocSongHanh || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonhocManagement;
