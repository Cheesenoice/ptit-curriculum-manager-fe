import apiClient from "../config/apiClient";

export const getAllKhoa = async (token) => {
  return apiClient.get("/khoa", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getKhoaById = async (maKhoa, token) => {
  return apiClient.get(`/khoa/${maKhoa}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addKhoa = async (data, token) => {
  return apiClient.post("/khoa/them", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateKhoa = async (data, token) => {
  return apiClient.put("/khoa/capnhat", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteKhoa = async (maKhoa, token) => {
  return apiClient.delete(`/khoa/xoa/${maKhoa}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
