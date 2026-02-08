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
       //  responsive container
        <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-xs">
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
               <div className="overflow-hidden">
         <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                                  <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                                    <TableCell
                                      isHeader
                                      className="w-20 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                                    >
                                      No
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                                    >
                                      Nama Pengguna
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                                    >
                                      Role & Akses
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                                    >
                                      Alamat
                                    </TableCell>
                                    <TableCell
                                      isHeader
                                      className="w-32 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
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
                              <span className="text-sm md:text-xs text-gray-700 dark:text-gray-300">
                                {supplier.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-emerald-500" />
                              <span className="text-sm md:text-xs text-gray-700 dark:text-gray-300">
                                {supplier.phone_number}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <span className="text-sm md:text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
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
            </div>
            )}
        </div>
      </div>
  );
}