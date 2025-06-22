import React, { useState, useEffect } from "react";
import {
  getAllKhoa,
  addKhoa,
  updateKhoa,
  deleteKhoa,
} from "../../api/services/khoaService";
import {
  getAllNganh,
  addNganh,
  updateNganh,
  deleteNganh,
} from "../../api/services/nganhService";
import { showToast } from "../../components/Common/showToast";

const KhoaNganhManagement = () => {
  const [khoaList, setKhoaList] = useState([]);
  const [nganhList, setNganhList] = useState([]);
  const [allNganhList, setAllNganhList] = useState([]);
  const [selectedKhoaNganh, setSelectedKhoaNganh] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("khoa");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modalType, setModalType] = useState(""); // "khoa" | "nganh"
  const [form, setForm] = useState({});
  const [currentEdit, setCurrentEdit] = useState(null);

  const getToken = () => localStorage.getItem("access_token");

  // Fetch data
  const fetchKhoa = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await getAllKhoa(token);
      setKhoaList(res.data.data);
    } catch (err) {
      setError("Không thể lấy danh sách khoa");
    } finally {
      setLoading(false);
    }
  };
  const fetchNganh = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await getAllNganh(token);
      setNganhList(res.data.data);
      setAllNganhList(res.data.data);
    } catch (err) {
      setError("Không thể lấy danh sách ngành");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKhoa();
    fetchNganh();
  }, []);

  useEffect(() => {
    if (selectedKhoaNganh && allNganhList.length > 0) {
      const filteredNganh = allNganhList.filter(
        (nganh) => nganh.MaKhoa === selectedKhoaNganh
      );
      setNganhList(filteredNganh);
    } else {
      setNganhList(allNganhList);
    }
  }, [selectedKhoaNganh, allNganhList]);

  // Modal handlers
  const openAddModal = (type) => {
    setEditMode(false);
    setModalType(type);
    setForm({});
    setModalOpen(true);
  };
  const openEditModal = (type, item) => {
    setEditMode(true);
    setModalType(type);
    setCurrentEdit(item);
    setForm(
      type === "khoa"
        ? { maKhoa: item.MaKhoa, tenKhoa: item.TenKhoa }
        : {
            maNganh: item.MaNganh,
            maKhoa: item.MaKhoa,
            tenNganh: item.TenNganh,
            moTa: item.MoTa || "",
          }
    );
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setCurrentEdit(null);
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // CRUD handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      setLoading(true);
      if (modalType === "khoa") {
        if (editMode) {
          await updateKhoa(form, token);
          showToast("Cập nhật khoa thành công", "success");
        } else {
          if (!form.maKhoa || !form.tenKhoa) {
            showToast("Vui lòng nhập đủ thông tin", "error");
            setLoading(false);
            return;
          }
          await addKhoa(form, token);
          showToast("Thêm khoa thành công", "success");
        }
        await fetchKhoa();
      } else if (modalType === "nganh") {
        if (editMode) {
          await updateNganh(form, token);
          showToast("Cập nhật ngành thành công", "success");
        } else {
          if (!form.maNganh || !form.maKhoa || !form.tenNganh) {
            showToast("Vui lòng nhập đủ thông tin", "error");
            setLoading(false);
            return;
          }
          await addNganh(form, token);
          showToast("Thêm ngành thành công", "success");
        }
        await fetchNganh();
      }
      closeModal();
    } catch (err) {
      showToast("Có lỗi xảy ra", "error");
    } finally {
      setLoading(false);
    }
  };
  const confirmDelete = (type, id) => {
    setModalType(type);
    setDeleteId(id);
  };
  const handleDelete = async () => {
    const token = getToken();
    try {
      setLoading(true);
      if (modalType === "khoa") {
        await deleteKhoa(deleteId, token);
        showToast("Xóa khoa thành công", "success");
        await fetchKhoa();
      } else if (modalType === "nganh") {
        await deleteNganh(deleteId, token);
        showToast("Xóa ngành thành công", "success");
        await fetchNganh();
      }
      setDeleteId(null);
    } catch (err) {
      showToast("Xóa thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="p-6 text-error">Lỗi: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Quản lý Khoa / Ngành
      </h1>
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === "khoa" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("khoa")}
        >
          Khoa
        </a>
        <a
          className={`tab ${activeTab === "nganh" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("nganh")}
        >
          Ngành
        </a>
      </div>
      {activeTab === "khoa" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Danh sách Khoa</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Mã Khoa</th>
                    <th>Tên Khoa</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {khoaList.map((khoa) => (
                    <tr key={khoa.MaKhoa}>
                      <td>{khoa.MaKhoa}</td>
                      <td>{khoa.TenKhoa}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary btn-outline mr-2"
                          onClick={() => openEditModal("khoa", khoa)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => confirmDelete("khoa", khoa.MaKhoa)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-sm btn-success"
                onClick={() => openAddModal("khoa")}
              >
                Thêm Khoa
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTab === "nganh" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Danh sách Ngành</h2>
            <div className="mb-4">
              <label htmlFor="khoaSelect" className="label">
                <span className="label-text">Chọn Khoa:</span>
              </label>
              <select
                id="khoaSelect"
                className="select select-bordered w-full"
                value={selectedKhoaNganh}
                onChange={(e) => setSelectedKhoaNganh(e.target.value)}
              >
                <option value="">Tất cả các khoa</option>
                {khoaList.map((khoa) => (
                  <option key={khoa.MaKhoa} value={khoa.MaKhoa}>
                    {khoa.TenKhoa}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Mã Ngành</th>
                    <th>Tên Ngành</th>
                    <th>Khoa</th>
                    <th>Mô tả</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {nganhList.map((nganh) => (
                    <tr key={nganh.MaNganh}>
                      <td>{nganh.MaNganh}</td>
                      <td>{nganh.TenNganh}</td>
                      <td>{nganh.TenKhoa}</td>
                      <td>{nganh.MoTa || "Không có mô tả"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary btn-outline mr-2"
                          onClick={() => openEditModal("nganh", nganh)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => confirmDelete("nganh", nganh.MaNganh)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-sm btn-success"
                onClick={() => openAddModal("nganh")}
              >
                Thêm Ngành
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Thêm/Sửa */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editMode
                ? modalType === "khoa"
                  ? "Sửa Khoa"
                  : "Sửa Ngành"
                : modalType === "khoa"
                ? "Thêm Khoa"
                : "Thêm Ngành"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {modalType === "khoa" ? (
                <>
                  <input
                    className="input input-bordered w-full"
                    name="maKhoa"
                    placeholder="Mã Khoa"
                    value={form.maKhoa || ""}
                    onChange={handleChange}
                    required
                    disabled={editMode}
                  />
                  <input
                    className="input input-bordered w-full"
                    name="tenKhoa"
                    placeholder="Tên Khoa"
                    value={form.tenKhoa || ""}
                    onChange={handleChange}
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    className="input input-bordered w-full"
                    name="maNganh"
                    placeholder="Mã Ngành"
                    value={form.maNganh || ""}
                    onChange={handleChange}
                    required
                    disabled={editMode}
                  />
                  <select
                    className="select select-bordered w-full"
                    name="maKhoa"
                    value={form.maKhoa || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn Khoa</option>
                    {khoaList.map((khoa) => (
                      <option key={khoa.MaKhoa} value={khoa.MaKhoa}>
                        {khoa.TenKhoa}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input input-bordered w-full"
                    name="tenNganh"
                    placeholder="Tên Ngành"
                    value={form.tenNganh || ""}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="input input-bordered w-full"
                    name="moTa"
                    placeholder="Mô tả"
                    value={form.moTa || ""}
                    onChange={handleChange}
                  />
                </>
              )}
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
            <p>
              Bạn có chắc muốn xóa {modalType === "khoa" ? "khoa" : "ngành"}{" "}
              này?
            </p>
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

export default KhoaNganhManagement;
