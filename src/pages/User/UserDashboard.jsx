import React from "react";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Lightbulb,
} from "lucide-react";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-8">
      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            👋 Chào mừng, {user?.name}!
          </h1>
          <p className="text-lg text-base-content mb-2">
            Đây là giao diện Dashboard dành cho{" "}
            <span className="font-semibold text-primary">{user?.roles}</span>
          </p>
          <blockquote className="italic text-base-content/80 border-l-4 border-primary pl-4 my-4">
            “Học tập là chìa khóa của thành công. Chúc bạn một ngày học tập hiệu
            quả!”
          </blockquote>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="card-body flex flex-row items-center gap-4">
              <BookOpen className="text-primary" size={36} />
              <div>
                <h2 className="card-title text-primary"> Tiên phong</h2>
                <p className="text-3xl font-bold"></p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="card-body flex flex-row items-center gap-4">
              <CalendarCheck className="text-primary" size={36} />
              <div>
                <h2 className="card-title text-primary">Sáng tạo</h2>
                <p className="text-3xl font-bold"></p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="card-body flex flex-row items-center gap-4">
              <ClipboardList className="text-primary" size={36} />
              <div>
                <h2 className="card-title text-primary">Tận tụy</h2>
                <p className="text-3xl font-bold"></p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips box */}
        <div className="card bg-primary/10 border border-primary/20 shadow mb-4">
          <div className="card-body flex flex-row items-center gap-4">
            <Lightbulb className="text-primary" size={28} />
            <div>
              <h3 className="font-bold text-primary mb-1">Tips for Success</h3>
              <ul className="list-disc ml-5 text-base-content/80 text-sm">
                <li>Kiểm tra lịch học và bài tập thường xuyên.</li>
                <li>Chủ động hỏi giảng viên khi có thắc mắc.</li>
                <li>
                  Tham gia các hoạt động ngoại khóa để phát triển kỹ năng mềm.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="hidden lg:flex items-center justify-center w-1/3">
        <img
          src="https://ptit.edu.vn/wp-content/uploads/2024/06/ptit-banner.jpg"
          alt="Study Illustration"
          className="w-full max-w-xs rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default UserDashboard;
