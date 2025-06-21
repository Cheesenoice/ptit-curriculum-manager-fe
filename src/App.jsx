import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Layout/Footer/Footer";
import Toast from "./components/Common/Toast";
import Home from "./pages/Home/Home";
import Login from "./pages/Home/Login/Login";
// Admin Pages
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
// User Pages
import UserLayout from "./pages/User/UserLayout";
import UserDashboard from "./pages/User/UserDashboard";
import ChuongtrinhdaotaoView from "./pages/User/Chuongtrinhdaotao/UserChuongtrinhdaotao";
import UserChitietCtdt from "./pages/User/Chuongtrinhdaotao/UserChitietCtdt";
import UserKhoikienthucMonhoc from "./pages/User/KhoikienthucMonhoc/UserKhoikienthucMonhoc";
import UserProfile from "./pages/User/UserProfile";

const AppContent = () => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("access_token");
  const isAdminPath = location.pathname.startsWith("/admin");
  const isUserPath = location.pathname.startsWith("/user");

  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/admin" replace /> : <Login />}
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Phòng đào tạo"]}>
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
        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["Sinh viên", "Giảng viên"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          {/* Add more user routes here, e.g., /user/courses, /user/profile */}
          <Route path="chuongtrinhdaotao" element={<ChuongtrinhdaotaoView />} />
          <Route
            path="chuongtrinhdaotao/chitiet"
            element={<UserChitietCtdt />}
          />
          <Route
            path="khoikienthuc-monhoc"
            element={<UserKhoikienthucMonhoc />}
          />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Routes>

      {/* Hide Footer in admin and user paths */}
      {!isAdminPath && !isUserPath && <Footer />}
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
