import { createCatalog } from "@copilotkit/a2ui-renderer";
import { dashboardDefinitions } from "./definitions";
import { 
  DashboardCanvasRenderer, 
  RowRenderer,
  ColumnRenderer,
  CardRenderer,
  MetricRenderer, 
  BadgeRenderer,
  InfoRowRenderer,
  LineChartRenderer, 
  PieChartRenderer, 
  BarChartRenderer,
  DataTableRenderer,
  ButtonRenderer,
  CatalogLayoutRenderer
} from "./renderers";

export const dashboardCatalog = createCatalog(
  dashboardDefinitions as any,
  {
    DashboardCanvas: DashboardCanvasRenderer,
    Row: RowRenderer,
    Column: ColumnRenderer,
    Card: CardRenderer,
    Metric: MetricRenderer,
    Badge: BadgeRenderer,
    InfoRow: InfoRowRenderer,
    LineChart: LineChartRenderer,
    PieChart: PieChartRenderer,
    BarChart: BarChartRenderer,
    DataTable: DataTableRenderer,
    Button: ButtonRenderer,
    CatalogLayout: CatalogLayoutRenderer
  },
  { includeBasicCatalog: true }
);
