import { Store, MapPin, Calendar, Building2 } from "lucide-react";
import type { Franchise } from "@/types/franchise";

interface FranchiseInfoCardProps {
  franchise: Franchise;
}

export const FranchiseInfoCard = ({ franchise }: FranchiseInfoCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-[#4A3B2A] mb-4">
        Franchise Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 text-[#4A3B2A] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Franchise Code</p>
            <p className="text-base font-medium text-[#4A3B2A] font-mono">{franchise.code}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Store className="h-5 w-5 text-[#4A3B2A] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Franchise Name</p>
            <p className="text-base font-medium text-[#4A3B2A]">{franchise.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-[#4A3B2A] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-base font-medium text-[#4A3B2A]">{franchise.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-[#4A3B2A] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Opened Date</p>
            <p className="text-base font-medium text-[#4A3B2A]">
              {franchise.opened_at
                ? new Date(franchise.opened_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {franchise.closed_at && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#EF4444] mt-1" />
            <div>
              <p className="text-sm text-gray-500">Closed Date</p>
              <p className="text-base font-medium text-[#EF4444]">
                {new Date(franchise.closed_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-[#4A3B2A] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-base font-medium text-[#4A3B2A]">
              {new Date(franchise.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-[#4A3B2A] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-base font-medium text-[#4A3B2A]">
              {new Date(franchise.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
