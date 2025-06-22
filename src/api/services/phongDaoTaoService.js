import apiClient from "../config/apiClient";

export const getAllPhongDaoTao = async (token) => {
  return apiClient.get("/user/phongdaotao", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addPhongDaoTao = async (data, token) => {
  return apiClient.post("/user/phongdaotao/them", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deletePhongDaoTao = async (id, token) => {
  return apiClient.delete(`/user/phongdaotao/xoa/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
