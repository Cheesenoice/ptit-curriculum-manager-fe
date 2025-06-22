import apiClient from "../config/apiClient";

export const getAllLecturers = async (token) => {
  return apiClient.get("/giangvien", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getLecturerById = async (maGiangVien, token) => {
  return apiClient.get(`/giangvien/${maGiangVien}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addLecturer = async (data, token) => {
  return apiClient.post("/giangvien/them", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateLecturer = async (data, token) => {
  return apiClient.put("/giangvien/capnhat", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteLecturer = async (maGiangVien, token) => {
  return apiClient.delete(`/giangvien/xoa/${maGiangVien}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
