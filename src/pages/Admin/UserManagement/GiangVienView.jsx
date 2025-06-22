import React, { useEffect, useState } from "react";
import {
  getAllMonHoc,
  getMonHocByGiangVien,
  updateMonHocGiangVien,
} from "../../../api/services/monHocService";
import { showToast } from "../../../components/Common/showToast";

const GiangVienView = ({ lecturer, open, onClose, onSaved }) => {
  const [monList, setMonList] = useState([]);
  const [selectedMon, setSelectedMon] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && lecturer) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("access_token");
          const [allMonRes, gvMonRes] = await Promise.all([
            getAllMonHoc(token),
            getMonHocByGiangVien(lecturer.MaGiangVien, token),
          ]);
          setMonList(allMonRes.data.data || []);
          setSelectedMon(gvMonRes.data.data?.map((m) => m.MaMonHoc) || []);
        } catch (err) {
          showToast("Không thể tải danh sách môn học", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setMonList([]);
      setSelectedMon([]);
    }
  }, [open, lecturer]);

  const handleMonCheck = (maMonHoc) => {
    setSelectedMon((prev) =>
      prev.includes(maMonHoc)
        ? prev.filter((m) => m !== maMonHoc)
        : [...prev, maMonHoc]
    );
  };

  const handleSaveMon = async () => {
    if (!lecturer) return;
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true);
      await updateMonHocGiangVien(
        lecturer.MaGiangVien,
        selectedMon.join(","),
        token
      );
      showToast("Cập nhật môn dạy thành công", "success");
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      showToast("Cập nhật thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Môn học của giảng viên: {lecturer?.HoTen}
        </h2>
        <div className="max-h-80 overflow-y-auto border rounded p-2 mb-4">
          {loading ? (
            <div>Đang tải...</div>
          ) : monList.length === 0 ? (
            <div>Không có môn học nào.</div>
          ) : (
            <ul className="space-y-2">
              {monList.map((mon) => (
                <li key={mon.MaMonHoc} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedMon.includes(mon.MaMonHoc)}
                    onChange={() => handleMonCheck(mon.MaMonHoc)}
                    id={`monhoc-${mon.MaMonHoc}`}
                  />
                  <label htmlFor={`monhoc-${mon.MaMonHoc}`}>
                    {mon.TenMonHoc}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSaveMon}
            disabled={loading}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiangVienView;
