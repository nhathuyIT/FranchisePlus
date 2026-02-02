import { useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "@/const/product.const";
import { CATEGORIES } from "@/const/category.const";
import type { Product } from "@/types/product.type";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const getCategoryName = (categoryId: string | number) => {
    return CATEGORIES.find((cat) => cat.id === categoryId)?.name || "Unknown";
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((prod) => prod.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link
            to="/admin/products/create"
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Add Product
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Image</th>
                <th className="text-left p-4 font-semibold text-gray-900">Name</th>
                <th className="text-left p-4 font-semibold text-gray-900">Category</th>
                <th className="text-left p-4 font-semibold text-gray-900">Price</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4 text-gray-600">
                    {getCategoryName(product.categoryId)}
                  </td>
                  <td className="p-4">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "out_of_stock"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
