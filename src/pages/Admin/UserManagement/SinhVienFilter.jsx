import React from "react";

const SinhVienFilter = ({
  nganhList = [],
  nienKhoaList = [],
  selectedNganh = "",
  selectedNienKhoa = "",
  onNganhChange,
  onNienKhoaChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div>
        <label className="label">
          <span className="label-text">Lọc theo ngành:</span>
        </label>
        <select
          className="select select-bordered"
          value={selectedNganh}
          onChange={(e) => onNganhChange(e.target.value)}
        >
          <option value="">Tất cả ngành</option>
          {nganhList.map((nganh) => (
            <option key={nganh.MaNganh} value={nganh.MaNganh}>
              {nganh.TenNganh}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">
          <span className="label-text">Lọc theo niên khóa:</span>
        </label>
        <select
          className="select select-bordered"
          value={selectedNienKhoa}
          onChange={(e) => onNienKhoaChange(e.target.value)}
        >
          <option value="">Tất cả niên khóa</option>
          {nienKhoaList.map((nk) => (
            <option key={nk} value={nk}>
              {nk}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SinhVienFilter;
