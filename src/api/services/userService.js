// src/services/userService.js
import apiClient from "../config/apiClient";

// Hàm đăng nhập
export const loginUser = async ({ tenDangNhap, matKhau }) => {
  try {
    const response = await apiClient.post("/user/dangnhap", {
      tenDangNhap,
      matKhau,
    });

    const data = response.data;

    if (data.success) {
      // Lưu token
      localStorage.setItem("access_token", data.access_token);

      // Lưu thông tin người dùng
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          roles: data.roles,
          maKhoa: data.maKhoa,
          tenKhoa: data.tenKhoa,
        })
      );

      return { success: true, user: data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    // Nếu lỗi đến từ backend và có message
    const message =
      error.response?.data?.message || "Đã xảy ra lỗi không xác định.";
    return { success: false, message };
  }
};

// Hàm logout
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};
