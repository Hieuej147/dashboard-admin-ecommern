import {
  Package,
  ShoppingCart,
  Users,
  Layers,
  HelpCircle,
} from "lucide-react";
import { MicroserviceCard } from "./microservice-card";

export function SystemContextPanel() {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-sm font-semibold text-slate-800">
          Hệ sinh thái Dịch vụ & Kết nối AI
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Trợ lý Copilot được cấp quyền truy xuất các Microservices thông qua API Gateway với bảo mật phân quyền.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <MicroserviceCard
          title="Catalog Service"
          badge="gRPC Live"
          description="Quản lý sản phẩm, biến thể, mức tồn kho, danh mục, phân loại thương hiệu và mức giá khuyến mãi."
          icon={Package}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <MicroserviceCard
          title="Order Service"
          badge="gRPC Live"
          description="Quản lý đơn hàng, trạng thái (Chờ thanh toán, Đã thanh toán, Đang giao, Hoàn tất, Đã hủy) và tính toán chiết khấu."
          icon={ShoppingCart}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <MicroserviceCard
          title="Customer Service"
          badge="gRPC Live"
          description="Hồ sơ khách hàng, phân hạng thành viên, lịch sử đặt hàng, địa chỉ giao nhận và thông tin liên hệ."
          icon={Users}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MicroserviceCard
          title="A2UI Protocol Engine"
          badge="Active Portal"
          description="Giao thức chuyển đổi dữ liệu phân tích từ Agent thành giao diện trực quan (Recharts, Grid tables, Action buttons) gắn thẳng vào Canvas."
          icon={Layers}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-medium text-slate-800">Ghi chú vận hành an toàn</p>
            <p>
              Mọi lệnh phân tích, vẽ biểu đồ và tóm tắt đều chạy ở chế độ chỉ đọc (Read-only).
              Khi thực hiện các tác vụ thay đổi giá hàng loạt hoặc cập nhật tồn kho, Copilot sẽ yêu
              cầu bạn xác nhận trước khi gửi lệnh thực thi xuống API Gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
