import React, { useEffect, useState } from "react";
import { fetchMonhocByMaKKT } from "../../../api/services/khoiKienThucService";

const XemMonHocModal = ({ selectedKKT, onClose }) => {
  const [monhocs, setMonhocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedKKT) return;

    const fetchData = async () => {
      const res = await fetchMonhocByMaKKT(selectedKKT.maKhoiKienThuc);
      if (res.success) {
        setMonhocs(res.data);
      } else {
        console.error("Không lấy được môn học:", res.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedKKT]);

  return (
    <dialog open className="modal modal-open">
      <form method="dialog" className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mb-4">
          Danh sách môn học – {selectedKKT?.tenKhoiKienThuc}
        </h3>

        {loading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra text-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã môn</th>
                  <th>Tên môn học</th>
                  <th>Số TC</th>
                  <th>LT</th>
                  <th>BT</th>
                  <th>TH</th>
                  <th>Tự học</th>
                  <th>Ngôn ngữ</th>
                  <th>Loại môn</th>
                </tr>
              </thead>
              <tbody>
                {monhocs.map((mh, idx) => (
                  <tr key={mh.MaMonHoc}>
                    <td>{idx + 1}</td>
                    <td>{mh.MaMonHoc}</td>
                    <td>{mh.TenMonHoc}</td>
                    <td>{mh.SoTinChi}</td>
                    <td>{mh.SoTietLiThuyet}</td>
                    <td>{mh.SoTietBaiTap}</td>
                    <td>{mh.SoTietThucHanh}</td>
                    <td>{mh.SoTietTuHoc}</td>
                    <td>{mh.NgonNguDay}</td>
                    <td>{mh.LoaiMon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default XemMonHocModal;
