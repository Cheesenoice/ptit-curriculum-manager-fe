import React, { useEffect, useState } from "react";
import XemMonHocModal from "./XemMonHocModal";
import AddEditKhoiKienThuc from "./AddEditKhoiKienThuc";

import {
  fetchAllKhoiKienThuc,
  fetchMonhocByMaKKT,
  deleteKhoiKienThuc,
} from "../../../api/services/khoiKienThucService";
import { showToast } from "../../../components/Common/showToast";

const KhoikienthucMonhocManagement = () => {
  const [kktData, setKktData] = useState([]);
  const [hasMonhocMap, setHasMonhocMap] = useState({});
  const [selectedKKT, setSelectedKKT] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editKKT, setEditKKT] = useState(null);
  const [showAddKKT, setShowAddKKT] = useState(false);

  const [editForm, setEditForm] = useState({
    tenKhoiKienThuc: "",
    parentId: "",
  });

  const checkHasMonhoc = async (data) => {
    const flatKKT = [];
    const collectKKT = (list) => {
      list.forEach((node) => {
        flatKKT.push(node.maKhoiKienThuc);
        if (Array.isArray(node.khoiKienThucCon)) {
          collectKKT(node.khoiKienThucCon);
        }
      });
    };
    collectKKT(data);

    const result = {};
    await Promise.all(
      flatKKT.map(async (maKKT) => {
        const res = await fetchMonhocByMaKKT(maKKT);
        result[maKKT] =
          res.success && Array.isArray(res.data) && res.data.length > 0;
      })
    );
    setHasMonhocMap(result);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAllKhoiKienThuc();
      if (res.success) {
        setKktData(res.data);
        checkHasMonhoc(res.data);
      } else {
        showToast("Không lấy được danh sách KKT", "error");
      }
    };
    fetchData();
  }, []);

  const handleShowMonhoc = (kkt) => {
    setSelectedKKT(kkt);
    setShowModal(true);
  };

  const renderTree = (nodes) => {
    if (!Array.isArray(nodes)) return null;

    return nodes.map((node) => (
      <div key={node.maKhoiKienThuc} className="mb-2">
        <div className="collapse collapse-arrow bg-base-100 shadow">
          <input type="checkbox" />
          <div className="collapse-title font-medium">
            <span className="text-lg font-semibold">
              {node.tenKhoiKienThuc}
            </span>
            <div className="text-sm opacity-70">
              Mã: {node.maKhoiKienThuc} – {node.tongSoTinChi} tín chỉ
            </div>
          </div>
          <div className="collapse-content ml-4">
            <button
              className="btn btn-sm btn-warning mb-3 "
              onClick={(e) => {
                e.stopPropagation();
                setEditKKT(node);
                setEditForm({
                  tenKhoiKienThuc: node.tenKhoiKienThuc || "",
                  parentId: node.parentId || "",
                });
              }}
            >
              Sửa
            </button>

            <button
              className="btn btn-sm btn-error mb-3 ml-2"
              onClick={async (e) => {
                e.stopPropagation();
                const confirmDelete = window.confirm(
                  `Bạn có chắc chắn muốn xóa "${node.tenKhoiKienThuc}" không?`
                );
                if (!confirmDelete) return;

                const res = await deleteKhoiKienThuc(node.maKhoiKienThuc);
                if (res.success) {
                  showToast("Đã xóa khối kiến thức", "success");
                  setTimeout(() => window.location.reload(), 500);
                } else {
                  showToast("Lỗi: " + res.message, "error");
                }
              }}
            >
              Xóa
            </button>

            {hasMonhocMap[node.maKhoiKienThuc] && (
              <button
                className="btn btn-sm btn-primary mb-3 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowMonhoc(node);
                }}
              >
                Xem môn học
              </button>
            )}
            {node.khoiKienThucCon?.length > 0 &&
              renderTree(node.khoiKienThucCon)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">
        Quản lý Khối Kiến Thức & Môn Học
      </h1>

      <button
        className="btn btn-success mb-4"
        onClick={() => setShowAddKKT(true)}
      >
        + Thêm Khối Kiến Thức
      </button>

      {renderTree(kktData)}

      {showModal && selectedKKT && (
        <XemMonHocModal
          selectedKKT={selectedKKT}
          onClose={() => setShowModal(false)}
        />
      )}

      {editKKT && (
        <AddEditKhoiKienThuc
          kktData={kktData}
          editKKT={editKKT}
          onClose={() => setEditKKT(null)}
          onSuccess={() => {
            setEditKKT(null);
            setTimeout(() => window.location.reload(), 500);
          }}
        />
      )}
      {showAddKKT && (
        <AddEditKhoiKienThuc
          kktData={kktData}
          editKKT={null}
          onClose={() => setShowAddKKT(false)}
          onSuccess={() => {
            setShowAddKKT(false);
            setTimeout(() => window.location.reload(), 500);
          }}
        />
      )}
    </div>
  );
};

export default KhoikienthucMonhocManagement;
