import { useParams, useNavigate, Link } from "react-router-dom";
import { PRODUCTS } from "@/const/product.const";
import { CATEGORIES } from "@/const/category.const";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find((prod) => prod.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-900">Product not found</p>
          <button
            onClick={() => navigate("/admin/products")}
            className="mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find((cat) => cat.id === product.categoryId);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
          <div className="flex gap-4">
            <Link
              to={`/admin/products/${product.id}/edit`}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              Edit
            </Link>
            <button
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-80 object-cover rounded"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                <p className="text-xl font-semibold text-gray-900">{product.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-900">{product.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                <p className="text-gray-900">{category?.name || "Unknown"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                <p className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : product.status === "out_of_stock"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                <p className="text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                <p className="text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
