import React, { useEffect, useState } from "react";
import {
  getAllCtdt,
  addCtdt,
  deleteCtdt,
} from "../../api/services/ctdtService";
import { showToast } from "../../components/Common/showToast";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        const res = await getAllCtdt(token);
        setCtdtList(res.data.data);
      } catch (err) {
        setError("Không thể lấy danh sách chương trình đào tạo");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAddModal = () => {
    setForm({
      maChuongTrinh: "",
      tenChuongTrinh: "",
      maNganh: "",
      trinhDoDaoTao: "",
      hinhThucDaoTao: "",
      namApDung: "",
    });
    setModalOpen(true);
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
      await addCtdt({ ...form, namApDung: Number(form.namApDung) }, token);
      showToast("Thêm thành công", "success");
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
                      <td>{ct.TrinhDoDaoTao}</td>
                      <td>{ct.HinhThucDaoTao}</td>
                      <td>{ct.NamApDung}</td>
                      <td>
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
      {/* Modal Thêm */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Thêm chương trình đào tạo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input input-bordered w-full"
                name="maChuongTrinh"
                placeholder="Mã chương trình"
                value={form.maChuongTrinh}
                onChange={handleChange}
                required
              />
              <input
                className="input input-bordered w-full"
                name="tenChuongTrinh"
                placeholder="Tên chương trình"
                value={form.tenChuongTrinh}
                onChange={handleChange}
                required
              />
              <input
                className="input input-bordered w-full"
                name="maNganh"
                placeholder="Mã ngành"
                value={form.maNganh}
                onChange={handleChange}
                required
              />
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
              <input
                className="input input-bordered w-full"
                name="namApDung"
                placeholder="Năm áp dụng"
                value={form.namApDung}
                onChange={handleChange}
                required
                type="number"
                min="2000"
                max="2100"
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
                  Thêm
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
