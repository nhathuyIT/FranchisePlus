import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Save, Store, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

  const [formData, setFormData] = useState<Omit<Franchise, "created_at" | "updated_at">>({
    id: 0,
    code: "",
    name: "",
    logo_url: null,
    address: "",
    opened_at: null,
    closed_at: null,
    is_active: true,
    is_deleted: false,
  });

  useEffect(() => {
    if (isEditMode && id) {
      const franchise = FRANCHISES_MOCK.find((f) => f.id === Number(id));
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

  const handleChange = (field: keyof typeof formData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving franchise:", formData);
    navigate(`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
            <Button variant="outline" className="mb-4 border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-full transition-all duration-300 cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-[#3E2723]">
            {isEditMode ? "Edit Franchise" : "Create New Franchise"}
          </h1>
          <p className="text-[#5D4037] mt-1">
            {isEditMode
              ? "Update franchise information"
              : "Add a new franchise location"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload Section */}
            <div className="space-y-4">
              <Label className="text-[#3E2723] font-semibold">Franchise Logo</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 rounded-xl border-4 border-[#E8DFD6]">
                  <AvatarImage
                    src={formData.logo_url || undefined}
                    alt={formData.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-[#6D4C41] to-[#5D4037] text-white">
                    <Store className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="logo_url"
                      value={formData.logo_url || ""}
                      onChange={(e) => handleChange("logo_url", e.target.value || null)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] rounded-lg transition-all duration-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[#3E2723] font-semibold">
                  Franchise Code *
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="CF-D1-001"
                  required
                  className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] rounded-lg transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#3E2723] font-semibold">
                  Franchise Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Coffee House District 1"
                  required
                  className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] rounded-lg transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#3E2723] font-semibold">
                Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="123 Nguyen Hue Street, District 1, Ho Chi Minh City"
                required
                className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] rounded-lg transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="opened_at" className="text-[#3E2723] font-semibold">
                  Opened Date
                </Label>
                <Input
                  id="opened_at"
                  type="date"
                  value={formData.opened_at ? formData.opened_at.split('T')[0] : ''}
                  onChange={(e) => handleChange("opened_at", e.target.value ? `${e.target.value}T00:00:00Z` : null)}
                  className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] rounded-lg transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#3E2723] font-semibold">
                  Status *
                </Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) => handleChange("is_active", value === "active")}
                >
                  <SelectTrigger className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] rounded-lg transition-all duration-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-[#E8DFD6]">
              <Link to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-gray-300 text-[#5D4037] hover:bg-gray-100 rounded-full transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
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
