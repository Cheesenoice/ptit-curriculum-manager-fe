import React, { useEffect, useState } from "react";
import axios from "axios";

const MonhocManagement = () => {
  const [monhocs, setMonhocs] = useState([]);
  const [filteredMonhocs, setFilteredMonhocs] = useState([]);
  const [khoiKienThucs, setKhoiKienThucs] = useState([]);
  const [selectedKhoi, setSelectedKhoi] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMonhoc, setNewMonhoc] = useState({
    maMonHoc: "",
    tenMonHoc: "",
    soTinChi: 0,
    soTietLiThuyet: 0,
    soTietBaiTap: 0,
    soTietThucHanh: 0,
    soTietTuHoc: 0,
    ngonNguDay: "",
    laMonTuChon: false,
    maKhoiKienThuc: "",
  });
  const [addError, setAddError] = useState(""); // State to display add error

  // Fetch all subjects
  const fetchMonhocs = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://localhost:3000/api/monhoc", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setMonhocs(res.data.data);
        setFilteredMonhocs(res.data.data);
      } else {
        console.error("Lỗi lấy dữ liệu:", res.data.message);
        // Optionally display a global error message
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      // Optionally display a global error message
    } finally {
      setLoading(false);
    }
  };

  // Fetch knowledge blocks
  const fetchKhoiKienThucs = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://localhost:3000/api/khoikienthuc", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setKhoiKienThucs(res.data.data);
      } else {
        console.error("Lỗi lấy khối kiến thức:", res.data.message);
      }
    } catch (error) {
      console.error("Lỗi gọi API khối kiến thức:", error);
    }
  };

  // Fetch subjects by knowledge block
  const fetchMonhocsByKhoi = async (maKhoi) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        `http://localhost:3000/api/khoikienthuc/${maKhoi}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setMonhocs(res.data.data.danhSachMonHoc);
        setFilteredMonhocs(res.data.data.danhSachMonHoc);
      } else {
        console.error("Lỗi lấy môn học theo khối:", res.data.message);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new subject
  // Add new subject
  const addMonhoc = async (e) => {
    e.preventDefault();
    setAddError(""); // Clear any previous error
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        "http://localhost:3000/api/monhoc",
        newMonhoc,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // Update the monhocs state directly with the new subject
        setMonhocs((prevMonhocs) => [...prevMonhocs, res.data.data]); // Reset the filter to show all subjects including the new one
        setSelectedKhoi("");
        setIsModalOpen(false);
        setNewMonhoc({
          maMonHoc: "",
          tenMonHoc: "",
          soTinChi: 0,
          soTietLiThuyet: 0,
          soTietBaiTap: 0,
          soTietThucHanh: 0,
          soTietTuHoc: 0,
          ngonNguDay: "",
          laMonTuChon: false,
          maKhoiKienThuc: "",
        });
        alert("Thêm môn học thành công!");
      } else {
        console.error("Lỗi thêm môn học:", res.data.message);
        setAddError(res.data.message); // Set the error message to display in the modal
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setAddError("Lỗi khi thêm môn học!"); // Set a generic error message
    }
  };

  // Handle search
  useEffect(() => {
    const filtered = monhocs.filter(
      (mh) =>
        mh.TenMonHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mh.MaMonHoc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMonhocs(filtered);
  }, [searchTerm, monhocs]);

  // Handle filter by knowledge block
  useEffect(() => {
    if (selectedKhoi) {
      fetchMonhocsByKhoi(selectedKhoi);
    } else {
      fetchMonhocs();
    }
  }, [selectedKhoi]);

  // Fetch initial data
  useEffect(() => {
    fetchMonhocs();
    fetchKhoiKienThucs();
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Quản lý Môn học</h1>

      {/* Search and Filter */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm bằng mã hoặc tên môn học"
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={selectedKhoi}
          onChange={(e) => setSelectedKhoi(e.target.value)}
        >
          <option value="">Tất cả khối kiến thức</option>
          {khoiKienThucs
            .filter((kkt) => kkt.ParentID === null)
            .map((parent) => (
              <optgroup
                key={parent.MaKhoiKienThuc}
                label={parent.TenKhoiKienThuc}
              >
                <option value={parent.MaKhoiKienThuc}>
                  {parent.TenKhoiKienThuc}
                </option>
                {khoiKienThucs
                  .filter((child) => child.ParentID === parent.MaKhoiKienThuc)
                  .map((child) => (
                    <option
                      key={child.MaKhoiKienThuc}
                      value={child.MaKhoiKienThuc}
                    >
                      {" " + child.TenKhoiKienThuc}
                    </option>
                  ))}
              </optgroup>
            ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm Môn học
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-lg">Đang tải dữ liệu...</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn</th>
                  <th>Tín chỉ</th>
                  <th>Lý thuyết</th>
                  <th>Bài tập</th>
                  <th>Thực hành</th>
                  <th>Tiết Tự học</th>
                  <th>Ngôn ngữ</th>
                  <th>Tự chọn</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonhocs.map((mh) => (
                  <tr key={mh.MaMonHoc}>
                    <td>{mh.MaMonHoc}</td>
                    <td>{mh.TenMonHoc}</td>
                    <td>{mh.SoTinChi}</td>
                    <td>{mh.SoTietLiThuyet}</td>
                    <td>{mh.SoTietBaiTap}</td>
                    <td>{mh.SoTietThucHanh}</td>
                    <td>{mh.SoTietTuHoc}</td>
                    <td>{mh.NgonNguDay}</td>
                    <td>{mh.LaMonTuChon ? "✔️" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Adding Subject */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Thêm Môn học</h3>
            {addError && <p className="text-error mb-2">{addError}</p>}{" "}
            {/* Display error message */}
            <form onSubmit={addMonhoc}>
              {addError && <p className="text-error mb-2">{addError}</p>}
              <div className="form-control grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                {/* Apply grid layout */}
                <div>
                  <label className="label">Mã môn học</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newMonhoc.maMonHoc}
                    onChange={(e) =>
                      setNewMonhoc({ ...newMonhoc, maMonHoc: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label">Tên môn học</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newMonhoc.tenMonHoc}
                    onChange={(e) =>
                      setNewMonhoc({ ...newMonhoc, tenMonHoc: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label">Số tín chỉ</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newMonhoc.soTinChi}
                    onChange={(e) =>
                      setNewMonhoc({
                        ...newMonhoc,
                        soTinChi: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label">Số tiết lý thuyết</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newMonhoc.soTietLiThuyet}
                    onChange={(e) =>
                      setNewMonhoc({
                        ...newMonhoc,
                        soTietLiThuyet: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Số tiết bài tập</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newMonhoc.soTietBaiTap}
                    onChange={(e) =>
                      setNewMonhoc({
                        ...newMonhoc,
                        soTietBaiTap: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Số tiết thực hành</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newMonhoc.soTietThucHanh}
                    onChange={(e) =>
                      setNewMonhoc({
                        ...newMonhoc,
                        soTietThucHanh: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Số tiết tự học</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newMonhoc.soTietTuHoc}
                    onChange={(e) =>
                      setNewMonhoc({
                        ...newMonhoc,
                        soTietTuHoc: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Ngôn ngữ giảng dạy</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newMonhoc.ngonNguDay}
                    onChange={(e) =>
                      setNewMonhoc({ ...newMonhoc, ngonNguDay: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center">
                  {" "}
                  {/* Align checkbox and label vertically */}
                  <label className="label mr-2">Môn tự chọn</label>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={newMonhoc.laMonTuChon}
                    onChange={(e) =>
                      setNewMonhoc({
                        ...newMonhoc,
                        laMonTuChon: e.target.checked,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Khối kiến thức</label>
                  <select
                    className="select select-bordered w-full"
                    value={newMonhoc.maKhoiKienThuc}
                    onChange={(e) =>
                      setNewMonhoc({
                        ...newMonhoc,
                        maKhoiKienThuc: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Chọn khối kiến thức</option>
                    {khoiKienThucs.map((kkt) => (
                      <option
                        key={kkt.MaKhoiKienThuc}
                        value={kkt.MaKhoiKienThuc}
                      >
                        {kkt.TenKhoiKienThuc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Thêm
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
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
