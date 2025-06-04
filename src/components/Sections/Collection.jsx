import React, { useState } from "react";
import { House, Search } from "lucide-react";

const Collection = () => {
  // Dữ liệu mẫu
  const industries = [
    {
      id: 1,
      title: "Chương trình Công nghệ thông tin (định hướng ứng dụng)",
      code: "Mã ngành: 7480201_UD",
    },
    {
      id: 2,
      title: "Chương trình Logistics và quản trị chuỗi cung ứng",
      code: "Mã ngành: 7340101",
    },
    {
      id: 3,
      title: "Ngành Trí tuệ nhân tạo",
      code: "Mã ngành: 7480107",
    },
    {
      id: 4,
      title: "Chương trình Công nghệ thông tin Việt - Nhật",
      code: "Mã ngành: 7480201_VN",
    },
    {
      id: 5,
      title: "Chương trình Thiết kế và Phát triển Game",
      code: "Mã ngành: 752901_GAM",
    },
    {
      id: 6,
      title: "Chương trình Quản hệ công (Ngành Marketing)",
      code: "Mã ngành: 7520108",
    },
  ];

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIndustries, setFilteredIndustries] = useState(industries);

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = industries.filter((item) =>
      `${item.title} ${item.code}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredIndustries(filtered);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Search Bar and Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6 ">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Nhập thông tin tìm kiếm"
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-outline btn-primary">
            Sắp xếp theo
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Mới nhất</a>
            </li>
            <li>
              <a>Cũ nhất</a>
            </li>
          </ul>
        </div>

        <button className="btn btn-primary" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 lg:mx-20 ">
        {filteredIndustries.length > 0 ? (
          filteredIndustries.map((industry) => (
            <div key={industry.id} className="card card-border rounded-none">
              <div className="card-body">
                <div className="flex items-center mb-2 min-h-[3.5rem]">
                  <div className="w-10 h-10 mr-3 p-2 flex items-center justify-center rounded-full bg-primary-content">
                    <House className="text-primary" />
                  </div>
                  <h2 className="card-title w-full text-lg font-semibold text-primary ">
                    {industry.title}
                  </h2>
                </div>
                <span className="block w-full h-0.5 bg-gray-300 my-2 rounded-full"></span>
                <p className="text-gray-600">{industry.code}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Không tìm thấy kết quả phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default Collection;
