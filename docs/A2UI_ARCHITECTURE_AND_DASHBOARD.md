# A2UI Architecture & E-Commerce Microservices Backend Documentation

This document provides a detailed overview of the entire E-Commerce Backend (NestJS Microservices), followed by the Generative UI architecture (A2UI Python Agent), Human-in-the-Loop (HITL) actions, and the available Dashboard components with their expected data types.

---

## 1. E-Commerce Microservices Architecture (NestJS)

The core backend (`/mnt/disk3/Microservice-E-Commerce`) is built as a highly scalable **NestJS Monorepo**, serving as an Operations Dashboard for e-commerce operators. 

### 1.1 Infrastructure & Tech Stack
- **Framework:** NestJS (Node.js) using a monorepo structure (`apps/`, `libs/`).
- **Database:** A single PostgreSQL instance divided strictly into isolated schemas (`catalog_schema`, `orders_schema`, `agent_runtime_schema`). This ensures clear data ownership without cross-schema foreign keys. Managed via **Prisma ORM**.
- **Auth:** **Clerk Identity Platform**. The Gateway verifies Clerk JWTs and maps roles to create a trusted actor context for microservices.
- **Communication:** 
  - External (Browser -> Gateway): REST/JSON and HTTP/SSE (Server-Sent Events) for Agent streaming.
  - Internal (Gateway -> Business Services): **gRPC** for strict, typed, high-performance synchronous communication.
- **Async Jobs:** **Inngest Cloud** handles background durable jobs (e.g., sending emails after an order status change).

### 1.2 Microservices Breakdown
The `apps/` directory encapsulates independent, scalable services:

1. **`api-gateway` (NestJS)**
   - **Role:** The public edge. Exposes REST APIs, verifies Clerk session JWTs, handles rate-limiting, and creates a trusted actor context.
   - **Routing:** Routes normal operations to Catalog/Order via gRPC. Proxies AG-UI streaming requests to the Agent Service.

2. **`catalog` (NestJS + Prisma)**
   - **Role:** Manages products, categories, pricing, and inventory adjustments.
   - **Data:** Owns the `catalog` schema.

3. **`order` (NestJS + Prisma)**
   - **Role:** Manages order transitions, processing, and lifecycle. Provides idempotency for bulk updates.
   - **Data:** Owns the `orders` schema (saving snapshots of items, not FKs to catalog).

4. **`agent-service` / Main Agent (Python FastAPI + LangGraph)**
   - **Role:** The AI brain. Orchestrates LangGraph workflows, manages Thread CRUD and AG-UI event replay.
   - **Data:** Owns `agent_runtime` and `langgraph_checkpoint` schemas via PostgreSQL.
   - **Integration:** Calls Catalog and Order services via gRPC tools to answer user queries.

---

## 2. Backend Capabilities (Python Agent + CopilotRuntime)

The system is powered by a **CopilotKit A2UI Auto-Inject** architecture, which separates business logic from UI rendering into two cooperating layers.

### 2.1 The Primary Backend Agent (Python / LangGraph)
- **Role:** The core brain of the system. It receives natural language requests, uses tools to execute business logic, queries databases, and decides what data to return.
- **Implementation:** Written in Python using `LangGraph` and served via `FastAPI`.
- **Key Tools & Data Formats:**
  - **`get_sales_data` (Data Fetching):** Simulates fetching data from backend microservices. The agent retrieves raw JSON data, which is then mapped by the UI Planner.
    *Example Data Returned:*
    ```json
    {
      "summary": { "totalRevenue": 125430.50, "totalOrders": 3240 },
      "revenueByMonth": [ { "month": "Jan", "revenue": 10500 }, ... ],
      "salesByCategory": [ { "category": "Electronics", "sales": 45000 }, ... ],
      "topProducts": [ { "name": "Headphones", "revenue": 371876, "status": "In Stock" }, ... ]
    }
    ```
  - **`send_email` (Action Execution):** An executable tool containing backend business logic (e.g., SMTP integration, database writes).

### 2.2 The Secondary UI Planner (Node.js / CopilotRuntime)
- **Role:** Takes the data gathered by the Python Agent and intelligently designs the UI layout.
- **Workflow:** 
  1. Python agent calls a virtual `generate_a2ui` tool.
  2. The Node.js CopilotRuntime middleware (`injectA2UITool: true`) intercepts this.
  3. A secondary LLM (configured in Node.js, e.g., `gpt-4o-mini`) reads the React Component Catalog.
  4. It streams the A2UI JSON protocol to the frontend.

### 2.3 Human-in-the-Loop (HITL) & Action Dispatch
- The architecture supports two-way communication. 
- When the UI Planner generates an interactive component (like a `Button`), it embeds an `action` object containing the event name and context.
- When the user clicks the button, the React frontend calls `dispatch(action)`. This sends the data directly back to the Python Agent.
- The Python Agent automatically catches this event and executes the corresponding backend Tool (e.g., executing the `send_email` logic with the payload provided by the UI).

---

## 3. Dashboard Components & Data Types

The frontend React application defines a strict catalog of components in `src/a2ui/definitions.ts`. The UI Planner LLM uses this schema to generate valid JSON payloads.

### Layout Components

**`DashboardCanvas`**
- **Description:** The root container for a full-screen dynamic dashboard. It uses a React Portal trick to project the UI out of the chat window and onto the main dashboard page.
- **Data:**
  - `title` (string): Title of the dashboard.
  - `children` (string[]): Array of child component IDs (usually Row or Column).

**`Row`**
- **Description:** Horizontal layout container.
- **Data:**
  - `gap` (number, optional): Spacing in pixels.
  - `align`, `justify` (enums, optional): Flex alignment.
  - `children` (string[]): Array of child component IDs.

**`Column`**
- **Description:** Vertical layout container.
- **Data:**
  - `gap` (number, optional): Spacing in pixels.
  - `align` (enum, optional): Flex alignment.
  - `children` (string[]): Array of child component IDs.

**`Card`**
- **Description:** A styled container with a title and optional subtitle, grouping related content. Use as root for inline chat widgets (like email drafts).
- **Data:**
  - `title` (string)
  - `subtitle` (string, optional)
  - `children` (string[], optional): Array of child component IDs.

---

### Data & Visualization Components

**`Metric`**
- **Description:** A key/value KPI tile with trend indicators.
- **Data:**
  - `label` (string)
  - `value` (string)
  - `trend` (enum: `"up" | "down" | "neutral"`, optional)
  - `trendValue` (string, optional)

**`InfoRow`**
- **Description:** A compact two-column 'label: value' row, great for summaries or email drafts inside a Card.
- **Data:**
  - `label` (string)
  - `value` (string)

**`Badge`**
- **Description:** A small colored status pill.
- **Data:**
  - `text` (string)
  - `variant` (enum: `"success" | "warning" | "error" | "info"`, optional)

**`LineChart`**
- **Description:** Time-series line chart.
- **Data:**
  - `title` (string)
  - `xAxisKey` (string): Key in the data object for the X-axis (e.g., "month").
  - `lines` (Object[]): Array defining lines `[{ dataKey: string, color?: string, name?: string }]`.
  - `data` (Object[]): Array of data points `[{ month: "Jan", revenue: 1000 }, ...]`.

**`PieChart` & `BarChart`**
- **Description:** Standard charts for composition and comparison.
- **Data:**
  - `title` (string)
  - `description` (string, optional)
  - `data` (Object[]): Array of data points. Automatically maps `label`/`name` and `value`/`sales`.

**`DataTable`**
- **Description:** A sortable table with headers and rows.
- **Data:**
  - `columns` (Object[]): Array of column definitions `[{ key: string, label: string }]`.
  - `data` (Object[]): Array of row objects matching the column keys.

---

### Interactive Components (HITL)

**`Button`**
- **Description:** A clickable button that dispatches actions back to the Agent.
- **Data:**
  - `text` (string): The button label.
  - `action` (Object): The payload sent to the Agent.
    - Example: `{"event": {"name": "send_email", "context": {"to_email": "boss@company.com"}}}`
