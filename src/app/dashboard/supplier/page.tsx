"use client";

import React, { ReactElement, useMemo } from "react";
import { Search, Pencil, Trash2, SquareArrowOutUpRight, Truck, Phone, Mail, MapPin, Building } from "lucide-react";
import { toast, Toaster } from "sonner";
import ActionButtonsSupplier from "@/components/dialog/dialogSupplier/dialogActionButtonsSupplier";
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
    
      const fetchSuppliers = async () => {
        try {
          setLoading(true);
          const res = await getSuppliers();
          setSuppliers(res.data);
        } catch (error) {
          console.error("Gagal fetch supplier", error);
          toast.error("Gagal mengambil data supplier");
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchSuppliers();
      }, []);
    
      const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
      };
    
      const filteredSuppliers = useMemo(() => {
        const keyword = search.toLowerCase();
        
        return suppliers.filter((supplier) => {
          return (
            supplier.name.toLowerCase().includes(keyword) ||
            supplier.email.toLowerCase().includes(keyword) ||
            supplier.phone_number.toLowerCase().includes(keyword) ||
            supplier.address.toLowerCase().includes(keyword)
          );
        });
      }, [suppliers, search]);
    return (
        <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-xs mx-auto">
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
              <DialogAddSupplier onSuccess={fetchSuppliers} />
              <ButtonTrashed route="supplier"/>
            </div>
          </div>
        </div>
        <div className="mb-4 sm:mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Supplier</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {suppliers.length}
                </p>
              </div>
            </div>
          </div>
         
          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Pencarian</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredSuppliers.length}
                </p>
              </div>
            </div>
          </div>
           <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900/30">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Aktif</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {suppliers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Kontak</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {suppliers.filter(s => s.phone_number).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <TableSupplier/>
        </div>
    )
}