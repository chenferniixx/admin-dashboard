import { DashboardContent } from "./DashboardContent";

/**
 * Dashboard home: dynamic KPIs and charts from Users & Products data.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your application and key metrics from Users & Products.
        </p>
      </div>
      <DashboardContent />
    </div>
  );
}
