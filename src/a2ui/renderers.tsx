import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../lib/store/store";
import { setActiveDashboard } from "../lib/store/slices/dashboard-ui.slice";
import { 
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar
} from "recharts";
import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- Dashboard Canvas (PORTAL TRICK) ---
export const DashboardCanvasRenderer = ({ props, children }: { props: any, children: any }) => {
  const activeDashboardId = useAppSelector((state) => state.dashboardUi.activeDashboardId);
  const dispatch = useAppDispatch();
  const id = React.useId();
  const location = useLocation(); // Force re-render when route changes
  
  // Use state for container to ensure we trigger a re-render if it mounts later
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    dispatch(setActiveDashboard(id));
  }, [dispatch, id]);

  // Update container when location changes (e.g. user returns to Overview tab)
  useEffect(() => {
    const el = document.getElementById("dashboard-root");
    setContainer(el);
  }, [location.pathname, activeDashboardId]);

  const isActive = activeDashboardId === id;

  const chatPlaceholder = (
    <div className={`flex items-center gap-2 p-3 border rounded-lg shadow-sm ${isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
      <CheckCircle className="w-5 h-5" />
      <div>
        <p className="font-semibold text-sm">Dashboard: {props.title}</p>
        <p className="text-xs opacity-90">{isActive ? "Viewing on main page" : "Previous dashboard (hidden)"}</p>
      </div>
    </div>
  );

  if (!isActive || !container) {
    return chatPlaceholder;
  }

  const dashboardContent = (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{props.title}</h1>
        <button 
          onClick={() => dispatch(setActiveDashboard(null))}
          className="px-4 py-2 bg-white text-sm font-medium text-slate-600 border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50"
        >
          Clear Dashboard
        </button>
      </div>
      {Array.isArray(props.children) ? props.children.map((id: string, i: number) => (
        <React.Fragment key={`${id}-${i}`}>{children(id)}</React.Fragment>
      )) : props.child && children(props.child)}
    </div>
  );

  return (
    <>
      {chatPlaceholder}
      {createPortal(dashboardContent, container)}
    </>
  );
};

// --- Layouts ---
export const RowRenderer = ({ props, children }: { props: any, children: any }) => {
  const items = Array.isArray(props.children) ? props.children : [];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: `${props.gap ?? 16}px`,
        alignItems: props.align ?? "stretch",
        justifyContent: props.justify ?? "flex-start",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      {items.map((id: string, i: number) => (
        <div key={`${id}-${i}`} style={{ flex: "1 1 0", minWidth: "250px" }}>
          {children(id)}
        </div>
      ))}
    </div>
  );
};

export const ColumnRenderer = ({ props, children }: { props: any, children: any }) => {
  const items = Array.isArray(props.children) ? props.children : [];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${props.gap ?? 16}px`,
        alignItems: props.align ?? "stretch",
        width: "100%",
      }}
    >
      {items.map((id: string, i: number) => (
        <React.Fragment key={`${id}-${i}`}>{children(id)}</React.Fragment>
      ))}
    </div>
  );
};

// --- Containers ---
export const CardRenderer = ({ props, children }: { props: any, children: any }) => {
  const items = Array.isArray(props.children) ? props.children : (props.child ? [props.child] : []);
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{props.title}</CardTitle>
        {props.subtitle && <CardDescription>{props.subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 w-full flex flex-col gap-2">
        {items.map((id: string, i: number) => (
          <React.Fragment key={`${id}-${i}`}>{children(id)}</React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

// --- Small Components ---
export const MetricRenderer = ({ props }: { props: any }) => {
  const trendColors: Record<string, string> = { up: "text-emerald-600", down: "text-rose-600", neutral: "text-slate-500" };
  const trendIcons: Record<string, string> = { up: "↑", down: "↓", neutral: "→" };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-medium uppercase tracking-wider">{props.label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-800">{props.value}</span>
          {props.trend && (
            <span className={`text-sm font-medium ${trendColors[props.trend] || "text-slate-500"}`}>
              {trendIcons[props.trend]} {props.trendValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const BadgeRenderer = ({ props }: { props: any }) => {
  return (
    <Badge variant={props.variant === 'error' ? 'destructive' : props.variant === 'success' ? 'default' : 'secondary'}>
      {props.text}
    </Badge>
  );
};

export const InfoRowRenderer = ({ props }: { props: any }) => (
  <div className="flex items-baseline justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500">{props.label}</span>
    <span className="text-sm font-medium text-slate-900 text-right">{props.value}</span>
  </div>
);

export const ButtonRenderer = ({ props, dispatch }: { props: any; dispatch?: any }) => {
  return (
    <Button 
      className="w-full mt-2" 
      onClick={() => {
        if (dispatch && props.action) {
          dispatch(props.action);
        }
      }}
    >
      {props.text}
    </Button>
  );
};

// --- Charts ---
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const PieChartRenderer = ({ props }: { props: any }) => {
  const data = (Array.isArray(props.data) ? props.data : []).map((d: any) => {
    const keys = Object.keys(d || {});
    const labelKey = keys.find(k => ['label', 'name', 'category', 'month'].includes(k.toLowerCase())) || keys[0];
    const valueKey = keys.find(k => ['value', 'sales', 'revenue'].includes(k.toLowerCase())) || keys[1] || keys[0];
    return { label: String(d?.[labelKey] || 'N/A'), value: parseFloat(d?.[valueKey]) || 0 };
  });

  return (
    <div className="w-full h-[300px] pt-4 flex flex-col">
      {props.title && <h4 className="text-sm font-semibold mb-2">{props.title}</h4>}
      {data.length === 0 ? (
        <div className="text-sm text-slate-400">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" debounce={150}>
          <RechartsPieChart>
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2}>
              {data.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const BarChartRenderer = ({ props }: { props: any }) => {
  const data = (Array.isArray(props.data) ? props.data : []).map((d: any) => {
    const keys = Object.keys(d || {});
    const labelKey = keys.find(k => ['label', 'name', 'category', 'month'].includes(k.toLowerCase())) || keys[0];
    const valueKey = keys.find(k => ['value', 'sales', 'revenue'].includes(k.toLowerCase())) || keys[1] || keys[0];
    return { label: String(d?.[labelKey] || 'N/A'), value: parseFloat(d?.[valueKey]) || 0 };
  });
  
  return (
    <div className="w-full h-[300px] pt-4 flex flex-col">
      {props.title && <h4 className="text-sm font-semibold mb-2">{props.title}</h4>}
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" debounce={150}>
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const LineChartRenderer = ({ props }: { props: any }) => {
  const data = Array.isArray(props.data) ? props.data : [];
  const lines = Array.isArray(props.lines) ? props.lines : [];

  return (
    <div className="w-full h-[300px] pt-4 flex flex-col">
      {props.title && <h4 className="text-sm font-semibold mb-2">{props.title}</h4>}
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" debounce={150}>
          <RechartsLineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={props.xAxisKey} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {lines.map((line: any, i: number) => (
              <Line key={i} type="monotone" dataKey={line.dataKey} name={line.name || line.dataKey} stroke={line.color || CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const DataTableRenderer = ({ props }: { props: any }) => {
  const cols = Array.isArray(props.columns) ? props.columns : [];
  const data = Array.isArray(props.data) ? props.data : [];
  
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((col: any) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any, i: number) => (
            <TableRow key={i}>
              {cols.map((col: any) => (
                <TableCell key={col.key}>{String(row[col.key] ?? "")}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const CatalogLayoutRenderer = ({ props }: { props: any }) => {
  const items = Array.isArray(props.items) ? props.items : [];
  const isList = props.layoutType === "list";

  return (
    <div className="w-full flex flex-col gap-4">
      {props.title && <h3 className="text-xl font-bold text-slate-900">{props.title}</h3>}
      <div 
        className={`grid gap-4`} 
        style={{ 
          gridTemplateColumns: isList ? '1fr' : 'repeat(auto-fill, minmax(180px, 1fr))' 
        }}
      >
        {items.map((item: any) => (
          <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {item.imageUrl && (
              <div className="aspect-square bg-slate-100 relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover mix-blend-multiply p-4" />
              </div>
            )}
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-900 line-clamp-1" title={item.title}>{item.title}</h4>
                {item.badgeText && (
                  <Badge variant={item.badgeVariant === 'error' ? 'destructive' : item.badgeVariant === 'success' ? 'default' : 'secondary'} className="ml-2 whitespace-nowrap">
                    {item.badgeText}
                  </Badge>
                )}
              </div>
              {item.subtitle && <p className="text-sm text-slate-500 line-clamp-2">{item.subtitle}</p>}
              {item.price && <p className="text-base font-bold text-slate-900 mt-1">{item.price}</p>}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No items to display.
          </div>
        )}
      </div>
    </div>
  );
};
