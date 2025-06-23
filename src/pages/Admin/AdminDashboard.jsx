import React, { useEffect, useState } from "react";
import {
  getSummary,
  getTopNganhSinhVien,
  getSinhVienNienKhoa,
  getGiangVienKhoa,
  getMonHocCtdt,
} from "../../api/services/dashboardService";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [summary, setSummary] = useState(null);
  const [topNganh, setTopNganh] = useState([]);
  const [svNienKhoa, setSvNienKhoa] = useState([]);
  const [gvKhoa, setGvKhoa] = useState([]);
  const [monHocCtdt, setMonHocCtdt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        const [
          summaryRes,
          topNganhRes,
          svNienKhoaRes,
          gvKhoaRes,
          monHocCtdtRes,
        ] = await Promise.all([
          getSummary(token),
          getTopNganhSinhVien(token),
          getSinhVienNienKhoa(token),
          getGiangVienKhoa(token),
          getMonHocCtdt(token),
        ]);
        setSummary(summaryRes.data.data);
        setTopNganh(topNganhRes.data.data || []);
        setSvNienKhoa(svNienKhoaRes.data.data || []);
        setGvKhoa(gvKhoaRes.data.data || []);
        setMonHocCtdt(monHocCtdtRes.data.data || []);
      } catch (err) {
        setError("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          🛠️ Chào mừng, {user?.name}!
        </h1>
        <p className="text-lg text-base-content">
          Đây là giao diện Dashboard dành cho phòng đào tạo
        </p>
      </div>
      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      {!loading && !error && summary && (
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">Số sinh viên</h2>
                <p className="text-3xl font-bold">{summary.soSinhVien}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">Số giảng viên</h2>
                <p className="text-3xl font-bold">{summary.soGiangVien}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">Số ngành</h2>
                <p className="text-3xl font-bold">{summary.soNganh}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">Số khoa</h2>
                <p className="text-3xl font-bold">{summary.soKhoa}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">Số CTĐT</h2>
                <p className="text-3xl font-bold">
                  {summary.soChuongTrinhDaoTao}
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">Số môn học</h2>
                <p className="text-3xl font-bold">{summary.soMonHoc}</p>
              </div>
            </div>
          </div>

          {/* Top 5 ngành có nhiều sinh viên nhất */}
          <div className="mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-2">
                  Top 5 ngành có nhiều sinh viên nhất
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Ngành</th>
                        <th>Số sinh viên</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topNganh.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.TenNganh}</td>
                          <td>{item.soSinhVien}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Số lượng sinh viên theo từng năm nhập học */}
          <div className="mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-2">
                  Số lượng sinh viên theo năm nhập học
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Năm nhập học</th>
                        <th>Số sinh viên</th>
                      </tr>
                    </thead>
                    <tbody>
                      {svNienKhoa.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.NamNhapHoc}</td>
                          <td>{item.soSinhVien}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Số lượng giảng viên theo khoa */}
          <div className="mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-2">
                  Số lượng giảng viên theo khoa
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Khoa</th>
                        <th>Số giảng viên</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gvKhoa.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.TenKhoa}</td>
                          <td>{item.soGiangVien}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Số lượng môn học theo CTĐT */}
          <div className="mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-2">
                  Số lượng môn học theo CTĐT
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Chương trình đào tạo</th>
                        <th>Số môn học</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monHocCtdt.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.TenChuongTrinh}</td>
                          <td>{item.soMonHoc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
