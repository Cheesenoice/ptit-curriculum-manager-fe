// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../api/services/productService";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productName } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProducts();
        const foundProduct = response.data.products.find(
          (p) => encodeURIComponent(p.name) === productName
        );
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-2xl">
          $
          {Number(product.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>
        <img
          src={product.image0 || "/collection/collection-chair.jpg"}
          alt={product.name}
          className="mt-4 w-full max-w-md"
        />
        {/* Thêm các thông tin chi tiết khác nếu cần */}
      </div>
    </div>
  );
}
