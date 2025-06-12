import React, { useState, useEffect } from "react";
import axios from "axios";

const MonhocManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [khoiKienThucFilter, setKhoiKienThucFilter] = useState("");
  const [loaiMonFilter, setLoaiMonFilter] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:3000/api/monhoc", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.data);
        setFilteredCourses(res.data.data);
        setLoading(false);
      } catch (err) {
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

        <div className="flex flex-col sm:flex-row gap-4">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonhocManagement;
