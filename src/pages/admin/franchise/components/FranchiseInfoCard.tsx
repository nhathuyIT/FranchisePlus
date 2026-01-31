import { Store, MapPin, Calendar, Building2 } from "lucide-react";
import type { Franchise } from "@/types/franchise";

interface FranchiseInfoCardProps {
  franchise: Franchise;
}

export const FranchiseInfoCard = ({ franchise }: FranchiseInfoCardProps) => {
  return (
    <div className="bg-gradient-to-br from-white to-[#FAF8F5] rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
      <h2 className="text-xl font-semibold text-[#3E2723] mb-6">
        Franchise Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
          <div className="bg-[#6D4C41] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#5D4037]/70">Franchise Code</p>
            <p className="text-base font-medium text-[#3E2723] font-mono">{franchise.code}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
          <div className="bg-[#6D4C41] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#5D4037]/70">Franchise Name</p>
            <p className="text-base font-medium text-[#3E2723]">{franchise.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
          <div className="bg-[#6D4C41] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#5D4037]/70">Address</p>
            <p className="text-base font-medium text-[#3E2723]">{franchise.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
          <div className="bg-[#6D4C41] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#5D4037]/70">Opened Date</p>
            <p className="text-base font-medium text-[#3E2723]">
              {franchise.opened_at
                ? new Date(franchise.opened_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {franchise.closed_at && (
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
            <div className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#5D4037]/70">Closed Date</p>
              <p className="text-base font-medium text-[#EF4444]">
                {new Date(franchise.closed_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
          <div className="bg-[#6D4C41] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#5D4037]/70">Created At</p>
            <p className="text-base font-medium text-[#3E2723]">
              {new Date(franchise.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200">
          <div className="bg-[#6D4C41] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#5D4037]/70">Last Updated</p>
            <p className="text-base font-medium text-[#3E2723]">
              {new Date(franchise.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
