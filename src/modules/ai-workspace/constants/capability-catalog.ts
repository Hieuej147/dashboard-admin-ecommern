import { TrendingUp, Package, FileText, Users } from "lucide-react";
import type { CapabilityCardItem } from "../types/ai-workspace.types";

export const CAPABILITY_CARDS: CapabilityCardItem[] = [
  {
    id: "revenue-analysis",
    title: "Phân tích Doanh số & Đơn hàng",
    badge: "Biểu đồ + Dữ liệu động",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Tổng hợp biểu đồ doanh thu theo ngày, tính AOV và tỉ lệ hoàn thành đơn hàng.",
    prompt: "Tạo báo cáo tổng hợp doanh thu và số lượng đơn hàng gần đây dưới dạng biểu đồ đường và bảng dữ liệu.",
    icon: TrendingUp,
    accent: "from-blue-500/10 to-indigo-500/5 text-blue-600 border-blue-100",
  },
  {
    id: "inventory-alert",
    title: "Cảnh báo Tồn kho & Nhập hàng",
    badge: "Quản lý Kho vận",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Quét kho hàng, phát hiện các SKU dưới ngưỡng tồn an toàn và dự báo số lượng cần nhập.",
    prompt: "Kiểm tra các sản phẩm có số lượng tồn kho thấp dưới 10 và lập danh sách đề xuất nhập hàng.",
    icon: Package,
    accent: "from-amber-500/10 to-orange-500/5 text-amber-600 border-amber-100",
  },
  {
    id: "seo-copywriter",
    title: "Soạn thảo & Tối ưu SEO Sản phẩm",
    badge: "Nội dung & Marketing",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Tạo tiêu đề hấp dẫn, mô tả chuẩn SEO, bullet points tính năng và thẻ meta bán lẻ.",
    prompt: "Tạo mô tả sản phẩm chuẩn SEO cho một sản phẩm thời trang cao cấp bao gồm tiêu đề, mô tả ngắn, đặc điểm nổi bật và tags.",
    icon: FileText,
    accent: "from-purple-500/10 to-violet-500/5 text-purple-600 border-purple-100",
  },
  {
    id: "customer-diagnostic",
    title: "Chuẩn đoán Khách hàng & Hoàn hủy",
    badge: "Chăm sóc Khách hàng",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    description: "Phân tích nguyên nhân huỷ đơn, thanh toán thất bại và nhận diện khách hàng trung thành.",
    prompt: "Phân tích nguyên nhân các đơn hàng bị huỷ hoặc thất bại gần đây và đưa ra giải pháp cải thiện trải nghiệm mua sắm.",
    icon: Users,
    accent: "from-rose-500/10 to-pink-500/5 text-rose-600 border-rose-100",
  },
];
