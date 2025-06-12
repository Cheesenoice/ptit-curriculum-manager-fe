import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const KhoikienthucMonhocManagement = () => {
  const [khoikienthucs, setKhoikienthucs] = useState([]);
  const [filteredKhoikienthucs, setFilteredKhoikienthucs] = useState([]);
  const [monhocData, setMonhocData] = useState({});
  const [originalMonhocData, setOriginalMonhocData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMonhoc, setLoadingMonhoc] = useState({});
  const [isSaving, setIsSaving] = useState({});
  const [filter, setFilter] = useState({
    maKhoa: "",
    maNganh: "",
    maChuyenNganh: "",
  });
  const [khoaOptions, setKhoaOptions] = useState([]);
  const [nganhOptions, setNganhOptions] = useState([]);
  const [chuyenNganhOptions, setChuyenNganhOptions] = useState([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const khoaRes = await axios.get("http://localhost:3000/api/khoa", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const nganhRes = await axios.get("http://localhost:3000/api/nganh", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chuyenNganhRes = await axios.get(
          "http://localhost:3000/api/chuyennganh",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setKhoaOptions(khoaRes.data.data || []);
        setNganhOptions(nganhRes.data.data || []);
        setChuyenNganhOptions(chuyenNganhRes.data.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu bộ lọc:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch all khoikienthucs
  useEffect(() => {
    const fetchKhoikienthucs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:3000/api/khoikienthuc", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const flattenedData = flattenKhoiKienThuc(res.data.data);
          setKhoikienthucs(flattenedData);
          setFilteredKhoikienthucs(flattenedData);
        } else {
          console.error("Lỗi lấy dữ liệu:", res.data.message);
        }
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKhoikienthucs();
  }, []);

  // Function to flatten the nested khoikienthuc data
  const flattenKhoiKienThuc = (data, parentId = null) => {
    let result = [];
    data.forEach((item) => {
      result.push({
        MaKhoiKienThuc: item.maKhoiKienThuc,
        TenKhoiKienThuc: item.tenKhoiKienThuc,
        ParentID: item.parentId,
        CapDo: item.level,
        TongSoTinChi: item.tongSoTinChi,
      });
      if (item.khoiKienThucCon && item.khoiKienThucCon.length > 0) {
        result = [
          ...result,
          ...flattenKhoiKienThuc(item.khoiKienThucCon, item.maKhoiKienThuc),
        ];
      }
    });
    return result;
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filter
  const applyFilter = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const { maKhoa, maNganh, maChuyenNganh } = filter;

      const query = new URLSearchParams();
      if (maKhoa) query.append("maKhoa", maKhoa);
      if (maNganh) query.append("maNganh", maNganh);
      if (maChuyenNganh) query.append("maChuyenNganh", maChuyenNganh);

      const res = await axios.get(
        `http://localhost:3000/api/khoikienthuc/filter?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        if (Array.isArray(res.data.data)) {
          const filteredMaKKTs = res.data.data.map(
            (item) => item.maKhoiKienThuc
          );

          if (
            filteredMaKKTs.length === 0 &&
            !maKhoa &&
            !maNganh &&
            !maChuyenNganh
          ) {
            setFilteredKhoikienthucs(khoikienthucs);
          } else {
            const includedIds = new Set(filteredMaKKTs);
            const kktLookup = new Map(
              khoikienthucs.map((kkt) => [kkt.MaKhoiKienThuc, kkt])
            );

            filteredMaKKTs.forEach((id) => {
              let currentId = id;
              while (currentId) {
                const currentKkt = kktLookup.get(currentId);
                if (currentKkt && currentKkt.ParentID) {
                  includedIds.add(currentKkt.ParentID);
                  currentId = currentKkt.ParentID;
                } else {
                  currentId = null;
                }
              }
            });

            const filtered = khoikienthucs.filter((kkt) =>
              includedIds.has(kkt.MaKhoiKienThuc)
            );
            setFilteredKhoikienthucs(filtered);
          }
        } else {
          console.error(
            "API trả về dữ liệu không đúng định dạng mảng:",
            res.data
          );
          setFilteredKhoikienthucs([]);
        }
      } else {
        console.error("Lỗi lọc dữ liệu từ API:", res.data.message);
        setFilteredKhoikienthucs([]);
      }
    } catch (error) {
      console.error("Lỗi gọi API lọc:", error);
      setFilteredKhoikienthucs([]);
      alert("Đã xảy ra lỗi khi thực hiện lọc.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setFilter({ maKhoa: "", maNganh: "", maChuyenNganh: "" });
    setFilteredKhoikienthucs(khoikienthucs);
  };

  const buildTree = (data, parentId = null) =>
    data
      .filter((item) => item.ParentID === parentId)
      .map((item) => ({
        ...item,
        children: buildTree(data, item.MaKhoiKienThuc),
      }));

  const getColorClasses = (capDo) => {
    switch (capDo) {
      case 0:
        return "bg-primary-content text-secondary-content";
      case 1:
        return "bg-white text-secondary-content";
      case 2:
        return "bg-neutral-content text-accent-content";
      default:
        return "bg-neutral text-neutral-content";
    }
  };

  const handleExpand = async (maKKT) => {
    if (monhocData[maKKT]) return;
    try {
      setLoadingMonhoc((prev) => ({ ...prev, [maKKT]: true }));
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        `http://localhost:3000/api/khoikienthuc/${maKKT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        // Map the new response to include ThuTu
        const danhSachMonHoc = res.data.data.map((mh, index) => ({
          MaMonHoc: mh.MaMonHoc,
          TenMonHoc: mh.TenMonHoc,
          SoTinChi: mh.SoTinChi,
          ThuTu: index + 1, // Assign default ThuTu based on index
        }));
        setMonhocData((prev) => ({ ...prev, [maKKT]: danhSachMonHoc }));
        setOriginalMonhocData((prev) => ({
          ...prev,
          [maKKT]: [...danhSachMonHoc],
        }));
      } else {
        console.error("Lỗi lấy môn học:", res.data.message);
      }
    } catch (error) {
      console.error("Lỗi gọi API môn học:", error);
    } finally {
      setLoadingMonhoc((prev) => ({ ...prev, [maKKT]: false }));
    }
  };

  const handleMove = (maKKT, index, direction) => {
    const newMonhocs = [...monhocData[maKKT]];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMonhocs.length) return;

    const tempThuTu = newMonhocs[index].ThuTu;
    newMonhocs[index].ThuTu = newMonhocs[targetIndex].ThuTu;
    newMonhocs[targetIndex].ThuTu = tempThuTu;

    [newMonhocs[index], newMonhocs[targetIndex]] = [
      newMonhocs[targetIndex],
      newMonhocs[index],
    ];

    setMonhocData((prev) => ({ ...prev, [maKKT]: newMonhocs }));
  };

  const handleSave = async (maKKT) => {
    try {
      setIsSaving((prev) => ({ ...prev, [maKKT]: true }));
      const token = localStorage.getItem("access_token");
      const payload = {
        danhSachMonHoc: monhocData[maKKT].map((mh) => ({
          maMonHoc: mh.MaMonHoc,
          thuTu: mh.ThuTu,
        })),
      };
      const res = await axios.put(
        `http://localhost:3000/api/khoikienthuc/${maKKT}/thutu-monhoc`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("Cập nhật thứ tự môn học thành công!");
        setOriginalMonhocData((prev) => ({
          ...prev,
          [maKKT]: [...monhocData[maKKT]],
        }));
      } else {
        alert("Lỗi cập nhật thứ tự: " + res.data.message);
      }
    } catch (error) {
      alert("Lỗi gọi API cập nhật: " + error.message);
    } finally {
      setIsSaving((prev) => ({ ...prev, [maKKT]: false }));
    }
  };

  const handleCancel = (maKKT) => {
    setMonhocData((prev) => ({
      ...prev,
      [maKKT]: [...originalMonhocData[maKKT]],
    }));
  };

  const renderMonhocs = (maKKT) => {
    const monhocs = monhocData[maKKT];
    if (!monhocs || monhocs.length === 0) return null;

    return (
      <div className="mt-2">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr>
                <th>Thứ tự</th>
                <th>Mã môn</th>
                <th>Tên môn</th>
                <th>Số tín chỉ</th>
                <th>Tùy chỉnh</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {monhocs.map((mh, index) => (
                  <tr key={mh.MaMonHoc}>
                    <td>{mh.ThuTu}</td>
                    <motion.td
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mh.MaMonHoc}
                    </motion.td>
                    <motion.td
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mh.TenMonHoc}
                    </motion.td>
                    <motion.td
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mh.SoTinChi}
                    </motion.td>
                    <motion.td
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMove(maKKT, index, "up")}
                          disabled={index === 0}
                          className="btn btn-xs btn-success"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => handleMove(maKKT, index, "down")}
                          disabled={index === monhocs.length - 1}
                          className="btn btn-xs btn-error"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </motion.td>
                  </tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right flex justify-end gap-2">
          <button
            onClick={() => handleCancel(maKKT)}
            disabled={isSaving[maKKT]}
            className="btn btn-outline btn-error"
          >
            Hủy
          </button>
          <button
            onClick={() => handleSave(maKKT)}
            disabled={isSaving[maKKT]}
            className="btn btn-primary"
          >
            {isSaving[maKKT] ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderTree = (nodes) =>
    nodes.map((node) => (
      <div key={node.MaKhoiKienThuc} className="mb-2">
        <div
          className={`collapse collapse-arrow shadow ${getColorClasses(
            node.CapDo
          )}`}
          onClick={() => handleExpand(node.MaKhoiKienThuc)}
        >
          <input type="checkbox" />
          <div className="collapse-title font-semibold text-base">
            {node.TenKhoiKienThuc}
            <span className="ml-2 text-sm opacity-80">
              ({node.MaKhoiKienThuc} - {node.TongSoTinChi} tín chỉ)
            </span>
          </div>
          <div className="collapse-content">
            {node.children?.length > 0 && (
              <div className="ml-4">{renderTree(node.children)}</div>
            )}
            {loadingMonhoc[node.MaKhoiKienThuc] ? (
              <div className="mt-2 text-sm">Đang tải môn học...</div>
            ) : (
              renderMonhocs(node.MaKhoiKienThuc)
            )}
          </div>
        </div>
      </div>
    ));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Khối Kiến Thức & Môn Học
      </h1>
      <div className="mb-6 bg-base-100 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Lọc khối kiến thức</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Khoa</label>
            <select
              name="maKhoa"
              value={filter.maKhoa}
              onChange={handleFilterChange}
              className="select select-bordered w-full"
            >
              <option value="">Chọn khoa</option>
              {khoaOptions.map((khoa) => (
                <option key={khoa.MaKhoa} value={khoa.MaKhoa}>
                  {khoa.TenKhoa}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngành</label>
            <select
              name="maNganh"
              value={filter.maNganh}
              onChange={handleFilterChange}
              className="select select-bordered w-full"
            >
              <option value="">Chọn ngành</option>
              {nganhOptions.map((nganh) => (
                <option key={nganh.MaNganh} value={nganh.MaNganh}>
                  {nganh.TenNganh}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Chuyên ngành
            </label>
            <select
              name="maChuyenNganh"
              value={filter.maChuyenNganh}
              onChange={handleFilterChange}
              className="select select-bordered w-full"
            >
              <option value="">Chọn chuyên ngành</option>
              {chuyenNganhOptions.map((chuyenNganh) => (
                <option
                  key={chuyenNganh.MaChuyenNganh}
                  value={chuyenNganh.MaChuyenNganh}
                >
                  {chuyenNganh.TenChuyenNganh}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-end gap-2">
            <button
              onClick={applyFilter}
              className="btn btn-primary w-full md:w-auto"
            >
              Lọc
            </button>
            <button
              onClick={resetFilter}
              className="btn btn-outline btn-error w-full md:w-auto"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-lg">Đang tải khối kiến thức...</div>
      ) : (
        renderTree(buildTree(filteredKhoikienthucs))
      )}
    </div>
  );
};

export default KhoikienthucMonhocManagement;
