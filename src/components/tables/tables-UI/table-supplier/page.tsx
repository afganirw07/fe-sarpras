"use client";

import React, { ReactElement, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";

import { Search, Pencil, Trash2, SquareArrowOutUpRight, Truck, Phone, Mail, MapPin, Building } from "lucide-react";
import { toast, Toaster } from "sonner";
import ActionButtonsSupplier from "@/components/dialog/dialogSupplier/dialogActionButtonsSupplier";
import DialogAddSupplier from "@/components/dialog/dialogSupplier/dialogAddSupllier";
import { useEffect } from "react";
import { getSuppliers } from "@/lib/supplier";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Supplier } from "@/lib/supplier";
import ButtonTrashed from "@/components/ui/button/trashedButton";

export default function TableSupplier() {
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
      <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-md mx-auto">
        <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-4">
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
            <div className="flex items-center gap-2 flex-col sm:flex-row">
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
        <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="border-b border-gray-200/50 p-4 sm:p-6 dark:border-white/5">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari supplier, email, atau kontak..."
                value={search}
                onChange={handleSearch}
                className="w-full rounded-lg sm:rounded-xl border border-gray-200 bg-white py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>
            {loading ? (
              <div className="py-12 sm:py-16">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                </div>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="py-12 sm:py-16">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                    <Truck className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? "Data tidak ditemukan" : "Tidak ada supplier"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                    {search ? "Coba kata kunci pencarian lain" : "Tambahkan supplier baru untuk memulai"}
                  </p>
                </div>
              </div>
            ) : (
              
         <div className="relative w-full overflow-x-auto lg:overflow-x-visible">
              <Table className="min-w-225 lg:min-w-full table-auto">
                <TableHeader>
                  <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                    <TableCell
                      isHeader
                      className="min-w-20 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-65 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Supplier
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-65  bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Kontak
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-80  bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Alamat
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-32 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Aksi
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <td colSpan={5} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                        </div>
                      </td>
                    </TableRow>
                  ) : filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <td colSpan={5} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                            <Truck className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {search ? "Data tidak ditemukan" : "Tidak ada supplier"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {search ? "Coba kata kunci pencarian lain" : "Tambahkan supplier baru untuk memulai"}
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier, index) => (
                      <TableRow 
                        key={supplier.id}
                        className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                      >
                        <TableCell className="px-6 py-4">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                            {index + 1}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
                              {supplier.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {supplier.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {supplier.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {supplier.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-emerald-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {supplier.phone_number}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                              {supplier.address}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <ActionButtonsSupplier
                            supplier={supplier}
                            onSuccess={fetchSuppliers}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            )}
        </div>
      </div>
  );
}