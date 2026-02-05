"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Building2,
  RotateCcw,
  Archive,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { getDeletedSuppliers, Supplier } from "@/lib/supplier";
import RestoreActionSupplier from "@/components/dialog/dialogSupplier/restoreSupplier";

export default function SupplierTrashed() {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");

  const fetchDeleted = async () => {
    try {
      setLoading(true);
      const res = await getDeletedSuppliers(1, 50);
      setSuppliers(res.data);
    } catch {
      toast.error("Gagal mengambil supplier terhapus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;

    const keyword = search.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        s.phone_number.toLowerCase().includes(keyword) ||
        s.address.toLowerCase().includes(keyword),
    );
  }, [suppliers, search]);

  return (
    <div className="bg-linear-to-br flex min-h-screen flex-col from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
      <div className="mx-auto w-full lg:max-w-7xl md:max-w-4xl max-w-md">
        <div className="mb-4 rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:mb-6 sm:rounded-2xl sm:p-6 dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-4 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-linear-to-br rounded-lg from-blue-500 to-blue-600 p-2 shadow-lg shadow-blue-500/20 sm:rounded-xl sm:p-3">
                <Archive className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="font-figtree text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                  Supplier Terhapus
                </h1>
                <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                  Kelola dan pulihkan supplier yang dihapus
                </p>
              </div>
            </div>
            <div className="self-start rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 sm:rounded-xl sm:px-4 dark:border-blue-900/50 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {filteredSuppliers.length} Supplier Terhapus
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-lg border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:rounded-xl dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Trash2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                  Total Terhapus
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                  {suppliers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:rounded-xl dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <RotateCcw className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                  Dapat Dipulihkan
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                  {filteredSuppliers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:rounded-xl dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Archive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                  Status
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Arsip Aktif
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm sm:rounded-2xl dark:border-white/5 dark:bg-white/5">
          <div className="border-b border-gray-200/50 p-4 sm:p-6 dark:border-white/5">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:left-4"
              />
              <input
                placeholder="Cari supplier yang terhapus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:rounded-xl sm:py-3 sm:pl-12 sm:pr-4 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="block lg:hidden">
            {loading && (
              <div className="py-12 sm:py-16">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Memuat data...
                  </p>
                </div>
              </div>
            )}

            {!loading && filteredSuppliers.length === 0 && (
              <div className="py-12 sm:py-16">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                    <Truck className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search
                      ? "Data tidak ditemukan"
                      : "Tidak ada supplier terhapus"}
                  </p>
                  <p className="px-4 text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                    {search
                      ? "Coba kata kunci pencarian lain"
                      : "Semua supplier Anda masih aktif"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full overflow-x-auto lg:overflow-x-visible">
            <Table className="min-w-225 table-auto lg:min-w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  <TableCell
                    isHeader
                    className="bg-linear-to-br w-20 from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Supplier
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Kontak
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Alamat
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br w-32 from-gray-50 to-gray-100/50 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <td colSpan={5} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Memuat data...
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}{" "}
                {!loading && filteredSuppliers.length === 0 && (
                  <TableRow>
                    <td colSpan={5} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                          <Truck className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {search
                            ? "Data tidak ditemukan"
                            : "Tidak ada supplier terhapus"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {search
                            ? "Coba kata kunci pencarian lain"
                            : "Semua supplier Anda masih aktif"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}{" "}
                {!loading &&
                  filteredSuppliers.map((s, index) => (
                    <TableRow
                      key={s.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-6 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {index + 1}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-linear-to-br flex h-10 w-10 items-center justify-center rounded-lg from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {s.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {s.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {s.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {s.phone_number}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <span className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                            {s.address}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <RestoreActionSupplier
                          supplierId={s.id}
                          onSuccess={fetchDeleted}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
