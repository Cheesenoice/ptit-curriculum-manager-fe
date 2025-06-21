import React, { useState, useEffect } from "react";

const KhoaNganhKhoiKienThucManagement = () => {
  const [khoaList, setKhoaList] = useState([]);
  const [nganhList, setNganhList] = useState([]);
  const [allNganhList, setAllNganhList] = useState([]);
  const [khoiKienThucList, setKhoiKienThucList] = useState([]);
  const [selectedKhoaNganh, setSelectedKhoaNganh] = useState("");
  const [selectedNganhKhoiKienThuc, setSelectedNganhKhoiKienThuc] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("khoa");

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  const fetchWithToken = async (url, options = {}) => {
    const token = getToken();
    if (!token) {
      setError("Không tìm thấy token xác thực.");
      setLoading(false);
      return null;
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Lỗi từ server");
      }
      return data;
    } catch (error) {
      setError(`Lỗi khi gọi API: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      const khoaData = await fetchWithToken("http://localhost:3000/api/khoa");
      if (khoaData?.success) {
        setKhoaList(khoaData.data);
      }

      const nganhData = await fetchWithToken("http://localhost:3000/api/nganh");
      if (nganhData?.success) {
        setNganhList(nganhData.data);
        setAllNganhList(nganhData.data);
      }

      const khoiKienThucData = await fetchWithToken(
        "http://localhost:3000/api/khoikienthucchuyenganh"
      );
      if (khoiKienThucData?.success) {
        setKhoiKienThucList(khoiKienThucData.data);
      }

      setLoading(false);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedKhoaNganh && allNganhList.length > 0) {
      const filteredNganh = allNganhList.filter(
        (nganh) => nganh.MaKhoa === selectedKhoaNganh
      );
      setNganhList(filteredNganh);
    } else {
      setNganhList(allNganhList);
    }
    setSelectedNganhKhoiKienThuc("");
  }, [selectedKhoaNganh, allNganhList]);

  useEffect(() => {
    const fetchKhoiKienThucTheoNganh = async () => {
      if (selectedNganhKhoiKienThuc) {
        const data = await fetchWithToken(
          `http://localhost:3000/api/khoikienthucchuyenganh?nganh=${selectedNganhKhoiKienThuc}`
        );
        if (data?.success) {
          setKhoiKienThucList(data.data);
        }
      } else {
        const data = await fetchWithToken(
          "http://localhost:3000/api/khoikienthucchuyenganh"
        );
        if (data?.success) {
          setKhoiKienThucList(data.data);
        }
      }
    };

    fetchKhoiKienThucTheoNganh();
  }, [selectedNganhKhoiKienThuc]);

  const handleKhoaChange = (event) => {
    setSelectedKhoaNganh(event.target.value);
  };

  const handleNganhChange = (event) => {
    setSelectedNganhKhoiKienThuc(event.target.value);
  };

  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-6 text-error">Lỗi: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Quản lý Khoa / Ngành / Khối Kiến Thức Chuyên Ngành
      </h1>

      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === "khoa" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("khoa")}
        >
          Khoa
        </a>
        <a
          className={`tab ${activeTab === "nganh" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("nganh")}
        >
          Ngành
        </a>
        <a
          className={`tab ${activeTab === "khoikienthuc" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("khoikienthuc")}
        >
          Khối Kiến Thức Chuyên Ngành
        </a>
      </div>

      {activeTab === "khoa" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Danh sách Khoa</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Mã Khoa</th>
                    <th>Tên Khoa</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {khoaList.map((khoa) => (
                    <tr key={khoa.MaKhoa}>
                      <td>{khoa.MaKhoa}</td>
                      <td>{khoa.TenKhoa}</td>
                      <td>
                        <button className="btn btn-sm btn-primary btn-outline mr-2">
                          Sửa
                        </button>
                        <button className="btn btn-sm btn-error">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-sm btn-success">Thêm Khoa</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "nganh" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Danh sách Ngành</h2>
            <div className="mb-4">
              <label htmlFor="khoaSelect" className="label">
                <span className="label-text">Chọn Khoa:</span>
              </label>
              <select
                id="khoaSelect"
                className="select select-bordered w-full"
                value={selectedKhoaNganh}
                onChange={handleKhoaChange}
              >
                <option value="">Tất cả các khoa</option>
                {khoaList.map((khoa) => (
                  <option key={khoa.MaKhoa} value={khoa.MaKhoa}>
                    {khoa.TenKhoa}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Mã Ngành</th>
                    <th>Tên Ngành</th>
                    <th>Khoa</th>
                    <th>Mô tả</th>
                    <th>Số Chương trình</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {nganhList.map((nganh) => (
                    <tr key={nganh.MaNganh}>
                      <td>{nganh.MaNganh}</td>
                      <td>{nganh.TenNganh}</td>
                      <td>{nganh.TenKhoa}</td>
                      <td>{nganh.MoTa || "Không có mô tả"}</td>
                      <td>{nganh.SoChuongTrinh}</td>
                      <td>
                        <button className="btn btn-sm btn-primary btn-outline mr-2">
                          Sửa
                        </button>
                        <button className="btn btn-sm btn-error">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-sm btn-success">Thêm Ngành</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "khoikienthuc" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              Danh sách Khối Kiến Thức Chuyên Ngành
            </h2>
            <div className="mb-4">
              <label htmlFor="nganhSelect" className="label">
                <span className="label-text">Chọn Ngành:</span>
              </label>
              <select
                id="nganhSelect"
                className="select select-bordered w-full"
                value={selectedNganhKhoiKienThuc}
                onChange={handleNganhChange}
              >
                <option value="">Tất cả các ngành</option>
                {nganhList.map((nganh) => (
                  <option key={nganh.MaNganh} value={nganh.MaNganh}>
                    {nganh.TenNganh}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Mã Khối Kiến Thức</th>
                    <th>Tên Khối Kiến Thức</th>
                    <th>Parent ID</th>
                    <th>Tổng Số Tín Chỉ</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {khoiKienThucList.map((kkt) => (
                    <tr key={kkt.MaKhoiKienThuc}>
                      <td>{kkt.MaKhoiKienThuc}</td>
                      <td>{kkt.TenKhoiKienThuc}</td>
                      <td>{kkt.ParentID}</td>
                      <td>{kkt.TongSoTinChi}</td>
                      <td>
                        <button className="btn btn-sm btn-primary btn-outline mr-2">
                          Sửa
                        </button>
                        <button className="btn btn-sm btn-error">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-sm btn-success">
                Thêm Khối Kiến Thức
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KhoaNganhKhoiKienThucManagement;
