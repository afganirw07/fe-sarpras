"use client"

import TableKategori from "@/components/tables/tables-UI/table-kategori/page"
import { useEffect, useState } from "react";
import {
  FolderOpen,
  Tag,
  List,
} from "lucide-react";
import DialogCategory from "@/components/dialog/dialogCategory/dialogAddCategory";
import ButtonTrashed from "@/components/ui/button/trashedButton";

type KategoriStats = {
  totalKategori: number;
  totalSubkategori: number;
  totalHasilPencarian: number;
} | null;

export default function Kategori() {
  const [stats, setStats] = useState<KategoriStats>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  console.log(stats?.totalSubkategori);
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br rounded-xl from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Manajemen Kategori
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola kategori dan subkategori
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DialogCategory onSuccess={handleRefresh} />
            <ButtonTrashed route="kategori" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Kategori */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Kategori
              </p>
              {stats === null ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalKategori.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Total Subkategori */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Subkategori
              </p>
              {stats === null ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSubkategori.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
              <Tag className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hasil Pencarian
              </p>
              {stats === null ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalHasilPencarian.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <TableKategori key={refreshKey} onStatsUpdate={setStats} />
    </div>
  );
}