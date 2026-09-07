import type { TemplateCategoryItem } from "../types/ai-workspace.types";

export const TEMPLATE_CATEGORIES: TemplateCategoryItem[] = [
  {
    category: "Vận hành Bán hàng",
    items: [
      {
        title: "Tạo chiến dịch khuyến mãi Flash Sale cuối tuần",
        prompt: "Lập kế hoạch chiến dịch khuyến mãi Flash Sale 48h cuối tuần: gợi ý mức giảm giá theo danh mục, điều kiện áp dụng và thông điệp truyền thông.",
      },
      {
        title: "Phân tích giỏ hàng chưa thanh toán (Abandoned Cart)",
        prompt: "Phân tích các sản phẩm thường bị bỏ quên trong giỏ hàng và gợi ý email remarketing kích cầu.",
      },
      {
        title: "Dự báo doanh thu tháng tới theo xu hướng hiện tại",
        prompt: "Dựa trên dữ liệu doanh thu tháng vừa qua, hãy dự báo xu hướng doanh số tháng tới và chỉ ra các ngành hàng tiềm năng.",
      },
    ],
  },
  {
    category: "Tối ưu Danh mục & Kho",
    items: [
      {
        title: "Gợi ý gói combo sản phẩm bán kèm (Cross-sell)",
        prompt: "Đề xuất 3 combo sản phẩm bán kèm nhau hiệu quả dựa trên danh mục hiện có để tăng giá trị trung bình trên mỗi đơn hàng.",
      },
      {
        title: "Đánh giá hiệu suất sản phẩm tồn kho lâu ngày (Dead Stock)",
        prompt: "Lọc các mặt hàng có tốc độ bán chậm trong 60 ngày qua và đề xuất phương án xả kho hoặc gộp quà tặng.",
      },
    ],
  },
  {
    category: "Hỗ trợ & Chăm sóc Khách hàng",
    items: [
      {
        title: "Kịch bản xử lý phản hồi khiếu nại giao trễ",
        prompt: "Viết kịch bản mẫu cho nhân viên CSKH xử lý trường hợp đơn hàng bị giao trễ do sự cố nhà vận chuyển, bao gồm lời xin lỗi và mã voucher bồi thường.",
      },
      {
        title: "Chính sách đổi trả và bảo hành minh bạch",
        prompt: "Dự thảo chính sách đổi trả hàng trong 7 ngày và quy trình bảo hành rõ ràng, thân thiện với người tiêu dùng.",
      },
    ],
  },
];
