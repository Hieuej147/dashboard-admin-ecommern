import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AiWorkspaceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[AiWorkspaceErrorBoundary caught error]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-rose-200 bg-rose-50/40 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-base font-semibold text-slate-800">
              Đã có lỗi xảy ra trong AI Workspace
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {this.state.error?.message || "Không thể tải giao diện tương tác AI."}
            </p>
          </div>
          <Button
            size="sm"
            onClick={this.handleReset}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Thử tải lại giao diện
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
