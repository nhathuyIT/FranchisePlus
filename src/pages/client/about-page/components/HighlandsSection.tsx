import { useState } from "react";

import { ABOUT_THEME } from "@/const/about.const";

import { X,

  //  ChevronRight

  } from "lucide-react";



interface SectionProps {

  title: string;

  subTitle: string;

  summary: string;

  detail: string;

  image: string;

  isReversed?: boolean;

  bgColor?: string;

}



export const HighlandsSection = ({ title, subTitle, summary, detail, image, isReversed, bgColor }: SectionProps) => {

  const [showDetail, setShowDetail] = useState(false);

  const backgroundColor = bgColor || ABOUT_THEME.bgKem;



  return (

    <div className={`relative w-full flex flex-col md:flex-row min-h-[550px] overflow-hidden ${isReversed ? "md:flex-row-reverse" : ""}`}>

      {/* Cột Nội dung */}

      <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-20 z-10" style={{ backgroundColor }}>

        <div className="max-w-md animate-in fade-in slide-in-from-bottom-5 duration-700">

          <h2 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter" style={{ color: bgColor === ABOUT_THEME.primary ? "#FFF" : ABOUT_THEME.textTitle }}>{title}</h2>

          <h3 className="text-sm font-bold mb-6 uppercase tracking-[0.2em]" style={{ color: bgColor === ABOUT_THEME.primary ? "#FAF8F5" : ABOUT_THEME.primary }}>{subTitle}</h3>

          <p className="text-lg leading-relaxed mb-10 opacity-90" style={{ color: bgColor === ABOUT_THEME.primary ? "#FFF" : ABOUT_THEME.textBody }}>{summary}</p>

          <button

            onClick={() => setShowDetail(true)}

            className="px-10 py-3 border-2 font-bold uppercase text-sm tracking-widest transition-all cursor-pointer"

            style={{ borderColor: bgColor === ABOUT_THEME.primary ? "#FFF" : ABOUT_THEME.primary, color: bgColor === ABOUT_THEME.primary ? "#FFF" : ABOUT_THEME.primary }}

          >

            Khám phá thêm

          </button>

        </div>

      </div>



      {/* Cột Hình ảnh với Hiệu ứng Mask mờ dần */}

      <div className="w-full md:w-1/2 relative min-h-[400px]">

        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute inset-0"

        style={{ background: isReversed

          ? `linear-gradient(90deg, transparent 0%, transparent 45%, ${backgroundColor} 95%, ${backgroundColor} 1%)`

          : `linear-gradient(90deg, ${backgroundColor} 0%, ${backgroundColor} 1%, transparent 55%, transparent 95%)` }}

        />

      </div>



      {/* Modal Detail */}

      {showDetail && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setShowDetail(false)}>

          <div className="bg-white p-12 max-w-2xl w-full relative animate-in zoom-in-95 duration-300 shadow-2xl" onClick={e => e.stopPropagation()}>

            <button onClick={() => setShowDetail(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all"><X size={24} /></button>

            <h4 className="text-2xl font-black mb-6 uppercase tracking-tight" style={{ color: ABOUT_THEME.textTitle }}>{title}</h4>

            <div className="text-lg leading-relaxed border-l-4 pl-6 italic" style={{ borderColor: ABOUT_THEME.primary }}>{detail}</div>

          </div>

        </div>

      )}

    </div>

  );

};