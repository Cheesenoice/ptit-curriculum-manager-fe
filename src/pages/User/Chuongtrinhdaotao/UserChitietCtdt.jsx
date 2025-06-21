import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Loader2, Plus, Edit2, Check, X } from "lucide-react";

// Axios instance with token
const axiosAuth = axios.create({
  baseURL: "http://localhost:3000",
});

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Chi tiết chương trình đào tạo
const UserChitietCtdt = () => {
  const [chuongtrinh, setChuongtrinh] = useState(null);
  const [khoiKienThuc, setKhoiKienThuc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMonTuChonModal, setShowMonTuChonModal] = useState(false);
  const [selectedKhoiKienThuc, setSelectedKhoiKienThuc] = useState(null);
  const [monHocList, setMonHocList] = useState([]);
  const [loadingMonHoc, setLoadingMonHoc] = useState(false);
  // Thêm state cho chuyên ngành
  const [chuyenNganh, setChuyenNganh] = useState([]);
  const [loadingChuyenNganh, setLoadingChuyenNganh] = useState(false);
  // Thêm state mới
  const [selectedChuyenNganh, setSelectedChuyenNganh] = useState(null);
  const [selectedMonTuChon, setSelectedMonTuChon] = useState(null);
  const [selectedHocKy, setSelectedHocKy] = useState(null);

  // State mới cho việc chỉnh sửa học kỳ
  const [editingHocKy, setEditingHocKy] = useState(null); // {maMonHoc, hocKyHienTai}
  const [newHocKy, setNewHocKy] = useState("");
  const [savingHocKy, setSavingHocKy] = useState(false);
  // Thêm state mới cho chế độ hiển thị
  const [displayMode, setDisplayMode] = useState("khoiKienThuc"); // 'khoiKienThuc' hoặc 'hocKy'

  // Thêm state mới cho danh sách môn tự chọn
  const [danhSachMonTuChon, setDanhSachMonTuChon] = useState([]);

  const location = useLocation();

  // Hàm tính tổng số tín chỉ của một khối kiến thức
  const tinhTongTinChi = (maKhoiKienThuc, danhSachMonHoc) => {
    if (!danhSachMonHoc) return 0;
    return danhSachMonHoc
      .filter((mon) => mon.maKhoiKienThuc === maKhoiKienThuc)
      .reduce((tong, mon) => tong + (mon.soTinChi || 0), 0);
  };

  // Hàm lọc khối kiến thức dựa trên danh sách môn học
  const filterKhoiKienThuc = (khoiKienThucList, danhSachMonHoc) => {
    if (!danhSachMonHoc || !khoiKienThucList) return [];

    // Tạo set các mã khối kiến thức có trong danh sách môn học
    const maKhoiKienThucSet = new Set(
      danhSachMonHoc.map((mon) => mon.maKhoiKienThuc)
    );

    // Hàm đệ quy để lọc khối kiến thức
    const filterKhoi = (khoi) => {
      // Kiểm tra xem khối kiến thức có trong danh sách môn học không
      const hasSubjects = maKhoiKienThucSet.has(khoi.maKhoiKienThuc);

      // Lọc các khối con
      const filteredChildren = khoi.khoiKienThucCon
        ? khoi.khoiKienThucCon.map(filterKhoi).filter((child) => child !== null)
        : [];

      // Nếu khối này có môn học hoặc có khối con được giữ lại
      if (hasSubjects || filteredChildren.length > 0) {
        return {
          ...khoi,
          khoiKienThucCon: filteredChildren,
          tongSoTinChi: tinhTongTinChi(khoi.maKhoiKienThuc, danhSachMonHoc),
        };
      }

      return null;
    };

    return khoiKienThucList.map(filterKhoi).filter((khoi) => khoi !== null);
  };

  useEffect(() => {
    const fetchKhoiKienThuc = async () => {
      try {
        const res = await axiosAuth.get("/api/khoikienthuc");
        if (res.data.success) {
          setKhoiKienThuc(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy khối kiến thức:", err);
      }
    };

    fetchKhoiKienThuc();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const maChuongTrinh = params.get("maChuongTrinh");

    const fetchChuongTrinh = async () => {
      setLoading(true);
      try {
        const res = await axiosAuth.get(
          `/api/chuongtrinhdaotao/${maChuongTrinh}`
        );
        if (res.data.success) {
          setChuongtrinh(res.data.data);
        } else {
          setChuongtrinh(null);
        }
      } catch (err) {
        console.error("Lỗi lấy chương trình đào tạo:", err);
        setChuongtrinh(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchChuyenNganh = async () => {
      setLoadingChuyenNganh(true);
      try {
        const res = await axiosAuth.get(
          `/api/chuongtrinhdaotao/${maChuongTrinh}/chuyennganh`
        );
        if (res.data.success) {
          setChuyenNganh(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin chuyên ngành:", err);
      } finally {
        setLoadingChuyenNganh(false);
      }
    };

    if (maChuongTrinh) {
      fetchChuongTrinh();
      fetchChuyenNganh();
    }
  }, [location.search]);

  // Hàm lấy danh sách môn học theo khối kiến thức
  const fetchMonHocByKhoiKienThuc = async (maKhoiKienThuc) => {
    setLoadingMonHoc(true);
    try {
      const res = await axiosAuth.get(`/api/khoikienthuc/${maKhoiKienThuc}`);
      if (res.data.success) {
        // Chuyển đổi tên trường từ PascalCase sang camelCase
        const monHocList = res.data.data.map((mon) => ({
          maMonHoc: mon.MaMonHoc,
          tenMonHoc: mon.TenMonHoc,
          soTinChi: mon.SoTinChi,
          soTietLiThuyet: mon.SoTietLiThuyet,
          soTietBaiTap: mon.SoTietBaiTap,
          soTietThucHanh: mon.SoTietThucHanh,
          soTietTuHoc: mon.SoTietTuHoc,
          ngonNguDay: mon.NgonNguDay,
          loaiMon: mon.LoaiMon,
          maKhoiKienThuc: mon.MaKhoiKienThuc,
          tenKhoiKienThuc: mon.TenKhoiKienThuc,
          maMonHocTienQuyet: mon.MaMonHocTienQuyet,
          tenMonHocTienQuyet: mon.TenMonHocTienQuyet,
          tenMonHocTiengAnh: mon.TenMonHocTiengAnh,
        }));
        setMonHocList(monHocList);
      } else {
        setMonHocList([]);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách môn học:", err);
      setMonHocList([]);
    } finally {
      setLoadingMonHoc(false);
    }
  };

  // Hàm thêm môn học vào chương trình
  const handleThemMonHoc = async (maMonHoc) => {
    try {
      const params = new URLSearchParams(location.search);
      const maChuongTrinh = params.get("maChuongTrinh");

      const res = await axiosAuth.post(
        `/api/chuongtrinhdaotao/${maChuongTrinh}`,
        {
          maMonHoc: maMonHoc,
          hocky: null, // Thêm học kỳ mặc định là null
        }
      );

      if (res.data.success) {
        // Refresh lại dữ liệu chương trình
        const chuongTrinhRes = await axiosAuth.get(
          `/api/chuongtrinhdaotao/${maChuongTrinh}`
        );
        if (chuongTrinhRes.data.success) {
          setChuongtrinh(chuongTrinhRes.data.data);
        }
        setShowModal(false);
        setSelectedKhoiKienThuc(null);
        setMonHocList([]);
        alert("Thêm môn học thành công!");
      }
    } catch (err) {
      console.error("Lỗi thêm môn học:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi thêm môn học");
    }
  };

  // Hàm cập nhật học kỳ môn học
  const handleCapNhatHocKy = async (maMonHoc, hocKyMoi) => {
    try {
      setSavingHocKy(true);
      const params = new URLSearchParams(location.search);
      const maChuongTrinh = params.get("maChuongTrinh");

      const res = await axiosAuth.patch(
        `/api/chuongtrinhdaotao/${maChuongTrinh}/monhoc/${maMonHoc}`,
        {
          hocky: hocKyMoi,
        }
      );

      if (res.data.success) {
        // Refresh lại dữ liệu chương trình
        const chuongTrinhRes = await axiosAuth.get(
          `/api/chuongtrinhdaotao/${maChuongTrinh}`
        );
        if (chuongTrinhRes.data.success) {
          setChuongtrinh(chuongTrinhRes.data.data);
        }
        setEditingHocKy(null);
        setNewHocKy("");
        alert("Cập nhật học kỳ thành công!");
      }
    } catch (err) {
      console.error("Lỗi cập nhật học kỳ:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật học kỳ");
    } finally {
      setSavingHocKy(false);
    }
  };

  // Hàm xóa môn học
  const handleXoaMonHoc = async (maMonHoc) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa môn học này khỏi chương trình đào tạo?"
      )
    ) {
      return;
    }

    try {
      const params = new URLSearchParams(location.search);
      const maChuongTrinh = params.get("maChuongTrinh");

      const res = await axiosAuth.delete(
        `/api/chuongtrinhdaotao/${maChuongTrinh}/monhoc/${maMonHoc}`
      );

      if (res.data.success) {
        // Refresh lại dữ liệu chương trình
        const chuongTrinhRes = await axiosAuth.get(
          `/api/chuongtrinhdaotao/${maChuongTrinh}`
        );
        if (chuongTrinhRes.data.success) {
          setChuongtrinh(chuongTrinhRes.data.data);
        }
        alert("Xóa môn học thành công!");
      }
    } catch (err) {
      console.error("Lỗi xóa môn học:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xóa môn học");
    }
  };

  const MonHocTable = ({ subjects }) => {
    // Sắp xếp môn học theo loại môn
    const sortedSubjects = [...subjects]
      .filter((mon) => !/^[1-9]$/.test(mon.maMonHoc)) // Lọc bỏ môn tự chọn
      .sort((a, b) => {
        const loaiMonOrder = {
          "Bắt buộc": 1,
          "Tự chọn": 2,
          "Thay thế tốt nghiệp": 3,
        };
        return loaiMonOrder[a.loaiMon] - loaiMonOrder[b.loaiMon];
      });

    // Danh sách học kỳ có thể chọn
    const danhSachHocKy = [
      "HK01",
      "HK02",
      "HK03",
      "HK04",
      "HK05",
      "HK06",
      "HK07",
      "HK08",
      "HK09",
    ];

    // Hàm kiểm tra môn học có thể chuyển sang học kỳ nào
    const getAvailableHocKy = (mon) => {
      let minHocKy = 1;

      // Kiểm tra môn tiên quyết
      if (mon.maMonHocTienQuyet) {
        const monTienQuyet = chuongtrinh?.danhSachMonHoc?.find(
          (m) => m.maMonHoc === mon.maMonHocTienQuyet
        );
        if (monTienQuyet && monTienQuyet.hocKy) {
          const hocKyTienQuyet = parseInt(
            monTienQuyet.hocKy.replace("HK", "").replace(/^0+/, "")
          );
          minHocKy = Math.max(minHocKy, hocKyTienQuyet + 1);
        }
      }

      // Kiểm tra môn học trước
      if (mon.maMonHocTruoc) {
        const monTruoc = chuongtrinh?.danhSachMonHoc?.find(
          (m) => m.maMonHoc === mon.maMonHocTruoc
        );
        if (monTruoc && monTruoc.hocKy) {
          const hocKyTruoc = parseInt(
            monTruoc.hocKy.replace("HK", "").replace(/^0+/, "")
          );
          minHocKy = Math.max(minHocKy, hocKyTruoc + 1);
        }
      }

      // Kiểm tra các môn phụ thuộc vào môn này
      let maxHocKy = 9;
      const monPhuThuoc = chuongtrinh?.danhSachMonHoc?.filter(
        (m) =>
          m.maMonHocTienQuyet === mon.maMonHoc ||
          m.maMonHocTruoc === mon.maMonHoc
      );

      if (monPhuThuoc?.length > 0) {
        for (const monSau of monPhuThuoc) {
          if (monSau.hocKy) {
            const hocKyMonSau = parseInt(
              monSau.hocKy.replace("HK", "").replace(/^0+/, "")
            );
            maxHocKy = Math.min(maxHocKy, hocKyMonSau - 1);
          }
        }
      }

      return danhSachHocKy.filter((hk) => {
        const soHocKy = parseInt(hk.replace("HK", "").replace(/^0+/, ""));
        return soHocKy >= minHocKy && soHocKy <= maxHocKy;
      });
    };

    return (
      <div className="w-full">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="text-xs">
              <th className="p-1">STT</th>
              <th className="p-1">Mã môn</th>
              <th className="p-1">Tên môn</th>
              <th className="p-1">Tên tiếng Anh</th>
              <th className="p-1">TC</th>
              <th className="p-1">LT</th>
              <th className="p-1">BT</th>
              <th className="p-1">TH</th>
              <th className="p-1">TH</th>
              <th className="p-1">NN</th>
              <th className="p-1">Loại</th>
              <th className="p-1">Tiên quyết</th>
              <th className="p-1">Trước</th>
              <th className="p-1">Song hành</th>
              <th className="p-1">HK</th>
              <th className="p-1">TT</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubjects.map((mon, idx) => (
              <tr key={mon.maMonHoc} className="text-xs">
                <td className="p-1">{idx + 1}</td>
                <td className="p-1">{mon.maMonHoc}</td>
                <td
                  className="p-1 max-w-[150px] truncate"
                  title={mon.tenMonHoc}
                >
                  {mon.tenMonHoc}
                </td>
                <td
                  className="p-1 max-w-[150px] truncate"
                  title={mon.tenMonHocTiengAnh}
                >
                  {mon.tenMonHocTiengAnh}
                </td>
                <td className="p-1 text-center">{mon.soTinChi}</td>
                <td className="p-1 text-center">{mon.soTietLiThuyet}</td>
                <td className="p-1 text-center">{mon.soTietBaiTap}</td>
                <td className="p-1 text-center">{mon.soTietThucHanh}</td>
                <td className="p-1 text-center">{mon.soTietTuHoc}</td>
                <td className="p-1">{mon.ngonNguDay}</td>
                <td className="p-1">{mon.loaiMon}</td>
                <td className="p-1 max-w-[120px]">
                  {mon.tenMonHocTienQuyet ? (
                    <div
                      className="truncate"
                      title={`${mon.maMonHocTienQuyet} - ${mon.tenMonHocTienQuyet}`}
                    >
                      <div className="font-medium">{mon.maMonHocTienQuyet}</div>
                      <div className="text-gray-500 truncate">
                        {mon.tenMonHocTienQuyet}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-1">
                  {mon.maMonHocTruoc ? (
                    <div className="truncate" title={mon.maMonHocTruoc}>
                      <div className="font-medium">{mon.maMonHocTruoc}</div>
                      <div className="text-gray-500 truncate">
                        {chuongtrinh?.danhSachMonHoc?.find(
                          (m) => m.maMonHoc === mon.maMonHocTruoc
                        )?.tenMonHoc || "-"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-1">
                  {mon.maMonHocSongHanh ? (
                    <div className="truncate" title={mon.maMonHocSongHanh}>
                      <div className="font-medium">{mon.maMonHocSongHanh}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-1">
                  {editingHocKy?.maMonHoc === mon.maMonHoc ? (
                    <div className="flex items-center gap-1">
                      <select
                        value={newHocKy}
                        onChange={(e) => setNewHocKy(e.target.value)}
                        className="select select-xs select-bordered w-16"
                        disabled={savingHocKy}
                      >
                        <option value="">Chọn</option>
                        {getAvailableHocKy(mon).map((hk) => (
                          <option key={hk} value={hk}>
                            {hk}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          handleCapNhatHocKy(mon.maMonHoc, newHocKy)
                        }
                        disabled={!newHocKy || savingHocKy}
                        className="btn btn-xs btn-success p-1 min-h-0 h-6"
                        title="Lưu thay đổi"
                      >
                        {savingHocKy ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingHocKy(null);
                          setNewHocKy("");
                        }}
                        disabled={savingHocKy}
                        className="btn btn-xs btn-error p-1 min-h-0 h-6"
                        title="Hủy thay đổi"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                      onClick={() => {
                        const availableHocKy = getAvailableHocKy(mon);
                        if (availableHocKy.length === 0) {
                          alert(
                            "Không thể thay đổi học kỳ do ràng buộc môn tiên quyết/môn trước"
                          );
                          return;
                        }
                        setEditingHocKy({
                          maMonHoc: mon.maMonHoc,
                          hocKyHienTai: mon.hocKy,
                        });
                        setNewHocKy(mon.hocKy || "");
                      }}
                      title={`Click để thay đổi học kỳ${
                        mon.tenMonHocTienQuyet
                          ? ` (Sau môn: ${mon.tenMonHocTienQuyet})`
                          : ""
                      }`}
                    >
                      <span className={mon.hocKy ? "" : "text-warning"}>
                        {mon.hocKy || "Chưa xếp"}
                      </span>
                      <Edit2 className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </td>
                <td className="p-1">
                  <button
                    onClick={() => handleXoaMonHoc(mon.maMonHoc)}
                    className="btn btn-xs btn-error p-1 min-h-0 h-6"
                    title="Xóa môn học"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const KhoiKienThucComponent = ({ khoiKienThuc, subjects }) => {
    // Hàm tính tổng tín chỉ cho một khối kiến thức và các khối con của nó
    const tinhTongTinChiKhoi = (khoi, danhSachMonHoc) => {
      if (!danhSachMonHoc) return 0;

      // Tính tổng tín chỉ của các môn học trực tiếp thuộc khối này
      const tongTinChiTrucTiep = danhSachMonHoc
        .filter(
          (mon) =>
            mon.maKhoiKienThuc === khoi.maKhoiKienThuc &&
            !/^[1-9]$/.test(mon.maMonHoc)
        ) // Lọc bỏ môn tự chọn
        .reduce((tong, mon) => tong + (mon.soTinChi || 0), 0);

      // Tính tổng tín chỉ của các khối con
      const tongTinChiCon =
        khoi.khoiKienThucCon?.reduce((tong, khoiCon) => {
          return tong + tinhTongTinChiKhoi(khoiCon, danhSachMonHoc);
        }, 0) || 0;

      return tongTinChiTrucTiep + tongTinChiCon;
    };

    // Tính tổng tín chỉ cho khối kiến thức hiện tại
    const tongTinChi = tinhTongTinChiKhoi(
      khoiKienThuc,
      chuongtrinh?.danhSachMonHoc
    );

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {khoiKienThuc.tenKhoiKienThuc} ({tongTinChi} tín chỉ)
        </h3>

        {/* Hiển thị môn học của khối kiến thức hiện tại */}
        {subjects && subjects.length > 0 && (
          <div className="mb-4">
            <MonHocTable
              subjects={subjects.filter((mon) => !/^[1-9]$/.test(mon.maMonHoc))}
            />
          </div>
        )}

        {/* Hiển thị các khối kiến thức con */}
        {khoiKienThuc.khoiKienThucCon &&
          khoiKienThuc.khoiKienThucCon.length > 0 && (
            <div className="pl-6 space-y-6">
              {khoiKienThuc.khoiKienThucCon.map((khoiCon) => (
                <div
                  key={khoiCon.maKhoiKienThuc}
                  className="border-l-2 border-primary pl-4"
                >
                  <KhoiKienThucComponent
                    khoiKienThuc={khoiCon}
                    subjects={chuongtrinh?.danhSachMonHoc?.filter(
                      (mon) => mon.maKhoiKienThuc === khoiCon.maKhoiKienThuc
                    )}
                  />
                </div>
              ))}
            </div>
          )}
      </div>
    );
  };

  // Component Modal thêm môn học
  const ThemMonHocModal = () => {
    if (!showModal) return null;

    // Hàm đệ quy để render khối kiến thức và các khối con
    const renderKhoiKienThuc = (khoi) => {
      return (
        <div key={khoi.maKhoiKienThuc} className="space-y-2">
          <button
            onClick={() => {
              setSelectedKhoiKienThuc(khoi);
              fetchMonHocByKhoiKienThuc(khoi.maKhoiKienThuc);
            }}
            className="w-full text-left p-3 hover:bg-gray-100 rounded-lg"
          >
            <div className="font-medium">{khoi.tenKhoiKienThuc}</div>
            <div className="text-sm text-gray-600">
              {khoi.tongSoTinChi} tín chỉ
            </div>
          </button>

          {khoi.khoiKienThucCon && khoi.khoiKienThucCon.length > 0 && (
            <div className="pl-6 space-y-2">
              {khoi.khoiKienThucCon.map((khoiCon) => (
                <div key={khoiCon.maKhoiKienThuc}>
                  {renderKhoiKienThuc(khoiCon)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Thêm môn học mới</h2>

          {!selectedKhoiKienThuc ? (
            // Hiển thị danh sách khối kiến thức theo cấu trúc phân cấp
            <div className="space-y-4">
              {khoiKienThuc.map((khoi) => (
                <div key={khoi.maKhoiKienThuc}>{renderKhoiKienThuc(khoi)}</div>
              ))}
            </div>
          ) : (
            // Hiển thị danh sách môn học của khối kiến thức đã chọn
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {selectedKhoiKienThuc.tenKhoiKienThuc}
                </h3>
                <button
                  onClick={() => setSelectedKhoiKienThuc(null)}
                  className="text-primary hover:underline"
                >
                  Quay lại
                </button>
              </div>

              {loadingMonHoc ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin w-6 h-6" />
                </div>
              ) : monHocList.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Không có môn học nào trong khối kiến thức này
                </div>
              ) : (
                <div className="space-y-2">
                  {monHocList
                    .filter(
                      (mon) =>
                        !chuongtrinh?.danhSachMonHoc?.some(
                          (m) => m.maMonHoc === mon.maMonHoc
                        )
                    )
                    .map((mon) => (
                      <button
                        key={mon.maMonHoc}
                        onClick={() => handleThemMonHoc(mon.maMonHoc)}
                        className="w-full text-left p-3 hover:bg-gray-100 rounded-lg"
                      >
                        <div className="font-medium">{mon.tenMonHoc}</div>
                        <div className="text-sm text-gray-600">
                          {mon.maMonHoc} - {mon.soTinChi} tín chỉ
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedKhoiKienThuc(null);
                setMonHocList([]);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Thêm component mới để hiển thị kế hoạch học tập
  const KeHoachHocTapComponent = ({ chuyenNganh }) => {
    if (!chuyenNganh) return null;

    // Hàm kiểm tra xem học kỳ có môn học thuộc khối kiến thức chuyên ngành không
    const hasChuyenNganhMonHoc = (hocKy) => {
      return hocKy.monHoc.some(
        (mon) => mon.maKhoiKienThuc === chuyenNganh.maKhoiKienThuc
      );
    };

    // Thêm hàm xử lý xóa môn tự chọn
    const handleXoaMonTuChon = async (hocKy) => {
      if (!confirm("Bạn có chắc chắn muốn xóa môn tự chọn của học kỳ này?")) {
        return;
      }

      try {
        const params = new URLSearchParams(location.search);
        const maChuongTrinh = params.get("maChuongTrinh");

        // Tìm môn tự chọn trong học kỳ
        const monTuChon = hocKy.monHoc.find(
          (mon) =>
            mon.maKhoiKienThuc === chuyenNganh.maKhoiKienThuc &&
            /^\d+$/.test(mon.maMonHoc)
        );

        if (!monTuChon) {
          alert("Không tìm thấy môn tự chọn trong học kỳ này");
          return;
        }

        const res = await axiosAuth.delete(
          `/api/chuongtrinhdaotao/${maChuongTrinh}/montuchon/${monTuChon.maMonHoc}`,
          { data: { hocKy: hocKy.hocKy } }
        );

        if (res.data.success) {
          // Refresh lại dữ liệu chương trình
          const chuongTrinhRes = await axiosAuth.get(
            `/api/chuongtrinhdaotao/${maChuongTrinh}`
          );
          if (chuongTrinhRes.data.success) {
            setChuongtrinh(chuongTrinhRes.data.data);
          }
          alert("Xóa môn tự chọn thành công!");
        } else {
          alert(res.data.message || "Không thể xóa môn tự chọn");
        }
      } catch (err) {
        console.error("Lỗi xóa môn tự chọn:", err);
        alert(
          err.response?.data?.message || "Có lỗi xảy ra khi xóa môn tự chọn"
        );
      }
    };

    const handleThemMonTuChon = async (hocKy) => {
      try {
        const params = new URLSearchParams(location.search);
        const maChuongTrinh = params.get("maChuongTrinh");

        const res = await axiosAuth.post(
          `/api/chuongtrinhdaotao/${maChuongTrinh}/montuchon`,
          {
            maKhoiKienThuc: chuyenNganh.maKhoiKienThuc,
            hocKy: hocKy,
          }
        );

        if (res.data.success) {
          // Refresh lại dữ liệu chương trình
          const chuongTrinhRes = await axiosAuth.get(
            `/api/chuongtrinhdaotao/${maChuongTrinh}`
          );
          if (chuongTrinhRes.data.success) {
            setChuongtrinh(chuongTrinhRes.data.data);
          }
          alert(res.data.message || "Thêm môn tự chọn thành công!");
        } else {
          alert(res.data.message || "Không thể thêm môn tự chọn");
        }
      } catch (err) {
        console.error("Lỗi thêm môn tự chọn:", err);
        alert(
          err.response?.data?.message || "Có lỗi xảy ra khi thêm môn tự chọn"
        );
      }
    };

    // Hàm gộp các học kỳ theo năm học
    const groupHocKyByNamHoc = (keHoachHocTap) => {
      const result = [];
      for (let i = 0; i < keHoachHocTap.length; i += 2) {
        if (i + 1 < keHoachHocTap.length) {
          result.push({
            namHoc: `Năm học thứ ${Math.floor(i / 2) + 1}`,
            hocKy1: keHoachHocTap[i],
            hocKy2: keHoachHocTap[i + 1],
          });
        } else {
          result.push({
            namHoc: `Năm học thứ ${Math.floor(i / 2) + 1}`,
            hocKy1: keHoachHocTap[i],
            hocKy2: null,
          });
        }
      }
      return result;
    };

    const namHocGroups = groupHocKyByNamHoc(chuyenNganh.keHoachHocTap);

    return (
      <div className="mt-6 space-y-6">
        <h3 className="text-lg font-semibold text-primary">
          Kế hoạch học tập - {chuyenNganh.tenKhoiKienThuc}
        </h3>

        {namHocGroups.map((namHoc, index) => (
          <div key={index} className="bg-base-100 rounded-xl shadow p-4">
            <h4 className="text-md font-semibold mb-4 text-center">
              {namHoc.namHoc}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Học kỳ 1 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium">
                    Học kỳ {namHoc.hocKy1.hocKy}
                  </h5>
                  {hasChuyenNganhMonHoc(namHoc.hocKy1) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleThemMonTuChon(namHoc.hocKy1.hocKy)}
                        className="btn btn-primary btn-sm gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm môn tự chọn
                      </button>
                      {namHoc.hocKy1.monHoc.some(
                        (mon) =>
                          mon.maKhoiKienThuc === chuyenNganh.maKhoiKienThuc &&
                          /^\d+$/.test(mon.maMonHoc)
                      ) && (
                        <button
                          onClick={() => handleXoaMonTuChon(namHoc.hocKy1)}
                          className="btn btn-error btn-sm gap-2"
                        >
                          <X className="w-4 h-4" />
                          Xóa môn tự chọn
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên môn học</th>
                        <th>Số tín chỉ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...namHoc.hocKy1.monHoc]
                        .filter((mon) => mon.loaiMon !== "Tự chọn")
                        .sort((a, b) => b.maMonHoc.localeCompare(a.maMonHoc))
                        .map((mon, idx) =>
                          mon.maMonHoc.match(/^[1-9]$/) ? (
                            <tr
                              key={mon.maMonHoc}
                              className="cursor-pointer hover:bg-gray-100"
                              onClick={() =>
                                handleShowMonTuChon(mon, namHoc.hocKy1.hocKy)
                              }
                            >
                              <td>{idx + 1}</td>
                              <td>{mon.tenMonHoc}</td>
                              <td>{mon.soTinChi}</td>
                            </tr>
                          ) : (
                            <tr key={mon.maMonHoc}>
                              <td>{idx + 1}</td>
                              <td>{mon.tenMonHoc}</td>
                              <td>{mon.soTinChi}</td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Học kỳ 2 */}
              {namHoc.hocKy2 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-sm font-medium">
                      Học kỳ {namHoc.hocKy2.hocKy}
                    </h5>
                    {hasChuyenNganhMonHoc(namHoc.hocKy2) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleThemMonTuChon(namHoc.hocKy2.hocKy)
                          }
                          className="btn btn-primary btn-sm gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm môn tự chọn
                        </button>
                        {namHoc.hocKy2.monHoc.some(
                          (mon) =>
                            mon.maKhoiKienThuc === chuyenNganh.maKhoiKienThuc &&
                            /^\d+$/.test(mon.maMonHoc)
                        ) && (
                          <button
                            onClick={() => handleXoaMonTuChon(namHoc.hocKy2)}
                            className="btn btn-error btn-sm gap-2"
                          >
                            <X className="w-4 h-4" />
                            Xóa môn tự chọn
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên môn học</th>
                          <th>Số tín chỉ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...namHoc.hocKy2.monHoc]
                          .filter((mon) => mon.loaiMon !== "Tự chọn")
                          .sort((a, b) => b.maMonHoc.localeCompare(a.maMonHoc))
                          .map((mon, idx) =>
                            mon.maMonHoc.match(/^[1-9]$/) ? (
                              <tr
                                key={mon.maMonHoc}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleShowMonTuChon(mon, namHoc.hocKy2.hocKy)
                                }
                              >
                                <td>{idx + 1}</td>
                                <td>{mon.tenMonHoc}</td>
                                <td>{mon.soTinChi}</td>
                              </tr>
                            ) : (
                              <tr key={mon.maMonHoc}>
                                <td>{idx + 1}</td>
                                <td>{mon.tenMonHoc}</td>
                                <td>{mon.soTinChi}</td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Component hiển thị theo học kỳ
  const HocKyTable = () => {
    if (!chuongtrinh?.danhSachMonHoc) return null;

    // Sắp xếp môn học theo học kỳ và lọc bỏ môn có mã từ 1-9
    const sortedSubjects = [...chuongtrinh.danhSachMonHoc]
      .filter((mon) => !/^[1-9]$/.test(mon.maMonHoc)) // Lọc bỏ môn có mã từ 1-9
      .sort((a, b) => {
        const getHocKyNumber = (hocKy) => {
          if (!hocKy) return 999; // Môn chưa xếp học kỳ sẽ ở cuối
          return parseInt(hocKy.replace("HK", "").replace(/^0+/, ""));
        };
        return getHocKyNumber(a.hocKy) - getHocKyNumber(b.hocKy);
      });

    // Tạo danh sách học kỳ từ HK01 đến HK09
    const danhSachHocKy = Array.from(
      { length: 10 },
      (_, i) => `HK${String(i + 1).padStart(2, "0")}`
    );

    // Hàm kiểm tra môn học có thể chuyển sang học kỳ nào
    const getAvailableHocKy = (mon) => {
      let minHocKy = 1;

      // Kiểm tra môn tiên quyết
      if (mon.maMonHocTienQuyet) {
        const monTienQuyet = chuongtrinh?.danhSachMonHoc?.find(
          (m) => m.maMonHoc === mon.maMonHocTienQuyet
        );
        if (monTienQuyet && monTienQuyet.hocKy) {
          const hocKyTienQuyet = parseInt(
            monTienQuyet.hocKy.replace("HK", "").replace(/^0+/, "")
          );
          minHocKy = Math.max(minHocKy, hocKyTienQuyet + 1);
        }
      }

      // Kiểm tra môn học trước
      if (mon.maMonHocTruoc) {
        const monTruoc = chuongtrinh?.danhSachMonHoc?.find(
          (m) => m.maMonHoc === mon.maMonHocTruoc
        );
        if (monTruoc && monTruoc.hocKy) {
          const hocKyTruoc = parseInt(
            monTruoc.hocKy.replace("HK", "").replace(/^0+/, "")
          );
          minHocKy = Math.max(minHocKy, hocKyTruoc + 1);
        }
      }

      // Kiểm tra các môn phụ thuộc vào môn này
      let maxHocKy = 9;
      const monPhuThuoc = chuongtrinh?.danhSachMonHoc?.filter(
        (m) =>
          m.maMonHocTienQuyet === mon.maMonHoc ||
          m.maMonHocTruoc === mon.maMonHoc
      );

      if (monPhuThuoc?.length > 0) {
        for (const monSau of monPhuThuoc) {
          if (monSau.hocKy) {
            const hocKyMonSau = parseInt(
              monSau.hocKy.replace("HK", "").replace(/^0+/, "")
            );
            maxHocKy = Math.min(maxHocKy, hocKyMonSau - 1);
          }
        }
      }

      return danhSachHocKy.filter((hk) => {
        const soHocKy = parseInt(hk.replace("HK", "").replace(/^0+/, ""));
        return soHocKy >= minHocKy && soHocKy <= maxHocKy;
      });
    };

    return (
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="text-xs">
              <th className="p-1" rowSpan="2">
                STT
              </th>
              <th className="p-1" rowSpan="2">
                Mã môn
              </th>
              <th className="p-1" rowSpan="2">
                Tên môn
              </th>
              <th className="p-1" rowSpan="2">
                Tên tiếng Anh
              </th>
              <th className="p-1 text-center" colSpan="10">
                Năm học
              </th>
              <th className="p-1" rowSpan="2">
                Tiên quyết
              </th>
              <th className="p-1" rowSpan="2">
                Trước
              </th>
              <th className="p-1" rowSpan="2">
                Song hành
              </th>
              <th className="p-1" rowSpan="2">
                TT
              </th>
            </tr>
            <tr className="text-xs">
              <th className="p-1" colSpan="2">
                Năm học thứ nhất
              </th>
              <th className="p-1" colSpan="2">
                Năm học thứ hai
              </th>
              <th className="p-1" colSpan="2">
                Năm học thứ ba
              </th>
              <th className="p-1" colSpan="2">
                Năm học thứ tư
              </th>
              <th className="p-1" colSpan="2">
                Năm học thứ năm
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSubjects.map((mon, idx) => (
              <tr key={mon.maMonHoc} className="text-xs">
                <td className="p-1 w-[40px]">{idx + 1}</td>
                <td className="p-1 w-[80px]">{mon.maMonHoc}</td>
                <td className="p-1 w-[150px] truncate" title={mon.tenMonHoc}>
                  {mon.tenMonHoc}
                </td>
                <td
                  className="p-1 w-[150px] truncate"
                  title={mon.tenMonHocTiengAnh}
                >
                  {mon.tenMonHocTiengAnh}
                </td>
                {danhSachHocKy.map((hocKy) => (
                  <td key={hocKy} className="p-1 w-[60px]">
                    {mon.hocKy === hocKy ? (
                      editingHocKy?.maMonHoc === mon.maMonHoc ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={newHocKy}
                            onChange={(e) => setNewHocKy(e.target.value)}
                            className="select select-xs select-bordered w-16"
                            disabled={savingHocKy}
                          >
                            <option value="">Chọn</option>
                            {getAvailableHocKy(mon).map((hk) => (
                              <option key={hk} value={hk}>
                                {hk}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              handleCapNhatHocKy(mon.maMonHoc, newHocKy)
                            }
                            disabled={!newHocKy || savingHocKy}
                            className="btn btn-xs btn-success p-1 min-h-0 h-6"
                            title="Lưu thay đổi"
                          >
                            {savingHocKy ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingHocKy(null);
                              setNewHocKy("");
                            }}
                            disabled={savingHocKy}
                            className="btn btn-xs btn-error p-1 min-h-0 h-6"
                            title="Hủy thay đổi"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                          onClick={() => {
                            const availableHocKy = getAvailableHocKy(mon);
                            if (availableHocKy.length === 0) {
                              alert(
                                "Không thể thay đổi học kỳ do ràng buộc môn tiên quyết/môn trước"
                              );
                              return;
                            }
                            setEditingHocKy({
                              maMonHoc: mon.maMonHoc,
                              hocKyHienTai: mon.hocKy,
                            });
                            setNewHocKy(mon.hocKy || "");
                          }}
                          title={`Click để thay đổi học kỳ${
                            mon.tenMonHocTienQuyet
                              ? ` (Sau môn: ${mon.tenMonHocTienQuyet})`
                              : ""
                          }`}
                        >
                          <span>{hocKy}</span>
                          <Edit2 className="w-3 h-3 text-primary" />
                        </div>
                      )
                    ) : (
                      ""
                    )}
                  </td>
                ))}
                <td className="p-1 w-[100px]">
                  {mon.tenMonHocTienQuyet ? (
                    <div
                      className="truncate"
                      title={`${mon.maMonHocTienQuyet} - ${mon.tenMonHocTienQuyet}`}
                    >
                      <div className="font-medium">{mon.maMonHocTienQuyet}</div>
                      <div className="text-gray-500 truncate">
                        {mon.tenMonHocTienQuyet}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-1 w-[100px]">
                  {mon.maMonHocTruoc ? (
                    <div className="truncate" title={mon.maMonHocTruoc}>
                      <div className="font-medium">{mon.maMonHocTruoc}</div>
                      <div className="text-gray-500 truncate">
                        {chuongtrinh?.danhSachMonHoc?.find(
                          (m) => m.maMonHoc === mon.maMonHocTruoc
                        )?.tenMonHoc || "-"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-1 w-[100px]">
                  {mon.maMonHocSongHanh ? (
                    <div className="truncate" title={mon.maMonHocSongHanh}>
                      <div className="font-medium">{mon.maMonHocSongHanh}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-1 w-[40px]">
                  <button
                    onClick={() => handleXoaMonHoc(mon.maMonHoc)}
                    className="btn btn-xs btn-error p-1 min-h-0 h-6"
                    title="Xóa môn học"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleShowMonTuChon = async (monTuChon, hocKy) => {
    try {
      const params = new URLSearchParams(location.search);
      const maChuongTrinh = params.get("maChuongTrinh");

      if (!selectedChuyenNganh) {
        alert("Vui lòng chọn chuyên ngành trước");
        return;
      }

      console.log("Debug - Thông tin môn tự chọn:");
      console.log("- Mã chương trình:", maChuongTrinh);
      console.log("- Mã khối kiến thức:", selectedChuyenNganh.maKhoiKienThuc);
      console.log("- Học kỳ:", hocKy);
      console.log("- Môn được chọn:", monTuChon);

      const res = await axiosAuth.get(
        `/api/chuongtrinhdaotao/${maChuongTrinh}/montuchon`,
        {
          params: {
            maKhoiKienThuc: selectedChuyenNganh.maKhoiKienThuc,
            hocKy: hocKy,
          },
        }
      );

      console.log("Debug - Response từ API:", res.data);

      if (res.data.success) {
        setSelectedMonTuChon(monTuChon);
        setSelectedHocKy(hocKy);
        setDanhSachMonTuChon(res.data.data);
        setShowMonTuChonModal(true);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách môn tự chọn:", err);
      alert("Có lỗi xảy ra khi lấy danh sách môn tự chọn");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 gap-2 text-primary">
        <Loader2 className="animate-spin w-5 h-5" />
        Đang tải chương trình đào tạo...
      </div>
    );
  }

  if (!chuongtrinh) {
    return (
      <div className="text-warning">Không tìm thấy chương trình đào tạo.</div>
    );
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          🎓 Chi tiết chương trình đào tạo
        </h1>
        <div className="flex items-center gap-4">
          <div className="join">
            <button
              className={`join-item btn ${
                displayMode === "khoiKienThuc" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setDisplayMode("khoiKienThuc")}
            >
              Hiện theo Khối kiến thức
            </button>
            <button
              className={`join-item btn ${
                displayMode === "hocKy" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setDisplayMode("hocKy")}
            >
              Hiện theo Học kỳ
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm môn học
          </button>
        </div>
      </div>

      <div className="bg-primary-content rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">
          {chuongtrinh?.thongTinChuongTrinh?.TenChuongTrinh} (
          {chuongtrinh?.thongTinChuongTrinh?.MaChuongTrinh})
        </h2>
        <p className="text-gray-600 mb-6">
          Trình độ: {chuongtrinh?.thongTinChuongTrinh?.TrinhDoDaoTao} - Hình
          thức: {chuongtrinh?.thongTinChuongTrinh?.HinhThucDaoTao} - Năm áp
          dụng: {chuongtrinh?.thongTinChuongTrinh?.NamApDung}
        </p>

        {displayMode === "khoiKienThuc" ? (
          <div className="space-y-8">
            {filterKhoiKienThuc(khoiKienThuc, chuongtrinh?.danhSachMonHoc).map(
              (khoi) => (
                <div
                  key={khoi.maKhoiKienThuc}
                  className="bg-base-100 rounded-xl shadow p-4"
                >
                  <KhoiKienThucComponent
                    khoiKienThuc={khoi}
                    subjects={chuongtrinh?.danhSachMonHoc?.filter(
                      (mon) => mon.maKhoiKienThuc === khoi.maKhoiKienThuc
                    )}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <HocKyTable />
        )}
      </div>

      {/* Kế hoạch học tập */}
      <div className="bg-primary-content rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">
          Kế hoạch học tập
        </h2>
        {loadingChuyenNganh ? (
          <div className="flex justify-center items-center py-4 gap-2 text-primary">
            <Loader2 className="animate-spin w-5 h-5" />
            Đang tải thông tin chuyên ngành...
          </div>
        ) : chuyenNganh.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Không có thông tin chuyên ngành
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4">
              {chuyenNganh.map((nganh) => (
                <button
                  key={nganh.maKhoiKienThuc}
                  className={`btn ${
                    selectedChuyenNganh?.maKhoiKienThuc === nganh.maKhoiKienThuc
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={() => setSelectedChuyenNganh(nganh)}
                >
                  {nganh.tenKhoiKienThuc}
                </button>
              ))}
            </div>

            {/* Hiển thị kế hoạch học tập của chuyên ngành được chọn */}
            {selectedChuyenNganh && (
              <KeHoachHocTapComponent chuyenNganh={selectedChuyenNganh} />
            )}
          </>
        )}
      </div>

      <ThemMonHocModal />

      {/* Modal hiển thị danh sách môn tự chọn */}
      {showMonTuChonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h3 className="font-bold text-lg mb-4">Danh sách môn tự chọn</h3>
            {selectedMonTuChon && selectedHocKy && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="space-y-2">
                    {danhSachMonTuChon.map((mon) => (
                      <div
                        key={mon.MaMonHoc}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                      >
                        <span>{mon.TenMonHoc}</span>
                        <span className="text-gray-600">
                          {mon.SoTinChi} tín chỉ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowMonTuChonModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChitietCtdt;
