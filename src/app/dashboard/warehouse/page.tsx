"use client"

import TableWarehouse from "@/components/tables/tables-UI/table-warehouse/page";
import { useState } from "react";
import { Warehouse as WarehouseIcon, LayoutGrid, Search } from "lucide-react";
import DialogAddWarehouse from "@/components/dialog/dialogWarehouse/dialogaddWarehouse";
import ButtonTrashed from "@/components/ui/button/trashedButton";
import ButtonQrWarehouse from "@/components/button-qr/buttonQrWarehouse";
import { Room } from "@/lib/warehouse";

type WarehouseStats = {
  totalWarehouse: number;
  totalActive: number;
  totalSearch: number;
} | null;

export default function WarehousePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<WarehouseStats>(null);
  const [warehouses, setWarehouses] = useState<Room[]>([]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <WarehouseIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Data Ruangan 
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola data ruangan dan gudang
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ButtonQrWarehouse warehouses={warehouses}/>
            <DialogAddWarehouse onSuccess={handleRefresh} />
            <ButtonTrashed route="warehouse" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Warehouse */}
        <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <WarehouseIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Warehouse</p>
              {stats === null ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalWarehouse.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ruangan Aktif */}
        <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Ruangan Aktif</p>
              {stats === null ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalActive.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Hasil Pencarian</p>
              {stats === null ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSearch.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Pass onStatsUpdate ke TableWarehouse */}
 <TableWarehouse
  key={refreshKey}
  onStatsUpdate={setStats}
  onDataUpdate={setWarehouses}
/>
    </div>
  );
}