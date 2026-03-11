"use client"

import TablePemutihan from "@/components/tables/tables-UI/table-pemutihan/page";
import { useState, useCallback } from "react";
import { Package, Layers, FolderTree } from "lucide-react";
import DialogAddPemutihan from "@/components/dialog/dialogPemutihan/dialogAddPemutihan";

type PemutihanStats = {
  totalDeleted: number;
  totalJenis: number;
  totalKategori: number;
} | null;

export default function Pemutihan() {
  const [stats, setStats] = useState<PemutihanStats>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-md mx-auto">
        <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                  Data Pemutihan Barang
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola inventori dan Kondisi Barang
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <DialogAddPemutihan onSuccess={handleSuccess} />
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Barang Dihapus</p>
                {stats === null ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalDeleted.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Jenis Barang</p>
                {stats === null ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalJenis.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <FolderTree className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Kategori</p>
                {stats === null ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalKategori.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <TablePemutihan key={refreshKey} onStatsUpdate={setStats} />
      </div>
    </>
  );
}