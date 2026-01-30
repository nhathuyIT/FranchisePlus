import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FRANCHISES_MOCK } from "@/const/franchises.const";
import { ROUTER_URL } from "@/router/route.const";
import type { Franchise } from "@/types/franchise";

const FranchiseForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Omit<Franchise, "createdAt" | "updatedAt">>({
    id: "",
    code: "",
    name: "",
    logo_url: undefined,
    address: "",
    opened_at: undefined,
    closed_at: undefined,
    is_active: true,
    is_deleted: false,
  });

  useEffect(() => {
    if (isEditMode && id) {
      const franchise = FRANCHISES_MOCK.find((f) => f.id === id);
      if (franchise) {
        setFormData({
          id: franchise.id,
          code: franchise.code,
          name: franchise.name,
          logo_url: franchise.logo_url,
          address: franchise.address,
          opened_at: franchise.opened_at,
          closed_at: franchise.closed_at,
          is_active: franchise.is_active,
          is_deleted: franchise.is_deleted,
        });
      }
    }
  }, [id, isEditMode]);

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock save operation
    console.log("Saving franchise:", formData);

    // Navigate back to franchise list
    navigate(`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`);
  };

  return (
    <div className="p-6 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
            <Button variant="outline" className="mb-4 border-[#4A3B2A] text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-[#4A3B2A]">
            {isEditMode ? "Edit Franchise" : "Create New Franchise"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Update franchise information"
              : "Add a new franchise location"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[#4A3B2A] font-semibold">
                  Franchise Code *
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="CF-D1-001"
                  required
                  className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#4A3B2A] font-semibold">
                  Franchise Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Coffee House District 1"
                  required
                  className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#4A3B2A] font-semibold">
                Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="123 Nguyen Hue Street, District 1, Ho Chi Minh City"
                required
                className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="opened_at" className="text-[#4A3B2A] font-semibold">
                  Opened Date
                </Label>
                <Input
                  id="opened_at"
                  type="date"
                  value={formData.opened_at ? formData.opened_at.split('T')[0] : ''}
                  onChange={(e) => handleChange("opened_at", e.target.value ? `${e.target.value}T00:00:00Z` : '')}
                  className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#4A3B2A] font-semibold">
                  Status *
                </Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) => handleChange("is_active", value === "active")}
                >
                  <SelectTrigger className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#4A3B2A] hover:bg-[#3A2B1A] text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Update Franchise" : "Create Franchise"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FranchiseForm;
