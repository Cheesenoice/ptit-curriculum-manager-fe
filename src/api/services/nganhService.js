import apiClient from "../config/apiClient";

export const getAllNganh = async (token) => {
  return apiClient.get("/nganh", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getNganhById = async (maNganh, token) => {
  return apiClient.get(`/nganh/${maNganh}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addNganh = async (data, token) => {
  return apiClient.post("/nganh/them", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateNganh = async (data, token) => {
  return apiClient.put("/nganh/capnhat", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteNganh = async (maNganh, token) => {
  return apiClient.delete(`/nganh/xoa/${maNganh}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
