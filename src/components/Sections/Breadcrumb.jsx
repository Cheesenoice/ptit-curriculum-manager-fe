import React from "react";
import { House } from "lucide-react";

const Breadcrumb = () => {
  return (
    <div className="relative w-full h-[45vh]">
      {/* Background image */}
      <img
        src="/collection/sanh-ptit.jpg"
        alt="Sảnh PTIT"
        className="w-full h-full object-cover object-[45%_75%]	"
      />

      {/* Overlay layer */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
        {/* Breadcrumb using DaisyUI */}
        <div className="breadcrumbs text-base mb-2 font-medium">
          <ul className="flex items-center gap-2">
            <li>
              <a className="inline-flex">
                <House className="h-4 w-4 stroke-current" />
              </a>
            </li>
            <li>
              <a className="inline-flex">Chương trình đào tạo</a>
            </li>
            <li>
              <span className="inline-flex">Đại học</span>
            </li>
          </ul>
        </div>

        {/* Page title */}
        <h1 className="text-4xl font-bold">Đại học</h1>
      </div>
    </div>
  );
};

export default Breadcrumb;
