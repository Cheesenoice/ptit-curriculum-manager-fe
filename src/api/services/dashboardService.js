import apiClient from "../config/apiClient";

export const getSummary = async (token) => {
  return apiClient.get("/dashboard/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTopNganhSinhVien = async (token) => {
  return apiClient.get("/dashboard/top-nganh-sinhvien", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSinhVienNienKhoa = async (token) => {
  return apiClient.get("/dashboard/sinhvien-nienkhoa", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getGiangVienKhoa = async (token) => {
  return apiClient.get("/dashboard/giangvien-khoa", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMonHocCtdt = async (token) => {
  return apiClient.get("/dashboard/monhoc-ctdt", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
