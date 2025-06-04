import React, { useState, useEffect } from "react";
import FilterCtdt from "./FilterCtdt";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronRight } from "lucide-react";
import axios from "axios";

// Axios instance with token
const axiosAuth = axios.create();
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// List programs by hierarchy
const ProgramList = ({
  chuongtrinh,
  loading,
  groupByHocKy,
  selectedKhoa,
  selectedNganh,
  selectedChuyenNganh,
  selectedNienKhoa,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 gap-2 text-primary">
        <Loader2 className="animate-spin w-5 h-5" />
        Đang tải chương trình đào tạo...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chuongtrinh.length > 0
        ? chuongtrinh.map((item, index) => {
            if (!item.maKhoa && item.MaChuongTrinh) {
              return (
                <div
                  key={index}
                  className="bg-primary-content rounded-xl p-4 shadow"
                >
                  <h2 className="text-lg font-semibold">
                    {item.TenChuongTrinh} ({item.MaChuongTrinh})
                  </h2>
                </div>
              );
            }

            return (
              <div key={item.maKhoa || index} className="space-y-2">
                <h2 className="text-xl font-bold text-primary">
                  {item.tenKhoa || "Khoa không xác định"}
                </h2>

                {item.nganh?.length > 0 ? (
                  item.nganh.map((nganh) => (
                    <div
                      key={nganh.maNganh}
                      className="mb-8 space-y-2 bg-primary-content rounded-xl shadow p-6"
                    >
                      <h3 className="text-lg font-semibold text-secondary">
                        {nganh.tenNganh}
                      </h3>

                      {nganh.chuyenNganh?.length > 0 ? (
                        nganh.chuyenNganh.map((chuyenNganh) => (
                          <div
                            key={chuyenNganh.maChuyenNganh}
                            className="ml-4 space-y-2"
                          >
                            <h4 className="text-md font-medium">
                              {chuyenNganh.tenChuyenNganh}
                            </h4>

                            {chuyenNganh.chuongTrinhDaoTao?.length > 0 ? (
                              chuyenNganh.chuongTrinhDaoTao.map((ctdt) => (
                                <div key={ctdt.maChuongTrinh} className="ml-4">
                                  <p
                                    className="bg-base-100 rounded-xl shadow p-6 mb-2 cursor-pointer flex justify-between items-center"
                                    onClick={() =>
                                      navigate(
                                        `/admin/chuongtrinhdaotao/chitiet?maChuyenNganh=${chuyenNganh.maChuyenNganh}&maKhoa=${item.maKhoa}&maNganh=${nganh.maNganh}&maNienKhoa=${ctdt.maNienKhoa}`
                                      )
                                    }
                                  >
                                    <span>
                                      <strong>{ctdt.tenChuongTrinh}</strong> (
                                      {ctdt.maChuongTrinh}) – Niên khóa:{" "}
                                      {ctdt.tenNienKhoa}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 ml-2">
                                Không có chương trình đào tạo.
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="ml-2 text-sm text-gray-500">
                          Không có chuyên ngành.
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="ml-2 text-sm text-gray-500">Không có ngành.</p>
                )}
              </div>
            );
          })
        : (selectedKhoa ||
            selectedNganh ||
            selectedChuyenNganh ||
            selectedNienKhoa) && (
            <div className="text-warning">
              Không có chương trình đào tạo nào.
            </div>
          )}
    </div>
  );
};

// Main Management Component
const ChuongtrinhdaotaoManagement = () => {
  const [selectedKhoa, setSelectedKhoa] = useState("");
  const [selectedNganh, setSelectedNganh] = useState("");
  const [selectedChuyenNganh, setSelectedChuyenNganh] = useState("");
  const [selectedNienKhoa, setSelectedNienKhoa] = useState("");
  const [chuongtrinh, setChuongtrinh] = useState([]);
  const [loading, setLoading] = useState(false);

  const groupByHocKy = (chiTiet) => {
    if (!chiTiet || !Array.isArray(chiTiet)) return {};
    const grouped = {};
    chiTiet.forEach((mon) => {
      const kyHoc = mon.MaKyHoc ? `${mon.TenKyHoc} (${mon.MaKyHoc})` : "Chung";
      if (!grouped[kyHoc]) grouped[kyHoc] = [];
      grouped[kyHoc].push(mon);
    });
    return grouped;
  };

  // Prefetch chuongtrinhdaotao API on component mount
  useEffect(() => {
    const prefetchChuongTrinh = async () => {
      setLoading(true);
      try {
        const res = await axiosAuth.get(
          "http://localhost:3000/api/chuongtrinhdaotao"
        );
        if (res.data.success) {
          const data = Array.isArray(res.data.data)
            ? res.data.data
            : [res.data.data];
          setChuongtrinh(data);
        } else {
          setChuongtrinh([]);
        }
      } catch (err) {
        console.error("Lỗi prefetch chương trình đào tạo:", err);
        setChuongtrinh([]);
      } finally {
        setLoading(false);
      }
    };

    prefetchChuongTrinh();
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-primary">Chương trình đào tạo</h1>

      <FilterCtdt
        selectedKhoa={selectedKhoa}
        setSelectedKhoa={setSelectedKhoa}
        selectedNganh={selectedNganh}
        setSelectedNganh={setSelectedNganh}
        selectedChuyenNganh={selectedChuyenNganh}
        setSelectedChuyenNganh={setSelectedChuyenNganh}
        selectedNienKhoa={selectedNienKhoa}
        setSelectedNienKhoa={setSelectedNienKhoa}
        setChuongtrinh={setChuongtrinh}
        setLoading={setLoading}
      />

      <ProgramList
        chuongtrinh={chuongtrinh}
        loading={loading}
        groupByHocKy={groupByHocKy}
        selectedKhoa={selectedKhoa}
        selectedNganh={selectedNganh}
        selectedChuyenNganh={selectedChuyenNganh}
        selectedNienKhoa={selectedNienKhoa}
      />
    </div>
  );
};

export default ChuongtrinhdaotaoManagement;
