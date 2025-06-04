import React, { useEffect, useState } from "react";
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

const FilterKKT = ({
  selectedKhoa,
  setSelectedKhoa,
  selectedNganh,
  setSelectedNganh,
  selectedChuyenNganh,
  setSelectedChuyenNganh,
  setKhoikienthucs,
  setLoading,
}) => {
  const [khoas, setKhoas] = useState([]);
  const [nganhs, setNganhs] = useState([]);
  const [chuyenNganhs, setChuyenNganhs] = useState([]);
  const [cache, setCache] = useState({}); // Cache for khoikienthuc data

  // Fetch khoa
  useEffect(() => {
    const fetchKhoas = async () => {
      try {
        const res = await axiosAuth.get("http://localhost:3000/api/khoa");
        if (res.data.success) setKhoas(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy khoa:", err);
      }
    };
    fetchKhoas();
  }, []);

  // Fetch ngành
  useEffect(() => {
    const fetchNganhs = async () => {
      if (!selectedKhoa) {
        setNganhs([]);
        return;
      }
      try {
        const res = await axiosAuth.get(
          `http://localhost:3000/api/nganh?khoa=${selectedKhoa}`
        );
        if (res.data.success) setNganhs(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy ngành:", err);
      }
    };
    fetchNganhs();
    setSelectedNganh("");
    setChuyenNganhs([]);
    setSelectedChuyenNganh("");
  }, [selectedKhoa]);

  // Fetch chuyên ngành
  useEffect(() => {
    const fetchChuyenNganhs = async () => {
      if (!selectedNganh) {
        setChuyenNganhs([]);
        return;
      }
      try {
        const res = await axiosAuth.get(
          `http://localhost:3000/api/chuyennganh?nganh=${selectedNganh}`
        );
        if (res.data.success) setChuyenNganhs(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy chuyên ngành:", err);
      }
    };
    fetchChuyenNganhs();
    setSelectedChuyenNganh("");
  }, [selectedNganh]);

  // Fetch khối kiến thức when "Lọc" button is clicked
  const handleFilter = async () => {
    setLoading(true);
    const params = {};
    if (selectedKhoa) params.maKhoa = selectedKhoa;
    if (selectedNganh) params.maNganh = selectedNganh;
    if (selectedChuyenNganh) params.maChuyenNganh = selectedChuyenNganh;

    const cacheKey = JSON.stringify(params);
    if (cache[cacheKey]) {
      setKhoikienthucs(cache[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      const res = await axiosAuth.get(
        "http://localhost:3000/api/khoikienthuc/filter",
        { params }
      );
      if (res.data.success) {
        const data = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];
        setCache((prev) => ({ ...prev, [cacheKey]: data }));
        setKhoikienthucs(data);
      } else {
        setKhoikienthucs([]);
      }
    } catch (err) {
      console.error("Lỗi lấy khối kiến thức:", err);
      setKhoikienthucs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium">Khoa</label>
          <select
            className="select select-bordered w-full"
            value={selectedKhoa}
            onChange={(e) => setSelectedKhoa(e.target.value)}
          >
            <option value="">Chọn khoa</option>
            {khoas.map((khoa) => (
              <option key={khoa.MaKhoa} value={khoa.MaKhoa}>
                {khoa.TenKhoa}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Ngành</label>
          <select
            className="select select-bordered w-full"
            value={selectedNganh}
            onChange={(e) => setSelectedNganh(e.target.value)}
          >
            <option value="">Chọn ngành</option>
            {nganhs.map((nganh) => (
              <option key={nganh.MaNganh} value={nganh.MaNganh}>
                {nganh.TenNganh}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Chuyên ngành</label>
          <select
            className="select select-bordered w-full"
            value={selectedChuyenNganh}
            onChange={(e) => setSelectedChuyenNganh(e.target.value)}
          >
            <option value="">Chọn chuyên ngành</option>
            {chuyenNganhs.map((cn) => (
              <option key={cn.MaChuyenNganh} value={cn.MaChuyenNganh}>
                {cn.TenChuyenNganh}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={handleFilter}>
          Lọc
        </button>
      </div>
    </div>
  );
};

export default FilterKKT;
