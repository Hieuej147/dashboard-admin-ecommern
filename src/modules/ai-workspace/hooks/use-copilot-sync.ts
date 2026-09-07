import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAgentContext,
  useFrontendTool,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useAppSelector } from "@/lib/store/store";
import { useBackendToolRenderers } from "./use-backend-tool-renderers";

export function useCopilotSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeDashboardId = useAppSelector(
    (state) => state.dashboardUi.activeDashboardId
  );

  // 0. Register real-time tool progress card renderers for backend tools
  useBackendToolRenderers();

  // 1. Context Awareness: Share current admin screen & state with the agent
  const contextValue = useMemo(() => {
    const path = location.pathname;
    let pageName = "Dashboard Tổng quan";
    if (path.startsWith("/products")) pageName = "Quản lý Sản phẩm";
    else if (path.startsWith("/orders")) pageName = "Quản lý Đơn hàng";
    else if (path.startsWith("/customers")) pageName = "Quản lý Khách hàng";
    else if (path.startsWith("/ai-workspace")) pageName = "AI Workspace Studio";
    else if (path.startsWith("/analytics")) pageName = "Báo cáo Phân tích";

    return {
      currentPath: path,
      pageName,
      activeDashboardId: activeDashboardId || null,
      timestamp: new Date().toISOString(),
    };
  }, [location.pathname, activeDashboardId]);

  useAgentContext({
    description: "Current Admin Navigation & Page Context",
    value: contextValue,
  });

  // 2. Client-Side Tools: Allow agent to navigate and control the UI
  useFrontendTool(
    {
      name: "navigateToPage",
      description:
        "Điều hướng admin sang một trang cụ thể trong hệ thống (/products, /orders, /customers, /ai-workspace, /)",
      parameters: z.object({
        path: z
          .string()
          .describe(
            "Đường dẫn URL đích, ví dụ: '/products', '/orders', '/customers', '/ai-workspace'"
          ),
      }),
      handler: async ({ path }) => {
        navigate(path);
        return `Đã điều hướng người dùng sang trang: ${path}`;
      },
    },
    [navigate]
  );

  useFrontendTool(
    {
      name: "openInStudio",
      description:
        "Mở trang AI Workspace Studio toàn màn hình để hiển thị bảng số liệu hoặc biểu đồ chi tiết trên Canvas",
      parameters: z.object({}),
      handler: async () => {
        navigate("/ai-workspace");
        return "Đã mở AI Workspace Studio thành công.";
      },
    },
    [navigate]
  );

  // 3. Dynamic Suggestions Hook: Contextual suggestion chips based on active page
  const suggestionsConfig = useMemo(() => {
    const path = location.pathname;

    if (path.startsWith("/products")) {
      return {
        suggestions: [
          {
            title: "Cảnh báo tồn kho",
            message: "Kiểm tra danh sách các sản phẩm có số lượng tồn kho dưới mức an toàn (<= 20 chiếc).",
          },
          {
            title: "Sản phẩm bán chạy",
            message: "Liệt kê các sản phẩm chủ lực và doanh số ước tính hiện tại.",
          },
          {
            title: "Lọc áo khoác / Outerwear",
            message: "Hiển thị danh sách sản phẩm thuộc danh mục outerwear dưới dạng catalog.",
          },
        ],
        available: "always" as const,
      };
    }

    if (path.startsWith("/orders")) {
      return {
        suggestions: [
          {
            title: "Đơn chờ thanh toán",
            message: "Tìm kiếm danh sách các đơn hàng đang ở trạng thái PENDING_PAYMENT cần nhắc nhở khách.",
          },
          {
            title: "Đơn thất bại hoặc hủy",
            message: "Có bao nhiêu đơn hàng bị thanh toán thất bại hoặc đã bị hủy gần đây?",
          },
          {
            title: "Doanh thu & Số lượng đơn",
            message: "Tổng hợp tổng doanh thu thực tế và tổng số đơn hàng trong hệ thống.",
          },
        ],
        available: "always" as const,
      };
    }

    if (path.startsWith("/customers")) {
      return {
        suggestions: [
          {
            title: "Khách hàng đăng ký mới",
            message: "Liệt kê danh sách các tài khoản khách hàng mới đăng ký gần đây.",
          },
          {
            title: "Phân loại người dùng",
            message: "Thống kê người dùng theo vai trò admin và customer trong hệ thống.",
          },
        ],
        available: "always" as const,
      };
    }

    // Default / AI Workspace suggestions
    return {
      suggestions: [
        {
          title: "Báo cáo doanh số",
          message: "Hãy phân tích tổng doanh thu, số đơn hàng và giá trị trung bình đơn hàng (AOV).",
        },
        {
          title: "Cảnh báo tồn kho",
          message: "Kiểm tra các sản phẩm sắp hết hàng và cần lên kế hoạch nhập thêm.",
        },
        {
          title: "Sức khỏe thanh toán",
          message: "Đánh giá tỷ lệ thanh toán thành công và các giao dịch đang gặp sự cố.",
        },
        {
          title: "Tạo bảng điều khiển A2UI",
          message: "Hãy tạo một Dashboard Canvas tổng hợp KPI, biểu đồ doanh thu và danh sách đơn hàng mới.",
        },
      ],
      available: "always" as const,
    };
  }, [location.pathname]);

  useConfigureSuggestions(suggestionsConfig, [location.pathname]);

  return {
    contextValue,
  };
}
