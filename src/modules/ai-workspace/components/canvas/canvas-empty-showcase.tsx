import {
  Sparkles,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { CapabilityCard } from "./capability-card";
import { CAPABILITY_CARDS } from "../../constants/capability-catalog";

interface CanvasEmptyShowcaseProps {
  onSelectPrompt: (prompt: string) => void;
  isRunning?: boolean;
}

export function CanvasEmptyShowcase({
  onSelectPrompt,
  isRunning,
}: CanvasEmptyShowcaseProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Welcome Studio Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-purple-500/10 p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Không gian Trực quan hóa & Tác nghiệp Trực tiếp
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Khi bạn yêu cầu AI tạo báo cáo doanh số, cảnh báo tồn kho hoặc phân tích chỉ số,
              kết quả sẽ được kết xuất động (A2UI) với biểu đồ tương tác, bảng dữ liệu và thẻ
              hành động ngay trên khung Canvas này.
            </p>
          </div>
        </div>

        {/* Quick Capabilities Grid */}
        <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
          {CAPABILITY_CARDS.map((card) => (
            <CapabilityCard
              key={card.id}
              card={card}
              onSelect={onSelectPrompt}
              disabled={isRunning}
            />
          ))}
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BarChart3 className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-slate-800">Biểu đồ Tương tác</h4>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Tự động vẽ Recharts đường, cột, tròn theo thời gian thực từ dữ liệu API.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-slate-800">An toàn & Kiểm soát</h4>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Truy vấn đọc an toàn, cần xác nhận của quản trị viên đối với thao tác ghi dữ liệu lớn.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-slate-800">Cơ chế Portal</h4>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Các thành phần A2UI tự động gắn vào Canvas mà không gây gián đoạn khung trò chuyện.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
