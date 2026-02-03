# โครงสร้างโปรเจกต์ Admin Dashboard

เอกสารนี้สรุปโครงสร้างและหลักการออกแบบสำหรับนำเสนอตอนสัมภาษณ์ (mid–senior frontend level).

---

## 1. โครงสร้างโฟลเดอร์ (Folder Structure)

```
admin-dashboard/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (REST)
│   │   ├── auth/           # NextAuth
│   │   ├── users/          # CRUD users
│   │   └── products/       # CRUD products
│   ├── auth/               # Public auth pages (login)
│   ├── dashboard/           # Protected dashboard
│   │   ├── users/          # Feature: Users (page + table + modals)
│   │   ├── products/       # Feature: Products (page + table + modals)
│   │   ├── DashboardContent.tsx  # Client: KPIs + charts data
│   │   ├── layout.tsx       # Server: auth check + layout
│   │   └── page.tsx         # Dashboard home (Server)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── charts/             # Reusable chart components (ECharts)
│   ├── ErrorBoundary.tsx   # Error boundary (fallback UI + retry)
│   ├── forms/              # Shared forms (LoginForm)
│   ├── layout/             # Layout (Sidebar, Topbar, DashboardLayout)
│   ├── providers/          # React Query, Session
│   ├── table/              # Reusable DataTable
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom hooks (data + mutations)
│   ├── useUsers.ts         # useUsers({ page, limit, search })
│   ├── useProducts.ts      # useProducts({ page, limit, search })
│   └── index.ts
├── lib/
│   ├── api/                # API client (users, products)
│   ├── api.ts              # Base fetch + buildQuery
│   ├── auth.ts             # NextAuth config + getSession
│   ├── constants.ts        # ROUTES, QUERY_KEYS, PAGINATION
│   ├── db/                 # In-memory store (replace with DB later)
│   ├── nav.ts              # Sidebar nav config
│   ├── validations/        # Zod schemas + validate helpers
│   │   ├── user.ts         # userCreateSchema, validateUserForm
│   │   ├── product.ts     # productFormSchema, validateProductForm
│   │   └── index.ts
│   └── utils.ts
├── store/                  # Zustand (sidebar, toast)
├── types/                  # Shared TypeScript types
└── middleware.ts           # Route protection
```

**หลักการแยกส่วน (Separation of Concerns):**

- **app/** = routing, pages, API routes. หน้าแต่ละ feature อยู่ใต้ `app/dashboard/<feature>/`.
- **components/** = UI ที่ใช้ซ้ำได้; แยกเป็น charts, forms, layout, table, ui.
- **lib/** = logic ที่ไม่เกี่ยวกับ UI: API client, auth, db, nav config.
- **store/** = global client state (Zustand).
- **types/** = types ที่ใช้ร่วมกัน (User, Product, NextAuth).

---

## 2. การแยก Component

| ประเภท | ที่อยู่ | ตัวอย่าง |
|--------|--------|----------|
| **Page (Server)** | `app/dashboard/**/page.tsx` | Metadata + render feature |
| **Feature container** | `app/dashboard/users/UsersTable.tsx` | Data + CRUD + modals |
| **Feature modals** | `app/dashboard/users/UserFormModal.tsx` | Create/Edit form ใน feature |
| **Reusable UI** | `components/table/DataTable.tsx` | Generic table + search + pagination |
| **Layout** | `components/layout/` | Sidebar, Topbar, DashboardLayout |
| **Charts** | `components/charts/` | Donut, Bar, Line (รับ data จาก props) |
| **Primitives** | `components/ui/` | Button, Input, Dialog (shadcn) |

**ทำไม Modal อยู่ใต้ `app/dashboard/users/` ไม่ใช่ `components/`?**

- UserFormModal / DeleteUserModal ใช้เฉพาะใน Users feature และผูกกับ types + API ของ User.
- วางไว้ใน feature = colocation; ลด coupling กับ components สาธารณะ.
- ถ้าอนาคตมี "generic FormModal" ที่ใช้หลาย entity ค่อยย้ายไป `components/` ได้.

**DataTable อยู่ที่ `components/table/`:**

- รับ `columns`, `data`, `keyExtractor`, `search`, `pagination` — ไม่ผูกกับ User/Product.
- UsersTable / ProductsTable ส่ง columns + data เข้าไป = reuse ได้ชัดเจน.

---

## 3. Data Flow & Tech Stack

- **Server:** Layout ใช้ `getSession()` เช็ค auth; redirect ถ้าไม่ login.
- **Client:** TanStack Query สำหรับ list/create/update/delete; query key ร่วมกับ Dashboard (dashboard refetch เมื่อ invalidate).
- **API layer:** `lib/api.ts` + `lib/api/users.ts`, `lib/api/products.ts` — ใช้ใน Query `queryFn` และ mutation.
- **State:** Zustand เฉพาะ UI (sidebar open, toast); ไม่เก็บ server data ใน Zustand.

---

## 4. จุดแข็ง (Strengths) — พร้อมนำเสนอ

1. **App Router + Server/Client แยกชัด:** หน้าเป็น Server Component; ส่วนที่ต้องใช้ query/modal เป็น Client.
2. **API แยก layer:** `lib/api.ts` + ไฟล์ต่อ resource; ง่ายต่อการเปลี่ยนเป็น backend จริง.
3. **Type safety:** types ใน `types/` ใช้ทั้ง API, form, table.
4. **Reusable DataTable:** generic, ไม่ผูก entity.
5. **Layout แยก:** Sidebar/Topbar/DashboardLayout อยู่ใน `components/layout` มี barrel export.
6. **Auth ครบ:** NextAuth + middleware + layout check.

---

## 5. จุดที่ปรับปรุงได้ (Improvements) — สถานะหลังปรับปรุง

| หัวข้อ | สถานะ | รายละเอียด |
|--------|--------|------------|
| **Constants** | ✅ ทำแล้ว | `lib/constants.ts` — ROUTES, QUERY_KEYS, PAGINATION ใช้ใน Topbar, DashboardContent, hooks, tables. |
| **Custom hooks** | ✅ ทำแล้ว | `hooks/useUsers.ts`, `hooks/useProducts.ts` — รวม useQuery + mutations (create, update, delete) + invalidation/toast; UsersTable/ProductsTable ใช้ hooks แทน logic ในตัว. |
| **Error boundary** | ✅ ทำแล้ว | `components/ErrorBoundary.tsx` — class component จับ render error; แสดง fallback + ปุ่ม "Try again"; ใช้ใน DashboardLayout ห่อ `{children}`. |
| **README** | ✅ ทำแล้ว | README.md — tech stack, การรัน, โครงสร้างย่อ, ลิงก์ไป docs. |
| **Dead code** | ✅ ทำแล้ว | SignupsBarChart ถอดออกจาก `components/charts/index.ts` (ไฟล์ยังอยู่ ถ้าต้องใช้ค่อย export กลับ). |
| **Form validation** | ✅ ทำแล้ว | `lib/validations/user.ts`, `lib/validations/product.ts` — Zod schema + `validateUserForm` / `validateProductForm` คืน `{ success, data }` หรือ `{ success: false, errors }`; UserFormModal และ ProductFormModal ใช้แทน validate ใน component. |

---

## 6. Performance Optimizations (Vercel React Best Practices)

โปรเจกต์นี้ได้ปรับปรุงตามแนวทาง **Vercel React Best Practices** ดังนี้:

### 6.1 Bundle Size Optimization (CRITICAL)

| Pattern | ไฟล์ | รายละเอียด |
|---------|------|------------|
| `optimizePackageImports` | `next.config.ts` | เพิ่ม `lucide-react`, `echarts-for-react`, `@tanstack/react-query` ใน experimental config เพื่อลด bundle size |

### 6.2 JavaScript Performance (LOW-MEDIUM)

| Pattern | ไฟล์ | รายละเอียด |
|---------|------|------------|
| `js-hoist-regexp` | `api/users/route.ts`, `LoginForm.tsx` | Hoist RegExp (EMAIL_REGEX) ออกนอก function เพื่อหลีกเลี่ยงการสร้างใหม่ทุก request |
| `js-tosorted-immutable` | `DashboardChartsSection.tsx` | ใช้ `toSorted()` แทน `sort()` เพื่อป้องกัน mutation bugs |
| `js-combine-iterations` | `DashboardContent.tsx`, `DashboardChartsSection.tsx` | รวม iterations ใน loop เดียว (revenue + categoryCount) |
| `js-index-maps` | `DashboardChartsSection.tsx` | ใช้ Map สำหรับ aggregation แทน repeated lookups |
| `js-early-exit` | `DashboardChartsSection.tsx` | Return early ใน `formatRelativeTime()` |

### 6.3 Re-render Optimization (MEDIUM)

| Pattern | ไฟล์ | รายละเอียด |
|---------|------|------------|
| `rerender-memo` | Charts components | Wrap ด้วย `React.memo()` เพื่อป้องกัน unnecessary re-renders |
| `rerender-derived-state` | `DashboardContent.tsx` | คำนวณ derived state (revenue, categoryCount) ด้วย `useMemo()` |
| `rendering-hoist-jsx` | `RevenueLineChart.tsx`, `SignupsBarChart.tsx` | Hoist static option config ออกนอก component |

### 6.4 Rendering Performance (MEDIUM)

| Pattern | ไฟล์ | รายละเอียด |
|---------|------|------------|
| `bundle-dynamic-imports` | `DashboardChartsSection.tsx` | ใช้ `next/dynamic` สำหรับ chart components (SSR: false) |
| `rendering-conditional-render` | ทุก component | ใช้ ternary operator แทน `&&` สำหรับ conditional rendering ที่มี potential falsy values |

---

## 7. สรุประดับ Mid–Senior

- **โครงสร้างและแยก component:** อยู่ในระดับ **mid–senior** — แยก app / components / hooks / lib / types / store ชัดเจน; feature colocation สำหรับ modals; reusable table และ layout.
- **Data flow และ stack:** ใช้ Next.js 14+, React Query, Zustand, NextAuth, Zod ตรงกับแนวทางที่ใช้ใน production.
- **Improvements ครบ:** มี constants, custom hooks (useUsers, useProducts), Error Boundary, README, จัดการ dead code, และ form validation แยกใน lib/validations.
- **Performance Optimizations:** ปรับปรุงตาม Vercel React Best Practices — optimizePackageImports, React.memo, useMemo, hoisted static config, toSorted() immutability — พร้อมนำเสนอตอนสัมภาษณ์ได้ครบถ้วน.
