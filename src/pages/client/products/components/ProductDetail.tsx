import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PRODUCTS_CLIENT } from "@/const/product-client.const";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = useMemo(
    () => PRODUCTS_CLIENT.find((item) => item.id === Number(id)),
    [id],
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.image ?? "");

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-neutral-900">
            Coffee not found
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            The coffee you are looking for may have been removed or is
            temporarily unavailable.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
            onClick={() => navigate("/client/products")}
          >
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = [product.image, product.image, product.image];

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
        {/* Left: main image + thumbnails */}
        <div className="flex flex-1 flex-col gap-4 lg:max-w-xl">
          <div className="overflow-hidden rounded-3xl bg-neutral-100 shadow-sm">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="h-full w-full max-h-[460px] object-cover"
            />
          </div>

          <div className="flex gap-3">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`flex h-20 w-24 items-center justify-center overflow-hidden rounded-xl border bg-white transition ${
                  (selectedImage || product.image) === img
                    ? "border-black-500 ring-2 ring-black-500/40"
                    : "border-neutral-200 hover:border-brown-300"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: info, price, actions */}
        <div className="flex flex-1 flex-col gap-4 lg:pl-6">
          <button
            type="button"
            className="mb-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700"
            onClick={() => navigate("/client/products")}
          >
            <span className="text-lg">←</span>
            Back to list
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Coffee Franchise
          </p>

          <p className="text-xs text-neutral-500">
            SKU:{" "}
            <span className="font-medium text-neutral-700">{product.sku}</span>
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-4xl font-semibold text-[#6D4C41]">
              {product.min_price.toLocaleString("vi-VN")} VND
            </span>
            {product.max_price !== product.min_price && (
              <span className="text-sm text-neutral-500 line-through">
                {product.max_price.toLocaleString("vi-VN")} VND
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">Quantity:</span>
              <div className="flex items-center rounded-full border border-neutral-200 bg-white text-sm">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="h-9 w-9 rounded-l-full text-lg text-neutral-600 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-medium text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="h-9 w-9 rounded-r-full text-lg text-neutral-600 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {product.is_active ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[#6D4C41] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b4037] sm:flex-none sm:px-10"
            >
              Buy now
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[#6D4C41] px-6 py-3 text-sm font-semibold text-[#6D4C41] transition hover:bg-[#f3e9e4] sm:flex-none sm:px-10"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="mx-auto mt-12 max-w-6xl border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">
          Product description
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
