import React, { useEffect, useState } from "react";
import XemMonHocModal from "./XemMonHocModal";

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
  const [search, setSearch] = useState("");
  const [monhocMap, setMonhocMap] = useState({});

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
    const monhocResult = {};
    await Promise.all(
      flatKKT.map(async (maKKT) => {
        const res = await fetchMonhocByMaKKT(maKKT);
        result[maKKT] =
          res.success && Array.isArray(res.data) && res.data.length > 0;
        monhocResult[maKKT] =
          res.success && Array.isArray(res.data) ? res.data : [];
      })
    );
    setHasMonhocMap(result);
    setMonhocMap(monhocResult);
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

  const filterTree = (nodes, keyword) => {
    if (!Array.isArray(nodes)) return [];
    const lower = keyword.trim().toLowerCase();
    return nodes
      .map((node) => {
        const matchKKT = node.tenKhoiKienThuc.toLowerCase().includes(lower);
        const monList = monhocMap[node.maKhoiKienThuc] || [];
        const matchMon = monList.some((m) =>
          m.TenMonHoc?.toLowerCase().includes(lower)
        );
        const filteredChildren = filterTree(node.khoiKienThucCon, keyword);
        if (matchKKT || matchMon || filteredChildren.length > 0) {
          return {
            ...node,
            khoiKienThucCon: filteredChildren,
          };
        }
        return null;
      })
      .filter(Boolean);
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
      <input
        className="input input-bordered w-full max-w-xl mb-4"
        placeholder="Tìm kiếm theo tên khối kiến thức hoặc tên môn học..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {renderTree(filterTree(kktData, search))}
      {showModal && selectedKKT && (
        <XemMonHocModal
          selectedKKT={selectedKKT}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default KhoikienthucMonhocManagement;
