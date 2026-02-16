"use client";

import React, { ReactElement, useMemo } from "react";
import { Search, Truck, Phone, Mail } from "lucide-react";
import { toast, Toaster } from "sonner";
import DialogAddSupplier from "@/components/dialog/dialogSupplier/dialogAddSupllier";
import { useEffect } from "react";
import { getSuppliers, Supplier } from "@/lib/supplier";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonTrashed from "@/components/ui/button/trashedButton";
import TableSupplier from "@/components/tables/tables-UI/table-supplier/page";

export default function SupplierPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalWithContact, setTotalWithContact] = useState(0);
  const [searchResults, setSearchResults] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getSuppliers(1, 9999);
      console.log("Stats Response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        setSuppliers(response.data);
        
        const total = response.pagination?.total || response.data.length;
        setTotalSuppliers(total);
        
        const active = response.data.filter(s => s.deleted_at === null).length;
        setTotalActive(active);
        
        const withContact = response.data.filter(s => s.phone_number).length;
        setTotalWithContact(withContact);
        
      } else if (Array.isArray(response)) {
        setSuppliers(response);
        setTotalSuppliers(response.length);
        
        const active = response.filter(s => s.deleted_at === null).length;
        setTotalActive(active);
        
        const withContact = response.filter(s => s.phone_number).length;
        setTotalWithContact(withContact);
      } else {
        setSuppliers([]);
        setTotalSuppliers(0);
        setTotalActive(0);
        setTotalWithContact(0);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Gagal mengambil data supplier");
      setSuppliers([]);
      setTotalSuppliers(0);
      setTotalActive(0);
      setTotalWithContact(0);
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

  // const filteredSuppliers = useMemo(() => {
  //   const keyword = search.toLowerCase();
    
  //   const filtered = suppliers.filter((supplier) => {
  //     return (
  //       supplier.name.toLowerCase().includes(keyword) ||
  //       supplier.email.toLowerCase().includes(keyword) ||
  //       supplier.phone_number.toLowerCase().includes(keyword) ||
  //       supplier.address.toLowerCase().includes(keyword)
  //     );
  //   });
    
  //   // Update search results count
  //   setSearchResults(filtered.length);
    
  //   return filtered;
  // }, [suppliers, search]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-xs mx-auto">
      
      {/* Header */}
      <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex lg:flex-row flex-col justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-2 sm:p-3 shadow-lg shadow-blue-500/20">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Manajemen Supplier
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Kelola data supplier dan kontak
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-row items-center">
            <DialogAddSupplier onSuccess={handleRefresh} />
            <ButtonTrashed route="supplier" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-4 sm:mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Supplier */}
        <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Supplier</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalSuppliers.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pencarian */}
        <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Pencarian</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {searchResults.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Aktif */}
        <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Aktif</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalActive.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Kontak</p>
              {loading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalWithContact.toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <TableSupplier key={refreshKey} onSuccess={handleRefresh} />
    </div>
  );
}