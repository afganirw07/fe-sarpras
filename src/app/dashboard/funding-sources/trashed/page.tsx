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
  RotateCcw,
  Archive,
  Trash2,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { getDeletedFundingSources, FundingSource } from "@/lib/funding-sources";
import ButtonBack from "@/components/ui/button/backButton";
import Pagination from "@/components/tables/Pagination";
import RestoreFundingSource from "@/components/dialog/dialogFundingSources/dialogRestoreFunding";

export default function FundingSourceTrashed() {
  const [loading, setLoading] = useState(false);
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 3;

  const fetchDeleted = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getDeletedFundingSources(page, perPage);
      setFundingSources(res.data);
      setTotalItems(res.totalFundingSource);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Gagal mengambil funding sources terhapus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleted(currentPage);
  }, [currentPage]);

  const filteredFundingSources = useMemo(() => {
    if (!search.trim()) return fundingSources;
    const keyword = search.toLowerCase();
    return fundingSources.filter(
      (fs) =>
        fs.name.toLowerCase().includes(keyword) ||
        fs.email?.toLowerCase().includes(keyword) ||
        fs.description?.toLowerCase().includes(keyword)
    );
  }, [fundingSources, search]);

  return (
    <div className="mx-auto w-full lg:max-w-7xl md:max-w-3xl max-w-xs">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex lg:flex-row flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <Archive className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Sumber Dana Terhapus
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola dan pulihkan sumber dana yang dihapus
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900/50 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {totalItems} Funding Sources Terhapus
              </p>
            </div>
            <ButtonBack route="/funding-sources" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Trash2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Terhapus</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalItems}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <RotateCcw className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dapat Dipulihkan</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredFundingSources.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
              <Archive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Arsip Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
        {/* Search */}
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Cari funding source yang terhapus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {["No", "Nama", "Email", "Telepon", "Deskripsi", "Aksi"].map((head) => (
                    <TableCell
                      key={head}
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading && filteredFundingSources.length === 0 && (
                  <TableRow>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                          <Banknote className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {search ? "Data tidak ditemukan" : "Tidak ada funding sources terhapus"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {search ? "Coba kata kunci pencarian lain" : "Semua funding sources masih aktif"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading &&
                  filteredFundingSources.map((fs, index) => (
                    <TableRow
                      key={fs.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      {/* No */}
                      <TableCell className="px-6 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(currentPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>

                      {/* Nama */}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-xs font-semibold text-white shadow-lg shadow-blue-500/20">
                            {fs.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{fs.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {fs.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-6 py-4">
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {fs.email ?? (
                            <span className="italic text-gray-400">Tidak ada email</span>
                          )}
                        </span>
                      </TableCell>

                      {/* Telepon */}
                      <TableCell className="px-6 py-4">
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {fs.phone_number ?? (
                            <span className="italic text-gray-400">Tidak ada telepon</span>
                          )}
                        </span>
                      </TableCell>

                      {/* Deskripsi */}
                      <TableCell className="px-6 py-4">
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {fs.description ?? (
                            <span className="italic text-gray-400">Tidak ada deskripsi</span>
                          )}
                        </span>
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="px-6 py-4 text-center">
                        <RestoreFundingSource
                          fundingSourceId={fs.id}
                          onSuccess={() => fetchDeleted(currentPage)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between p-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Showing {(currentPage - 1) * perPage + 1} –{" "}
                  {Math.min(currentPage * perPage, totalItems)} of {totalItems}
                </span>
                <span className="text-gray-400">|</span>
                <span>{perPage} rows per page</span>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}