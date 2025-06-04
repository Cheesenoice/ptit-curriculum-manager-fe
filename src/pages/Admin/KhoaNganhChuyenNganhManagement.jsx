import React, { useState, useEffect } from "react";

const KhoaNganhChuyenNganhManagement = () => {
  const [khoaList, setKhoaList] = useState([]);
  const [nganhList, setNganhList] = useState([]);
  const [allNganhList, setAllNganhList] = useState([]); // Lưu trữ toàn bộ danh sách ngành
  const [chuyenNganhList, setChuyenNganhList] = useState([]);
  const [selectedKhoaNganh, setSelectedKhoaNganh] = useState("");
  const [selectedNganhChuyenNganh, setSelectedNganhChuyenNganh] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setAllNganhList(nganhData.data); // Lưu trữ toàn bộ danh sách ngành
      }

      const chuyenNganhData = await fetchWithToken(
        "http://localhost:3000/api/chuyennganh"
      );
      if (chuyenNganhData?.success) {
        setChuyenNganhList(chuyenNganhData.data);
      }

      setLoading(false);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    // Lọc ngành dựa trên khoa đã chọn từ state allNganhList
    if (selectedKhoaNganh && allNganhList.length > 0) {
      const filteredNganh = allNganhList.filter(
        (nganh) => nganh.MaKhoa === selectedKhoaNganh
      );
      setNganhList(filteredNganh);
    } else {
      // Nếu không có khoa nào được chọn, hiển thị tất cả ngành từ allNganhList
      setNganhList(allNganhList);
    }
    setSelectedNganhChuyenNganh(""); // Reset chuyên ngành khi đổi khoa
  }, [selectedKhoaNganh, allNganhList]);

  useEffect(() => {
    const fetchChuyenNganhTheoNganh = async () => {
      if (selectedNganhChuyenNganh) {
        const data = await fetchWithToken(
          `http://localhost:3000/api/chuyennganh?nganh=${selectedNganhChuyenNganh}`
        );
        if (data?.success) {
          setChuyenNganhList(data.data);
        }
      } else {
        // Nếu không có ngành nào được chọn, hiển thị tất cả chuyên ngành
        const data = await fetchWithToken(
          "http://localhost:3000/api/chuyennganh"
        );
        if (data?.success) {
          setChuyenNganhList(data.data);
        }
      }
    };

    fetchChuyenNganhTheoNganh();
  }, [selectedNganhChuyenNganh]);

  const handleKhoaChange = (event) => {
    setSelectedKhoaNganh(event.target.value);
  };

  const handleNganhChange = (event) => {
    setSelectedNganhChuyenNganh(event.target.value);
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
        Quản lý Khoa / Ngành / Chuyên ngành
      </h1>

      {/* KHOA */}
      <div className="card bg-base-100 shadow-md mb-8">
        <div className="card-body">
          <h2 className="card-title">1. Danh sách Khoa</h2>
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

      {/* NGÀNH */}
      <div className="card bg-base-100 shadow-md mb-8">
        <div className="card-body">
          <h2 className="card-title">2. Danh sách Ngành</h2>
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
                  <th>Mô tả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {nganhList.map((nganh) => (
                  <tr key={nganh.MaNganh}>
                    <td>{nganh.MaNganh}</td>
                    <td>{nganh.TenNganh}</td>
                    <td>{nganh.MoTa}</td>
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

      {/* CHUYÊN NGÀNH */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">3. Danh sách Chuyên ngành</h2>
          <div className="mb-4">
            <label htmlFor="nganhSelect" className="label">
              <span className="label-text">Chọn Ngành:</span>
            </label>
            <select
              id="nganhSelect"
              className="select select-bordered w-full"
              value={selectedNganhChuyenNganh}
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
                  <th>Mã Chuyên ngành</th>
                  <th>Tên Chuyên ngành</th>
                  <th>Thời gian đào tạo</th>
                  <th>Hình thức</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {chuyenNganhList.map((cn) => (
                  <tr key={cn.MaChuyenNganh}>
                    <td>{cn.MaChuyenNganh}</td>
                    <td>{cn.TenChuyenNganh}</td>
                    <td>{cn.ThoiGianDaoTao} năm</td>
                    <td>{cn.HinhThucDaoTao}</td>
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
              Thêm Chuyên ngành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhoaNganhChuyenNganhManagement;
