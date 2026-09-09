# 🛡️ E-Commerce Admin Dashboard

Centralized administrative backoffice portal for managing products, orders, customers, and revenue analytics. Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **Clerk Authentication**.

---

## 🔗 Ecosystem Repositories

This project is part of an integrated 4-part microservices platform:

| Repository | Tech Stack | Role & Link |
| :--- | :--- | :--- |
| **Backend Monorepo** | NestJS 11, gRPC, PostgreSQL, Prisma, Inngest | RESTful API Gateway, gRPC microservices, Stripe & Clerk webhooks. <br>🔗 Repo: [`https://github.com/Hieuej147/ecommerce-backend.git`](https://github.com/Hieuej147/ecommerce-backend.git) |
| **Customer Storefront** | Next.js 16, React 19, Tailwind v4 | Customer shop, responsive featured hero banner, cart, Stripe checkout. <br>🔗 Repo: [`https://github.com/Hieuej147/-E-commerce.git`](https://github.com/Hieuej147/-E-commerce.git) |
| **Admin Dashboard** (This repo) | React 19, Vite, TypeScript, Cloudflare Zero Trust | Backoffice management, real-time KPI metrics, orders & catalog CRUD. <br>🔗 Repo: [`https://github.com/Hieuej147/dashboard-admin-ecommern.git`](https://github.com/Hieuej147/dashboard-admin-ecommern.git) |
| **DevOps & GitOps (IaC & Manifests)** | Terraform, Helm, AWS EKS, AWS ECR, OIDC | Infrastructure as Code, OIDC authentication, 9 ECR registries, Kubernetes manifests. <br>🔗 Repo: [`https://github.com/Hieuej147/ecommerce-devops.git`](https://github.com/Hieuej147/ecommerce-devops.git) |

---

## 📌 Architecture Reference & Enhancements

> **Architecture Reference:** Inspired by and adapted from the administrative management pattern in [Jayce-Anh/shopping-cart-project](https://github.com/Jayce-Anh/shopping-cart-project) (originally based on [sivaprasadreddy/spring-boot-microservices-series](https://github.com/sivaprasadreddy/spring-boot-microservices-series.git)).

### Key Adaptations & Improvements:
1. **Isolated Administrative Repository**: The reference project lacked an independent administrative backoffice. This project isolates the admin interface into a dedicated repository, preventing regular customers from ever discovering or probing administrative assets.
2. **Perimeter Edge Security (Cloudflare Zero Trust - Option 1)**: Shields `admin.yourdomain.com` behind an edge access wall. Visitors must authenticate with an email One-Time PIN (OTP) before downloading any JavaScript code ($0 cost, 100% blocker against unauthorized bots/scanners).
3. **Real-Time KPI Dashboard**: Displays live revenue metrics, order volumes, and payment status charts, handling 64-bit integer (`Protobuf Long`) data serialization from backend gRPC microservices.
4. **Interconnection with Other Repos**:
   - Fetches administrative endpoints from the **Backend API Gateway** (`VITE_API_BASE_URL=http://localhost:3000/v1` or production endpoint).
   - Provides seamless navigation backlinks to the **Customer Storefront** (`VITE_STOREFRONT_URL=http://localhost:3001`).

---

## 🌟 Core Features

- 📊 **Executive Overview**: Real-time KPI metrics for gross revenue, completed orders, payment success rates, and newly registered users.
- 📦 **Product Management**: View product catalog, create new products, modify prices and stock inventory, and remove discontinued items.
- 📑 **Order Management**: Detailed order inspection, itemized receipts, customer shipping addresses, order status updates, and order cancellations with automated refunds.
- 💳 **Transaction Tracking**: Comprehensive log of Stripe payment transactions, payment intent identifiers, and status codes.
- 👥 **Customer Management**: User directory displaying registered customer details, creation timestamps, and assigned system roles.
- ⚡ **Ultra-Fast SPA**: Instantaneous sub-second page transitions powered by Vite and React 19.

---

## 🔒 Securing the Admin Portal with Cloudflare Zero Trust (Option 1)

When deployed to production with your custom domain (e.g. `yourdomain.com`), secure `admin.yourdomain.com` so it is never exposed publicly to the internet:

1. **Point Domain to Cloudflare**: Register your domain (Namecheap, GoDaddy, etc.) and point its NameServers to Cloudflare DNS (free tier).
2. **Enable Cloudflare Zero Trust**:
   - Navigate to Cloudflare Dashboard -> **Zero Trust** -> **Access** -> **Applications** -> Click **Add an application**.
   - Choose **Self-hosted**.
   - Application Name: `Admin Backoffice`.
   - Domain: `admin.yourdomain.com`.
3. **Configure Access Policy**:
   - Action: `Allow`.
   - Selector: Select **Emails** -> Enter your authorized personal administrator email (e.g., `admin@yourdomain.com`).
4. **Save Configuration**:
   - When anyone navigates to `https://admin.yourdomain.com`, Cloudflare intercepts the request at its nearest global edge server.
   - Cloudflare demands an email and sends a 6-digit one-time passcode (OTP) directly to your inbox.
   - Only upon entering the valid PIN does the browser download the Admin Dashboard assets.
   - All unauthorized probes, port scanners, and malicious scrapers are blocked at the edge (**100% Free** for up to 50 users).

---

## 📥 How to Clone & Run All 3 Projects Together

To set up the complete ecosystem on your computer:

```bash
# 1. Create a parent directory
mkdir my-ecommerce && cd my-ecommerce

# 2. Clone all 4 repositories
git clone https://github.com/Hieuej147/ecommerce-backend.git backend
git clone https://github.com/Hieuej147/-E-commerce.git storefront
git clone https://github.com/Hieuej147/dashboard-admin-ecommern.git admin-dashboard
git clone https://github.com/Hieuej147/ecommerce-devops.git devops

# 3. Start Backend (Terminal 1)
cd backend
cp .env.example .env
pnpm install
docker compose up -d
pnpm run db:setup
pnpm run dev:all     # Running on port 3000 (Swagger: /docs)

# 4. Start Customer Storefront (Terminal 2)
cd ../storefront
cp .env.example .env.local
pnpm install
pnpm run dev         # Running on port 3001

# 5. Start Admin Dashboard (Terminal 3)
cd ../admin-dashboard
cp .env.example .env
bun install          # or: pnpm install
bun run dev          # Running on port 5173
```

---

## 💻 Local Quickstart (Admin Dashboard Only)

If the backend is already running on `http://localhost:3000`:

```bash
# 1. Install dependencies
bun install
# (or: pnpm install)

# 2. Configure environment variables
cp .env.example .env
```

Ensure `.env` contains:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:3000/v1
VITE_STOREFRONT_URL=http://localhost:3001
```

```bash
# 3. Start development server
bun run dev
# (or: pnpm run dev)
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛑 How to Shut Down

- **Stop Admin Dashboard**: Press **`Ctrl + C`** in the terminal running `bun run dev`.
- **Emergency Port Cleanup**: If port 5173 is hanging, run: `npx kill-port 5173`.

---

## 🐳 Docker Deployment & CI/CD Summary

- **Production Docker Image**: Packages the compiled Vite Single Page Application (SPA) with a lightweight Nginx Alpine container, with built-in security headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`).
- **Automated CI/CD** (`.github/workflows/ci-cd.yml`):
  - On PR & push to `main`: Verifies Bun installation, runs dependency checks, and builds the SPA.
  - On push to `main`: Assumes the AWS IAM OIDC Role, builds the Docker image with production arguments, pushes to **Amazon ECR** (`prod-ecommerce-admin-dashboard`), and triggers a zero-downtime rolling restart on **Amazon EKS**.

---

## 🚀 How to Deploy to AWS

For the complete AWS infrastructure setup, consult our primary infrastructure repository: [`ecommerce-devops`](https://github.com/Hieuej147/ecommerce-devops.git).

### Quick Deployment Flow:
1. **GitHub Secrets Configuration**:
   In this repository's **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:
   - `AWS_ROLE_ARN`: `arn:aws:iam::<YOUR_AWS_ACCOUNT_ID>:role/prod-ecommerce-github-actions-role`
   - `VITE_CLERK_PUBLISHABLE_KEY`: `pk_test_...`
   - `VITE_API_BASE_URL`: `https://api.yourdomain.com/v1`
   - `VITE_STOREFRONT_URL`: `https://store.yourdomain.com`
2. **Deploy to Production**:
   Push your changes to `main`:
   ```bash
   git add .
   git commit -m "feat: admin dashboard enhancement"
   git push origin main
   ```
   GitHub Actions will automatically test, build, push to AWS ECR, and execute a zero-downtime rolling restart on Amazon EKS!

