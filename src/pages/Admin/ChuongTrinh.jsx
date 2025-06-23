import React, { useEffect, useState } from "react";
import {
  getAllCtdt,
  addCtdt,
  deleteCtdt,
  updateCtdt,
} from "../../api/services/ctdtService";
import { showToast } from "../../components/Common/showToast";
import { getAllNganh } from "../../api/services/nganhService";

const ChuongTrinh = () => {
  const [ctdtList, setCtdtList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    maChuongTrinh: "",
    tenChuongTrinh: "",
    maNganh: "",
    trinhDoDaoTao: "",
    hinhThucDaoTao: "",
    namApDung: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [nganhList, setNganhList] = useState([]);
  const [nganhMap, setNganhMap] = useState({});

  const years = Array.from({ length: 2050 - 2010 + 1 }, (_, i) => 2010 + i);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        const [ctdtRes, nganhRes] = await Promise.all([
          getAllCtdt(token),
          getAllNganh(token),
        ]);
        setCtdtList(ctdtRes.data.data);
        setNganhList(nganhRes.data.data || []);
        // Tạo map mã ngành -> tên ngành
        const map = {};
        (nganhRes.data.data || []).forEach((n) => {
          map[n.MaNganh] = n.TenNganh;
        });
        setNganhMap(map);
      } catch (err) {
        setError("Không thể lấy danh sách chương trình đào tạo");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAddModal = async () => {
    setForm({
      maChuongTrinh: "",
      tenChuongTrinh: "",
      maNganh: "",
      trinhDoDaoTao: "",
      hinhThucDaoTao: "",
      namApDung: "",
    });
    setEditMode(false);
    setCurrentEdit(null);
    setModalOpen(true);
    // Lấy danh sách ngành
    try {
      const token = localStorage.getItem("access_token");
      const res = await getAllNganh(token);
      setNganhList(res.data.data || []);
    } catch {}
  };
  const openEditModal = async (ct) => {
    setForm({
      maChuongTrinh: ct.MaChuongTrinh,
      tenChuongTrinh: ct.TenChuongTrinh,
      maNganh: ct.MaNganh,
      trinhDoDaoTao: ct.TrinhDoDaoTao,
      hinhThucDaoTao: ct.HinhThucDaoTao,
      namApDung: ct.NamApDung,
    });
    setEditMode(true);
    setCurrentEdit(ct);
    setModalOpen(true);
    // Lấy danh sách ngành
    try {
      const token = localStorage.getItem("access_token");
      const res = await getAllNganh(token);
      setNganhList(res.data.data || []);
    } catch {}
  };
  const closeModal = () => setModalOpen(false);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    // Validate
    const required = [
      "maChuongTrinh",
      "tenChuongTrinh",
      "maNganh",
      "trinhDoDaoTao",
      "hinhThucDaoTao",
      "namApDung",
    ];
    for (let key of required) {
      if (!form[key]) {
        showToast("Vui lòng nhập đủ thông tin", "error");
        return;
      }
    }
    try {
      setLoading(true);
      if (editMode) {
        await updateCtdt({ ...form, namApDung: Number(form.namApDung) }, token);
        showToast("Cập nhật thành công", "success");
      } else {
        await addCtdt({ ...form, namApDung: Number(form.namApDung) }, token);
        showToast("Thêm thành công", "success");
      }
      // Refresh
      const res = await getAllCtdt(token);
      setCtdtList(res.data.data);
      closeModal();
    } catch (err) {
      showToast("Có lỗi xảy ra", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => setDeleteId(id);
  const handleDelete = async () => {
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true);
      await deleteCtdt(deleteId, token);
      showToast("Xóa thành công", "success");
      setCtdtList((prev) => prev.filter((ct) => ct.MaChuongTrinh !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showToast("Xóa thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Quản lý Chương trình đào tạo
          </h1>
          <p className="text-lg text-base-content">
            Danh sách các chương trình đào tạo
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          Thêm chương trình
        </button>
      </div>
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
                    <th>Mã CTĐT</th>
                    <th>Tên CTĐT</th>
                    <th>Mã Ngành</th>
                    <th>Tên Ngành</th>
                    <th>Trình độ</th>
                    <th>Hình thức</th>
                    <th>Năm áp dụng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {ctdtList.map((ct) => (
                    <tr key={ct.MaChuongTrinh}>
                      <td>{ct.MaChuongTrinh}</td>
                      <td>{ct.TenChuongTrinh}</td>
                      <td>{ct.MaNganh}</td>
                      <td>{nganhMap[ct.MaNganh] || ""}</td>
                      <td>{ct.TrinhDoDaoTao}</td>
                      <td>{ct.HinhThucDaoTao}</td>
                      <td>{ct.NamApDung}</td>
                      <td>
                        <button
                          className="btn btn-xs btn-info mr-2"
                          onClick={() => openEditModal(ct)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => confirmDelete(ct.MaChuongTrinh)}
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
              {editMode
                ? "Sửa chương trình đào tạo"
                : "Thêm chương trình đào tạo"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input input-bordered w-full"
                name="maChuongTrinh"
                placeholder="Mã chương trình"
                value={form.maChuongTrinh}
                onChange={handleChange}
                required
                disabled={editMode}
              />
              <input
                className="input input-bordered w-full"
                name="tenChuongTrinh"
                placeholder="Tên chương trình"
                value={form.tenChuongTrinh}
                onChange={handleChange}
                required
              />
              <select
                className="select select-bordered w-full"
                name="maNganh"
                value={form.maNganh}
                onChange={handleChange}
                required
              >
                <option value="">Chọn ngành</option>
                {nganhList.map((nganh) => (
                  <option key={nganh.MaNganh} value={nganh.MaNganh}>
                    {nganh.TenNganh}
                  </option>
                ))}
              </select>
              <input
                className="input input-bordered w-full"
                name="trinhDoDaoTao"
                placeholder="Trình độ đào tạo"
                value={form.trinhDoDaoTao}
                onChange={handleChange}
                required
              />
              <input
                className="input input-bordered w-full"
                name="hinhThucDaoTao"
                placeholder="Hình thức đào tạo"
                value={form.hinhThucDaoTao}
                onChange={handleChange}
                required
              />
              <select
                className="select select-bordered w-full"
                name="namApDung"
                value={form.namApDung}
                onChange={handleChange}
                required
              >
                <option value="">Chọn năm áp dụng</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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
            <p>Bạn có chắc muốn xóa chương trình này?</p>
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

export default ChuongTrinh;
