import React from "react";
import { Users, ShieldCheck, Coffee, 
  // Zap, Award, Cpu, Star
 } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  summary: string;
  detail: string;
  icon: React.ElementType;
}

export const ABOUT_THEME = {
  primary: "#6D4C41",
  secondary: "#f7c6a3",
  bgKem: "#FAF8F5",
  textTitle: "#3E2723",
  textBody: "#5D4037",
};

export const ABOUT_CONTENT = {
  hero: {
    title: "NGUỒN GỐC",
    subTitle: "CÂU CHUYỆN NÀY LÀ CỦA CHÚNG MÌNH",
    summary: "Capital Corp được thành lập vào năm 1999, bắt nguồn từ tình yêu dành cho đất Việt cùng với cà phê và cộng đồng nơi đây.",
    detail: "Từ những ngày đầu tiên, mục tiêu của chúng mình là phục vụ và góp phần phát triển cộng đồng bằng cách siết chặt sự kết nối giữa người với người thông qua hệ thống CFMS.",
    image: "https://plus.unsplash.com/premium_photo-1675237625862-d982e7f44696?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "#6D4C41"
  },
  tech: {
    title: "DỊCH VỤ",
    subTitle: "CÔNG NGHỆ LÀ CỦA CHÚNG MÌNH",
    summary: "Hệ sinh thái Microservices hiện đại đảm bảo vận hành ổn định cho hơn 100 chi nhánh toàn cầu với uptime 99.9%.",
    detail: "Kiến trúc bao gồm các dịch vụ độc lập: IAM (Bảo mật), Inventory (Kho), Product và Payment. Bảo mật dữ liệu tiêu chuẩn AES-256.",
    image: "https://images.unsplash.com/photo-1763343030530-d76455f7526f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "#f7c6a3"
  },
  aiBooking: {
    title: "ĐỘT PHÁ AI",
    subTitle: "TỰ ĐỘNG HÓA BOOKING",
    summary: "Công nghệ AI Booking hỗ trợ đặt hàng bằng giọng nói ngay cả khi hệ thống offline, tối ưu hóa quy trình bán hàng.",
    detail: "Giải pháp POS hiện đại với khả năng xử lý 50 đơn hàng đồng thời mỗi chi nhánh. Tích hợp trí tuệ nhân tạo để nâng cao trải nghiệm khách hàng và hiệu suất vận hành.",
    image: "https://media.istockphoto.com/id/2184518485/vi/anh/b%E1%BA%A1n-b%C3%A8-s%E1%BB%AD-d%E1%BB%A5ng-%E1%BB%A9ng-d%E1%BB%A5ng-giao-%C4%91%E1%BB%93-%C4%83n-di-%C4%91%E1%BB%99ng-%C4%91%E1%BB%83-duy%E1%BB%87t-th%E1%BB%B1c-%C4%91%C6%A1n-v%C3%A0-%C4%91%E1%BA%B7t-h%C3%A0ng-tr%E1%BB%B1c-tuy%E1%BA%BFn.jpg?s=612x612&w=0&k=20&c=svRZNgvgC9XfA9x-UK9qUsCvldEs8pygGDo7U6ACKmo=",
    bgColor: "#ffeadd"
  },
};

export const teamMembers: TeamMember[] = [
  {
    name: "Administrator",
    role: "Quản trị viên Hệ thống",
    summary: "Kiểm soát toàn diện qua dịch vụ IAM và cấu hình bảo mật.",
    detail: "Quản lý tài khoản, phân quyền, giám sát thanh toán và cấu hình chiến dịch khuyến mãi theo SRS v2.0.",
    icon: ShieldCheck,
  },
  {
    name: "Manager",
    role: "Quản lý Vận hành",
    summary: "Giám sát hiệu quả kinh doanh và nhân sự tại chi nhánh.",
    detail: "Tương tác với Shift Management và Inventory Service để đảm bảo vận hành ổn định.",
    icon: Users,
  },
  {
    name: "Staff",
    role: "Nhân viên Cửa hàng",
    summary: "Thực thi vận hành hàng ngày và tối ưu trải nghiệm khách hàng.",
    detail: "Sử dụng POS để nhập đơn, cập nhật trạng thái đơn hàng và phối hợp giao nhận.",
    icon: Coffee,
  },
];

export const awards = [
  { year: "2024", name: "Hệ thống quản trị xuất sắc" },
  { year: "2023", name: "Đột phá AI Retail" },
];

export const certifications = [
  "ISO 27001 - Security",
  "Rainforest Alliance",
  "Global Franchise Partner",
];

export const testimonials = [
  {
    quote: "CFMS đã thay đổi hoàn toàn cách chúng tôi vận hành chuỗi 100 cửa hàng.",
    name: "Nguyễn Văn A",
    location: "CEO Capital Corp",
    rating: 5,
  },
];