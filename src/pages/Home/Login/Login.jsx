// src/pages/Home/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Layout/Header/Header";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { loginUser } from "../../../api/services/userService"; // 👈 Dùng service

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 Thêm loading state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // 👈 Bắt đầu loading

    const result = await loginUser({ tenDangNhap, matKhau });

    setLoading(false); // 👈 Dừng loading

    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-col md:flex-row justify-center flex-1">
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-base-100">
          <div className="w-full max-w-md space-y-8">
            <div className="tabs tabs-boxed justify-center mb-6">
              <a
                className={`tab ${activeTab === "login" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </a>
              <a
                className={`tab ${
                  activeTab === "register" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </a>
              <a
                className={`tab ${activeTab === "forgot" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("forgot")}
              >
                Forgot Password
              </a>
            </div>

            {activeTab === "login" && (
              <form className="space-y-6" onSubmit={handleLogin}>
                {error && <div className="text-red-500">{error}</div>}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tên đăng nhập</span>
                  </label>
                  <input
                    type="text"
                    value={tenDangNhap}
                    onChange={(e) => setTenDangNhap(e.target.value)}
                    placeholder="Tên đăng nhập"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Mật khẩu</span>
                  </label>
                  <input
                    type="password"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    placeholder="Mật khẩu"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "register" && <Register />}
            {activeTab === "forgot" && <ForgotPassword />}
          </div>
        </div>

        <div className="hidden md:block w-1/2 mb-3 bg-white">
          <img
            src="/collection/ptit-hcm.jpg"
            alt="Sảnh PTIT"
            className="w-full h-full rounded-2xl object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
