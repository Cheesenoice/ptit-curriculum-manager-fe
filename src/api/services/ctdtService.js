// src/services/chuongtrinhdaotaoservice.js
import apiClient from "../config/apiClient";

// Lấy toàn bộ chương trình đào tạo
export const fetchAllChuongTrinhDaoTao = async () => {
  try {
    const res = await apiClient.get("/chuongtrinhdaotao");
    const data = res.data;
    if (data.success) {
      return {
        success: true,
        data: Array.isArray(data.data) ? data.data : [data.data],
      };
    } else {
      return { success: false, data: [], message: data.message };
    }
  } catch (err) {
    console.error("Lỗi fetchAllChuongTrinhDaoTao:", err);
    return { success: false, data: [], message: "Lỗi mạng hoặc máy chủ." };
  }
};

// Lấy chi tiết theo mã chương trình
export const fetchChuongTrinhByMa = async (maChuongTrinh) => {
  try {
    const res = await apiClient.get(`/chuongtrinhdaotao/${maChuongTrinh}`);
    const data = res.data;
    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, data: null, message: data.message };
    }
  } catch (err) {
    console.error("Lỗi fetchChuongTrinhByMa:", err);
    return { success: false, data: null, message: "Lỗi mạng hoặc máy chủ." };
  }
};

// Lấy danh sách khối kiến thức
export const fetchKhoiKienThuc = async () => {
  try {
    const res = await apiClient.get("/khoikienthuc");
    return res.data;
  } catch (err) {
    console.error("Lỗi fetchKhoiKienThuc:", err);
    throw err;
  }
};

// Lấy danh sách chuyên ngành
export const fetchChuyenNganh = async (maChuongTrinh) => {
  try {
    const res = await apiClient.get(
      `/chuongtrinhdaotao/${maChuongTrinh}/chuyennganh`
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi fetchChuyenNganh:", err);
    throw err;
  }
};

// Lấy danh sách môn học theo khối kiến thức
export const fetchMonHocByKhoiKienThuc = async (maKhoiKienThuc) => {
  try {
    const res = await apiClient.get(`/khoikienthuc/${maKhoiKienThuc}`);
    return res.data;
  } catch (err) {
    console.error("Lỗi fetchMonHocByKhoiKienThuc:", err);
    throw err;
  }
};

// Thêm môn học vào chương trình
export const addMonHocToChuongTrinh = async (maChuongTrinh, maMonHoc) => {
  try {
    const res = await apiClient.post(`/chuongtrinhdaotao/${maChuongTrinh}`, {
      maMonHoc,
      hocky: null,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi addMonHocToChuongTrinh:", err);
    throw err;
  }
};

// Cập nhật học kỳ môn học
export const updateHocKyMonHoc = async (maChuongTrinh, maMonHoc, hocKyMoi) => {
  try {
    const res = await apiClient.patch(
      `/chuongtrinhdaotao/${maChuongTrinh}/monhoc/${maMonHoc}`,
      {
        hocky: hocKyMoi,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi updateHocKyMonHoc:", err);
    throw err;
  }
};

// Xóa môn học khỏi chương trình
export const deleteMonHocFromChuongTrinh = async (maChuongTrinh, maMonHoc) => {
  try {
    const res = await apiClient.delete(
      `/chuongtrinhdaotao/${maChuongTrinh}/monhoc/${maMonHoc}`
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi deleteMonHocFromChuongTrinh:", err);
    throw err;
  }
};

// Lấy danh sách môn tự chọn
export const fetchMonTuChon = async (maChuongTrinh, maKhoiKienThuc, hocKy) => {
  try {
    const res = await apiClient.get(
      `/chuongtrinhdaotao/${maChuongTrinh}/montuchon`,
      {
        params: { maKhoiKienThuc, hocKy },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi fetchMonTuChon:", err);
    throw err;
  }
};

// Thêm môn tự chọn
export const addMonTuChon = async (maChuongTrinh, maKhoiKienThuc, hocKy) => {
  try {
    const res = await apiClient.post(
      `/chuongtrinhdaotao/${maChuongTrinh}/montuchon`,
      {
        maKhoiKienThuc,
        hocKy,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi addMonTuChon:", err);
    throw err;
  }
};

// Xóa môn tự chọn
export const deleteMonTuChon = async (maChuongTrinh, maKhoiKienThuc, hocKy) => {
  try {
    const res = await apiClient.delete(
      `/chuongtrinhdaotao/${maChuongTrinh}/montuchon`,
      {
        data: { maKhoiKienThuc, hocKy },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi deleteMonTuChon:", err);
    throw err;
  }
};

export const getAllCtdt = async (token) => {
  return apiClient.get("/ctdt", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addCtdt = async (data, token) => {
  return apiClient.post("/ctdt/them", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteCtdt = async (maChuongTrinh, token) => {
  return apiClient.delete(`/ctdt/xoa/${maChuongTrinh}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCtdt = async (data, token) => {
  return apiClient.put("/ctdt/capnhat", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
