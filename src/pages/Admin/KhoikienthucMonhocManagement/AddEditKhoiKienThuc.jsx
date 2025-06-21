import React, { useMemo, useState } from "react";
import {
  updateKhoiKienThuc,
  addKhoiKienThuc,
} from "../../../api/services/khoiKienThucService";
import { showToast } from "../../../components/Common/showToast";

const AddEditKhoiKienThuc = ({ kktData, editKKT, onClose, onSuccess }) => {
  const isEdit = !!editKKT;

  const [editForm, setEditForm] = useState({
    maKhoiKienThuc: "", // <-- thêm dòng này
    tenKhoiKienThuc: editKKT?.tenKhoiKienThuc || "",
    parentId: editKKT?.parentId || "",
  });

  const selectableParents = useMemo(() => {
    const flat = [];
    const collect = (list) => {
      list.forEach((node) => {
        flat.push({ ma: node.maKhoiKienThuc, ten: node.tenKhoiKienThuc });
        if (node.khoiKienThucCon?.length) collect(node.khoiKienThucCon);
      });
    };
    collect(kktData);
    return flat.filter((item) => item.ma !== editKKT?.maKhoiKienThuc);
  }, [kktData, editKKT]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (isEdit) {
      res = await updateKhoiKienThuc(editKKT.maKhoiKienThuc, {
        tenKhoiKienThuc: editForm.tenKhoiKienThuc,
        parentId: editForm.parentId,
      });
    } else {
      if (!editForm.maKhoiKienThuc) {
        showToast("Vui lòng nhập mã khối kiến thức!", "error");
        return;
      }
      res = await addKhoiKienThuc(editForm);
    }

    if (res.success) {
      showToast(`${isEdit ? "Cập nhật" : "Thêm"} thành công!`, "success");
      onSuccess();
    } else {
      showToast("Lỗi: " + res.message, "error");
    }
  };

  return (
    <dialog open className="modal modal-open">
      <form method="dialog" className="modal-box w-96" onSubmit={handleSubmit}>
        <h3 className="font-bold text-lg mb-4">
          {isEdit ? "Sửa" : "Thêm"} khối kiến thức
        </h3>

        {!isEdit && (
          <>
            <label className="block text-sm mb-1">Mã khối kiến thức</label>
            <input
              type="text"
              name="maKhoiKienThuc"
              value={editForm.maKhoiKienThuc}
              onChange={handleChange}
              className="input input-bordered w-full mb-3"
              required
            />
          </>
        )}

        <label className="block text-sm mb-1">Tên khối kiến thức</label>
        <input
          type="text"
          name="tenKhoiKienThuc"
          value={editForm.tenKhoiKienThuc}
          onChange={handleChange}
          className="input input-bordered w-full mb-3"
          required
        />

        <label className="block text-sm mb-1">
          Khối kiến thức cha (nếu có)
        </label>
        <select
          name="parentId"
          value={editForm.parentId}
          onChange={handleChange}
          className="select select-bordered w-full mb-4"
        >
          <option value="">Không có (root)</option>
          {selectableParents.map((item) => (
            <option key={item.ma} value={item.ma}>
              {item.ten}
            </option>
          ))}
        </select>

        <div className="modal-action">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Lưu" : "Thêm"}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default AddEditKhoiKienThuc;
