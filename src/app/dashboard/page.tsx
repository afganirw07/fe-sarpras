import type { Metadata } from "next";
import { StatsTotal } from "@/components/statsDashboard/EcommerceMetrics";
import OrderStatusDonut from "@/components/charts/donut/orderStatusDonut";
import RecentTransactions from "@/components/statsDashboard/RecentOrders";
import DamagedItemsLineChart from "@/components/statsDashboard/PoorItems";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 md:gap-6">
        <StatsTotal />
        {/* <DamagedItemsLineChart /> */}
      </div>

      <div className="col-span-12 xl:col-span-4 xl:row-span-1">
        <div className="h-full">
          <OrderStatusDonut />
        </div>
      </div>

      <div className="col-span-12">
        <RecentTransactions />
      </div>

    </div>
  );
}