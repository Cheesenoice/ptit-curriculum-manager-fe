import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Layout/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Home/Login/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import PhongDaoTao from "./pages/Admin/UserManagement/Phongdaotao";
import GiangVien from "./pages/Admin/UserManagement/GiangVien";
import SinhVien from "./pages/Admin/UserManagement/SinhVien";

import MonhocManagement from "./pages/Admin/MonhocManagement";
import KhoikienthucMonhocManagement from "./pages/Admin/KhoikienthucMonhocManagement/KhoikienthucMonhocManagement";
import ChuongtrinhdaotaoManagement from "./pages/Admin/ChuongtrinhdaotaoManagemant/ChuongtrinhdaotaoManagemant";
import NienkhoaKyhocManagement from "./pages/Admin/NienkhoaKyhocManagement";
import KhoaNganhChuyenNganhManagement from "./pages/Admin/KhoaNganhChuyenNganhManagement";
import ChitietCtdt from "./pages/Admin/ChuongtrinhdaotaoManagemant/ChitietCtdt";

// 👇 Tạo component wrapper để dùng hook
const AppContent = () => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("access_token");
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/admin" replace /> : <Login />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["PHONGDAOTAO"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          {/* Quản lý người dùng */}
          <Route path="users" element={<UserManagement />} />
          <Route path="users/phong-dao-tao" element={<PhongDaoTao />} />
          <Route path="users/giang-vien" element={<GiangVien />} />
          <Route path="users/sinh-vien" element={<SinhVien />} />
          {/* Quản lý môn học */}
          <Route path="monhoc" element={<MonhocManagement />} />
          <Route
            path="khoikienthuc-monhoc"
            element={<KhoikienthucMonhocManagement />}
          />
          {/* Quản lý chương trình đào tạo */}
          <Route
            path="chuongtrinhdaotao"
            element={<ChuongtrinhdaotaoManagement />}
          />
          <Route path="chuongtrinhdaotao/chitiet" element={<ChitietCtdt />} />
          <Route
            path="khoa-nganh-chuyennganh"
            element={<KhoaNganhChuyenNganhManagement />}
          />
          <Route path="nienkhoa-kyhoc" element={<NienkhoaKyhocManagement />} />
        </Route>
      </Routes>

      {/* ❌ Không hiển thị Footer trong admin */}
      {!isAdminPath && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
