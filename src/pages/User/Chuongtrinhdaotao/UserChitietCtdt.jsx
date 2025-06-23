import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

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

// Chi tiết chương trình đào tạo (read-only)
const UserChitietCtdt = () => {
  const [chuongtrinh, setChuongtrinh] = useState(null);
  const [khoiKienThuc, setKhoiKienThuc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chuyenNganh, setChuyenNganh] = useState([]);
  const [loadingChuyenNganh, setLoadingChuyenNganh] = useState(false);
  const [selectedChuyenNganh, setSelectedChuyenNganh] = useState(null);
  const [activeTab, setActiveTab] = useState("chuongtrinh");

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
    const maKhoiKienThucSet = new Set(
      danhSachMonHoc.map((mon) => mon.maKhoiKienThuc)
    );
    const filterKhoi = (khoi) => {
      const hasSubjects = maKhoiKienThucSet.has(khoi.maKhoiKienThuc);
      const filteredChildren = khoi.khoiKienThucCon
        ? khoi.khoiKienThucCon.map(filterKhoi).filter((child) => child !== null)
        : [];
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

  // Table chỉ hiển thị, không có nút chỉnh sửa/xóa
  const MonHocTable = ({ subjects }) => {
    const sortedSubjects = [...subjects]
      .filter((mon) => !/^[1-9]$/.test(mon.maMonHoc))
      .sort((a, b) => {
        const loaiMonOrder = {
          "Bắt buộc": 1,
          "Tự chọn": 2,
          "Thay thế tốt nghiệp": 3,
        };
        return loaiMonOrder[a.loaiMon] - loaiMonOrder[b.loaiMon];
      });
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
                  {mon.hocKy || <span className="text-warning">Chưa xếp</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const KhoiKienThucComponent = ({ khoiKienThuc, subjects }) => {
    const tinhTongTinChiKhoi = (khoi, danhSachMonHoc) => {
      if (!danhSachMonHoc) return 0;
      const tongTinChiTrucTiep = danhSachMonHoc
        .filter(
          (mon) =>
            mon.maKhoiKienThuc === khoi.maKhoiKienThuc &&
            !/^[1-9]$/.test(mon.maMonHoc)
        )
        .reduce((tong, mon) => tong + (mon.soTinChi || 0), 0);
      const tongTinChiCon =
        khoi.khoiKienThucCon?.reduce((tong, khoiCon) => {
          return tong + tinhTongTinChiKhoi(khoiCon, danhSachMonHoc);
        }, 0) || 0;
      return tongTinChiTrucTiep + tongTinChiCon;
    };
    const tongTinChi = tinhTongTinChiKhoi(
      khoiKienThuc,
      chuongtrinh?.danhSachMonHoc
    );
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {khoiKienThuc.tenKhoiKienThuc} ({tongTinChi} tín chỉ)
        </h3>
        {subjects && subjects.length > 0 && (
          <div className="mb-4">
            <MonHocTable
              subjects={subjects.filter((mon) => !/^[1-9]$/.test(mon.maMonHoc))}
            />
          </div>
        )}
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

  // Kế hoạch học tập chỉ hiển thị, không có nút thêm/xóa
  const KeHoachHocTapComponent = ({ chuyenNganh }) => {
    if (!chuyenNganh) return null;
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
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium">
                    Học kỳ {namHoc.hocKy1.hocKy}
                  </h5>
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
                        .map((mon, idx) => (
                          <tr key={mon.maMonHoc}>
                            <td>{idx + 1}</td>
                            <td>{mon.tenMonHoc}</td>
                            <td>{mon.soTinChi}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {namHoc.hocKy2 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-sm font-medium">
                      Học kỳ {namHoc.hocKy2.hocKy}
                    </h5>
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
                          .map((mon, idx) => (
                            <tr key={mon.maMonHoc}>
                              <td>{idx + 1}</td>
                              <td>{mon.tenMonHoc}</td>
                              <td>{mon.soTinChi}</td>
                            </tr>
                          ))}
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

  // Table hiển thị theo học kỳ, không có nút chỉnh sửa/xóa
  const HocKyTable = () => {
    if (!chuongtrinh?.danhSachMonHoc) return null;
    const sortedSubjects = [...chuongtrinh.danhSachMonHoc]
      .filter((mon) => !/^[1-9]$/.test(mon.maMonHoc))
      .sort((a, b) => {
        const getHocKyNumber = (hocKy) => {
          if (!hocKy) return 999;
          return parseInt(hocKy.replace("HK", "").replace(/^0+/, ""));
        };
        return getHocKyNumber(a.hocKy) - getHocKyNumber(b.hocKy);
      });
    const danhSachHocKy = Array.from(
      { length: 10 },
      (_, i) => `HK${String(i + 1).padStart(2, "0")}`
    );
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
                    {mon.hocKy === hocKy ? <span>{hocKy}</span> : ""}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
      </div>
      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${
            activeTab === "chuongtrinh"
              ? "tab-active font-bold text-primary"
              : "text-base-content"
          }`}
          onClick={() => setActiveTab("chuongtrinh")}
        >
          Chương trình đào tạo
        </a>
        <a
          className={`tab ${
            activeTab === "kehoach"
              ? "tab-active font-bold text-primary"
              : "text-base-content"
          }`}
          onClick={() => setActiveTab("kehoach")}
        >
          Kế hoạch học tập
        </a>
      </div>
      {/* Tab content */}
      {activeTab === "chuongtrinh" && (
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
        </div>
      )}
      {activeTab === "kehoach" && (
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
                      selectedChuyenNganh?.maKhoiKienThuc ===
                      nganh.maKhoiKienThuc
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
      )}
    </div>
  );
};

export default UserChitietCtdt;
