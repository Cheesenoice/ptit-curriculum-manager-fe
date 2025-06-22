// src/services/monHocService.js
import apiClient from "../config/apiClient";

// Lấy toàn bộ danh sách môn học
export const fetchAllMonHoc = async () => {
  try {
    const res = await apiClient.get("/monhoc");
    const data = res.data;
    return data.success
      ? { success: true, data: data.data }
      : { success: false, message: data.message };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi khi lấy danh sách môn học.",
    };
  }
};

// Thêm môn học mới
export const createMonHoc = async (payload) => {
  try {
    const res = await apiClient.post("/monhoc", payload);
    const data = res.data;
    return data.success
      ? { success: true, message: data.message || "Thêm thành công" }
      : { success: false, message: data.message || "Thêm thất bại" };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi khi thêm môn học.",
    };
  }
};

// Cập nhật môn học
export const updateMonHoc = async (maMonHoc, payload) => {
  try {
    const res = await apiClient.patch(`/monhoc/${maMonHoc}`, payload);
    const data = res.data;
    return data.success
      ? { success: true, message: data.message || "Cập nhật thành công" }
      : { success: false, message: data.message || "Cập nhật thất bại" };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi khi cập nhật môn học.",
    };
  }
};

// Xóa môn học
export const deleteMonHoc = async (maMonHoc) => {
  try {
    const res = await apiClient.delete(`/monhoc/${maMonHoc}`);
    const data = res.data;
    return data.success
      ? { success: true, message: data.message || "Xóa thành công" }
      : { success: false, message: data.message || "Xóa thất bại" };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Lỗi khi xóa môn học.",
    };
  }
};

export const getAllMonHoc = async (token) => {
  return apiClient.get("/monhoc", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMonHocByGiangVien = async (maGiangVien, token) => {
  return apiClient.get(`/monhoc/giangvien/${maGiangVien}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateMonHocGiangVien = async (
  maGiangVien,
  danhSachMaMonHoc,
  token
) => {
  return apiClient.post(
    "/monhoc/giangvien/capnhat",
    { maGiangVien, danhSachMaMonHoc },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
