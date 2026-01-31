import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "@/const/category.const";
import type { Category } from "@/types/category";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <Link
            to="/admin/categories/create"
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Add Category
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Name</th>
                <th className="text-left p-4 font-semibold text-gray-900">Description</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-4">{category.name}</td>
                  <td className="p-4 text-gray-600">{category.description}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        category.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/categories/${category.id}/edit`}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;
