import { TrendingUp, AlertTriangle, Wand2, BarChart3 } from "lucide-react";
import type { QuickPromptItem } from "../types/ai-workspace.types";

export const QUICK_PROMPT_CHIPS: QuickPromptItem[] = [
  {
    label: "Báo cáo doanh thu tuần",
    prompt: "Tạo báo cáo tổng hợp doanh thu và số lượng đơn hàng tuần qua dưới dạng biểu đồ và bảng số liệu.",
    icon: TrendingUp,
  },
  {
    label: "SKU sắp hết hàng",
    prompt: "Kiểm tra các sản phẩm có số lượng tồn kho thấp dưới 10 đơn vị và lập danh sách đề xuất nhập hàng.",
    icon: AlertTriangle,
  },
  {
    label: "Viết mô tả SEO sản phẩm",
    prompt: "Tạo bản thảo mô tả sản phẩm chuẩn SEO cho một sản phẩm thời trang cao cấp gồm tiêu đề, bullet points đặc tính nổi bật và thẻ meta.",
    icon: Wand2,
  },
  {
    label: "Phân tích tỉ lệ hủy đơn",
    prompt: "Phân tích nguyên nhân các đơn hàng bị huỷ hoặc thanh toán thất bại gần đây và đề xuất giải pháp khắc phục.",
    icon: BarChart3,
  },
];
