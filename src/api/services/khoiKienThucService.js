// src/services/khoiKienThucService.js
import apiClient from "../config/apiClient";

// Lấy toàn bộ danh sách khối kiến thức (có phân cấp)
export const fetchAllKhoiKienThuc = async () => {
  try {
    const response = await apiClient.get("/khoikienthuc");
    const data = response.data;

    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || "Lỗi khi lấy danh sách khối kiến thức.";
    return { success: false, message };
  }
};

// Lấy danh sách môn học theo mã khối kiến thức
export const fetchMonhocByMaKKT = async (maKKT) => {
  try {
    const response = await apiClient.get(`/khoikienthuc/${maKKT}`);
    const data = response.data;

    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Lỗi khi lấy danh sách môn học theo khối kiến thức.";
    return { success: false, message };
  }
};

// Cập nhật khối kiến thức
export const updateKhoiKienThuc = async (maKKT, payload) => {
  try {
    const res = await apiClient.put(`/khoikienthuc/${maKKT}`, payload);
    const data = res.data;

    if (data.success) {
      return { success: true, message: data.message || "Cập nhật thành công" };
    } else {
      return { success: false, message: data.message || "Cập nhật thất bại" };
    }
  } catch (err) {
    const message =
      err.response?.data?.message || "Lỗi khi cập nhật khối kiến thức.";
    return { success: false, message };
  }
};

// Thêm khối kiến thức mới
export const addKhoiKienThuc = async (payload) => {
  try {
    const res = await apiClient.post("/khoikienthuc", payload);
    const data = res.data;

    if (data.success) {
      return { success: true, message: data.message || "Thêm thành công" };
    } else {
      return { success: false, message: data.message || "Thêm thất bại" };
    }
  } catch (err) {
    const message =
      err.response?.data?.message || "Lỗi khi thêm khối kiến thức.";
    return { success: false, message };
  }
};

// Xóa khối kiến thức
export const deleteKhoiKienThuc = async (maKKT) => {
  try {
    const res = await apiClient.delete(`/khoikienthuc/${maKKT}`);
    const data = res.data;

    if (data.success) {
      return { success: true, message: data.message || "Xóa thành công" };
    } else {
      return { success: false, message: data.message || "Xóa thất bại" };
    }
  } catch (err) {
    const message =
      err.response?.data?.message || "Lỗi khi xóa khối kiến thức.";
    return { success: false, message };
  }
};
