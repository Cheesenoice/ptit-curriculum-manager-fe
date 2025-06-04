// components/Common/ProductCard.jsx
import { Heart } from "lucide-react";
import { useState } from "react";

function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của <a>
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên <a>
    setIsLiked(!isLiked);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của <a>
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên <a>
    // Thêm logic cho "Thêm vào giỏ" ở đây nếu cần
    console.log("Added to cart:", product.name);
  };

  return (
    <div className="min-w-[25%] p-4">
      <div className="relative">
        <a href={product.href} className="block">
          <img
            alt={product.imageAlt}
            src={product.imageSrc}
            className="w-full aspect-[3/4] rounded-md object-cover"
          />
        </a>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            onClick={handleLikeClick} // Sử dụng hàm xử lý riêng
            className={`btn btn-soft btn-primary btn-circle ${
              isLiked ? "btn-active" : ""
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 line-clamp-2 max-w-[200px] h-10">
            <a href={product.href}>{product.name}</a>
          </h3>
        </div>
        <p className="text-sm font-bold text-primary">{product.price}</p>
      </div>
      <button
        onClick={handleAddToCartClick} // Sử dụng hàm xử lý riêng
        className="btn btn-outline btn-primary btn-sm w-full mt-2"
      >
        Thêm vào giỏ
      </button>
    </div>
  );
}

export default ProductCard;
