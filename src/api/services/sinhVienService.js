import apiClient from "../config/apiClient";

export const getAllStudents = async (token) => {
  return apiClient.get("/sinhvien", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getStudentById = async (maSinhVien, token) => {
  return apiClient.get(`/sinhvien/${maSinhVien}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addStudent = async (data, token) => {
  return apiClient.post("/sinhvien/them", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateStudent = async (data, token) => {
  return apiClient.put("/sinhvien/capnhat", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteStudent = async (maSinhVien, token) => {
  return apiClient.delete(`/sinhvien/xoa/${maSinhVien}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
