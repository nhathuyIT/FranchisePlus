import { useState } from "react";
import { Link } from "react-router-dom";
import { CustomerDataMock } from "@/const/customer.const";
import type { Customer } from "@/types/customer";

const UserCRUD = () => {
  const [customers, setCustomers] = useState<Customer[]>(CustomerDataMock);

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== id));
    }
  };

  const handleToggleActive = (id: string | number) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id
          ? { ...customer, is_active: !customer.is_active }
          : customer,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Management
          </h1>
          <Link
            to="/admin/user-control/create"
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Add Customer
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Avatar
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Name
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Phone
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Email
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Created At
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <img
                        src={
                          customer.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`
                        }
                        alt={customer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="p-4 text-gray-600">{customer.phone}</td>
                  <td className="p-4 text-gray-600">
                    {customer.email || "N/A"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/user-control/${customer.id}/edit`}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleToggleActive(customer.id)}
                        className={`px-3 py-1 text-sm border rounded transition-colors ${
                          customer.is_active
                            ? "border-orange-300 text-orange-600 hover:bg-orange-50"
                            : "border-green-300 text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {customer.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
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

        {customers.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-600">
              Get started by adding a new customer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCRUD;
