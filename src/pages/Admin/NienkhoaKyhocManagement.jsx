import React, { useState, useEffect } from "react";

const NienkhoaKyhocManagement = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch("http://localhost:3000/api/nienkhoa", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAcademicYears(data.data);
        } else {
          console.error("Lỗi khi tải dữ liệu niên khóa:", data.message);
          // Xử lý lỗi hiển thị cho người dùng nếu cần
        }
      })
      .catch((error) => {
        console.error("Lỗi mạng hoặc lỗi không xác định:", error);
        // Xử lý lỗi hiển thị cho người dùng nếu cần
      });
  }, []);

  const renderSemesters = () => {
    const semesters = Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      name: `Học kỳ ${i + 1}`,
    }));

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {/* Năm học 1 */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Năm học thứ 1</h4>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 1
          </div>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 2
          </div>
        </div>

        {/* Năm học 2 */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Năm học thứ 2</h4>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 3
          </div>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 4
          </div>
        </div>

        {/* Năm học 3 */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Năm học thứ 3</h4>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 5
          </div>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 6
          </div>
        </div>

        {/* Năm học 4 */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Năm học thứ 4</h4>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 7
          </div>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer">
            Học kỳ 8
          </div>
        </div>

        {/* Năm học 5 */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Năm học thứ 5</h4>
          <div className="bg-primary-content p-2 rounded shadow hover:bg-primary hover:text-white transition-colors cursor-pointer w-full">
            Học kỳ 9
          </div>
        </div>
      </div>
    );
    s;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">
        Quản lý Niên khóa & Kỳ học
      </h1>
      <div className="space-y-8">
        {academicYears.map((year) => (
          <div key={year.MaNienKhoa} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Niên khóa {year.NamBatDau} - {year.NamKetThuc} (
                {year.MaNienKhoa})
              </h2>
              {renderSemesters()}
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-outline btn-primary">
                  Xem chi tiết
                </button>
                {/* Thêm các nút chức năng khác nếu cần */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NienkhoaKyhocManagement;
