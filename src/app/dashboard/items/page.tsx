"use client"

import TableItems from "@/components/tables/tables-UI/table-items/page";
import DialogAddItems from "@/components/dialog/dialogItems/dialogAddItems";
import { useState, useEffect } from "react";
import { Package, Layers, FolderTree } from "lucide-react";
import { getItems, Item } from "@/lib/items";

export default function ItemPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getItems(1, 9999);
      console.log("Stats Response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        setItems(response.data);
        
        const total = response.pagination?.total || response.data.length;
        setTotalItems(total);
        
        const stock = response.data.reduce((sum, item) => {
          return sum + (item.stock || 0);
        }, 0);
        setTotalStock(stock);
        
        const uniqueCategories = new Set(
          response.data
            .map(item => item.category_id)
            .filter(id => id !== undefined && id !== null)
        );
        setTotalCategories(uniqueCategories.size);
        
      } else if (Array.isArray(response)) {
        setItems(response);
        setTotalItems(response.length);
        
        const stock = response.reduce((sum, item) => {
          return sum + (item.stock || 0);
        }, 0);
        setTotalStock(stock);
        
        const uniqueCategories = new Set(
          response
            .map(item => item.category_id)
            .filter(id => id !== undefined && id !== null)
        );
        setTotalCategories(uniqueCategories.size);
      } else {
        setItems([]);
        setTotalItems(0);
        setTotalStock(0);
        setTotalCategories(0);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setItems([]);
      setTotalItems(0);
      setTotalStock(0);
      setTotalCategories(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]); 

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                  Data Item
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola inventori dan stok barang
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <DialogAddItems onSuccess={handleRefresh} />
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Total Item */}
          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Item</p>
                {loading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {totalItems.toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Total Stok */}
          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Stok</p>
                {loading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStock.toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Total Kategori */}
          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <FolderTree className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Kategori</p>
                {loading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {totalCategories.toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <TableItems key={refreshKey}  />
      </div>
    </>
  )
}