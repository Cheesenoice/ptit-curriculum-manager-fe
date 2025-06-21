import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";

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

// List programs
const ProgramList = ({ chuongtrinh, loading }) => {
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
      {chuongtrinh.length > 0 ? (
        chuongtrinh.map((ctdt) => (
          <div
            key={`ctdt-${ctdt.MaChuongTrinh}`}
            className="bg-primary-content rounded-xl p-4 shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">
                  {ctdt.TenChuongTrinh} ({ctdt.MaChuongTrinh})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Trình độ: {ctdt.TrinhDoDaoTao} - Hình thức:{" "}
                  {ctdt.HinhThucDaoTao} - Năm áp dụng: {ctdt.NamApDung}
                </p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  navigate(
                    `/user/chuongtrinhdaotao/chitiet?maChuongTrinh=${ctdt.MaChuongTrinh}`
                  )
                }
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-warning">Không có chương trình đào tạo nào.</div>
      )}
    </div>
  );
};

// Main Management Component
const ChuongtrinhdaotaoView = () => {
  const [chuongtrinh, setChuongtrinh] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all training programs on component mount
  useEffect(() => {
    const fetchAllPrograms = async () => {
      setLoading(true);
      try {
        const res = await axiosAuth.get("/api/chuongtrinhdaotao");
        if (res.data.success) {
          const data = Array.isArray(res.data.data)
            ? res.data.data
            : [res.data.data];
          setChuongtrinh(data);
        } else {
          setChuongtrinh([]);
        }
      } catch (err) {
        console.error("Lỗi lấy chương trình đào tạo:", err);
        setChuongtrinh([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPrograms();
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-primary">Chương trình đào tạo</h1>
      <ProgramList chuongtrinh={chuongtrinh} loading={loading} />
    </div>
  );
};

export default ChuongtrinhdaotaoView;
