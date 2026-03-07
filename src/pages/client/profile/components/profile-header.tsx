import { Link } from "react-router-dom";

const RECENT_BREWS = [
  {
    name: "Ethiopian Yirgacheffe",
    time: "Ordered 2 days ago",
    icon: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
    color: "bg-orange-50 border-orange-200",
  },
  {
    name: "French Press Kit",
    time: "Ordered 1 week ago",
    icon: "https://cdn-icons-png.flaticon.com/512/2935/2935308.png",
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    name: "Almond Croissants (6)",
    time: "Ordered 2 weeks ago",
    icon: "https://cdn-icons-png.flaticon.com/512/3081/3081967.png",
    color: "bg-amber-50 border-amber-200",
  },
];

export const ProfileHeader = () => {
  return (
    <section className="container mx-auto px-4 max-w-5xl mb-16">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-coffee text-2xl text-[#3E2723]">Recent Brews</h2>
        <Link
          to="/client/menu"
          className="text-sm font-medium text-[#C97B3D] hover:text-[#B5692F] transition-colors hover:underline underline-offset-4"
        >
          View All History
        </Link>
      </div>

      {/* Recent Brew Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {RECENT_BREWS.map((brew) => (
          <div
            key={brew.name}
            className={`flex items-center gap-4 p-5 bg-white rounded-xl border ${brew.color} shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group`}
          >
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8E0D8] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img
                src={brew.icon}
                alt={brew.name}
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#3E2723] truncate">
                {brew.name}
              </p>
              <p className="text-xs text-[#C97B3D] mt-0.5">{brew.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
