"use client"

import TableWarehouse from "@/components/tables/tables-UI/table-warehouse/page"
import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Warehouse, 
  Building2, 
  Tag,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { getRooms, Room } from "@/lib/warehouse";
import ButtonQrWarehouse from "@/components/button-qr/buttonQrWarehouse";
import { QRCodeCanvas } from "qrcode.react";
import ButtonTrashed from "@/components/ui/button/trashedButton";
import DialogAddWarehouse from "@/components/dialog/dialogWarehouse/dialogaddWarehouse";

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalWarehouses, setTotalWarehouses] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [searchResults, setSearchResults] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getRooms(1, 9999);
      console.log("Stats Response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        setWarehouses(response.data);
        
        const total = response.pagination?.total || response.data.length;
        setTotalWarehouses(total);
        
        const active = response.data.filter(w => w.deleted_at === null).length;
        setTotalActive(active);
        
        const uniqueTypes = new Set(response.data.map(w => w.type));
        setTotalCategories(uniqueTypes.size);
        
      } else if (Array.isArray(response)) {
        setWarehouses(response);
        setTotalWarehouses(response.length);
        
        const active = response.filter(w => w.deleted_at === null).length;
        setTotalActive(active);
        
        const uniqueTypes = new Set(response.map(w => w.type));
        setTotalCategories(uniqueTypes.size);
      } else {
        setWarehouses([]);
        setTotalWarehouses(0);
        setTotalActive(0);
        setTotalCategories(0);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error(error?.message || "Gagal mengambil data warehouse");
      setWarehouses([]);
      setTotalWarehouses(0);
      setTotalActive(0);
      setTotalCategories(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredWarehouses = useMemo(() => {
    const keyword = search.toLowerCase();
    
    const filtered = warehouses.filter((warehouse) => {
      return (
        warehouse.code.toLowerCase().includes(keyword) ||
        warehouse.type.toLowerCase().includes(keyword) ||
        warehouse.name.toLowerCase().includes(keyword)
      );
    });
    
    // Update search results count
    setSearchResults(filtered.length);
    
    return filtered;
  }, [warehouses, search]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-xs mx-auto">
      
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex lg:flex-row flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <Warehouse className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Manajemen Warehouse
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola data warehouse dan ruangan
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {warehouses.map((w) => (
              <QRCodeCanvas
                key={w.id}
                id={`qr-${w.id}`}
                value={`${window.location.origin}/warehouse/${w.id}`}
                size={150}
                className="hidden"
              />
            ))}
            <ButtonQrWarehouse warehouses={warehouses} />
            <DialogAddWarehouse onSuccess={handleRefresh} />
            <ButtonTrashed route="/warehouse" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Warehouse */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Warehouse className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Warehouse</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalWarehouses.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Aktif */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktif</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalActive.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kategori */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
              <Tag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Kategori</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCategories.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900/30">
              <Search className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Hasil Pencarian</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchResults.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <TableWarehouse key={refreshKey} />
    </div>
  );
}