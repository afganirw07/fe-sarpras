"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/tables/Pagination";
import { api } from "@/lib/api";

type DetailItem = {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  room: { name: string };
  transaction: { po_number: string };
  item: {
    name: string;
    category: { name: string };
    subcategory: { name: string };
  };
  userId: { username: string };
};

function ConditionBadge({ condition }: { condition: string }) {
  const map: Record<string, string> = {
    Baik: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    Sedang: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Buruk: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold ${map[condition] ?? "border-gray-200 bg-gray-50 text-gray-600"}`}>
      {condition ?? "—"}
    </span>
  );
}

export default function TableTransactionReturn({
  refreshKey,
  onSearchChange,
}: {
  refreshKey?: number;
  onSearchChange?: (val: string) => void;
}) {
  const [data, setData] = useState<DetailItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const perPage = 10;

  const fetchData = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await api(
        `/api/detail-items?status=Dipinjam&page=${page}&limit=${perPage}`
      );
      setData(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setTotalData(res.pagination?.total ?? 0);
    } catch {
      toast.error("Gagal memuat data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, refreshKey]);

  useEffect(() => {
    onSearchChange?.(search);
  }, [search]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return data;
    return data.filter((d) =>
      d.item?.name?.toLowerCase().includes(q) ||
      d.transaction?.po_number?.toString().toLowerCase().includes(q) ||
      d.userId?.username?.toLowerCase().includes(q) ||
      d.room?.name?.toLowerCase().includes(q) ||
      d.serial_number?.toLowerCase().includes(q)
    );
  }, [search, data]);

  const tableHeaders = [
    { label: "No", className: "w-16 text-center" },
    { label: "Nomor Surat" },
    { label: "Item" },
    { label: "Nomor Serial" },
    { label: "Ruangan" },
    { label: "Kondisi" },
    { label: "Pengguna" },
  ];

  const renderLoading = () => (
    <TableRow>
      <td colSpan={tableHeaders.length} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </td>
    </TableRow>
  );

  const renderEmpty = () => (
    <TableRow>
      <td colSpan={tableHeaders.length} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {search ? "Data tidak ditemukan" : "Belum ada data return"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {search ? "Coba kata kunci lain" : "Tambahkan transaksi return baru"}
          </p>
        </div>
      </td>
    </TableRow>
  );

  return (
    <div className="mx-auto w-full max-w-md md:max-w-2xl lg:max-w-7xl">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

        {/* Search Bar */}
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Cari item, PO number, user, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {tableHeaders.map((h, i) => (
                    <TableCell
                      key={i}
                      isHeader
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50 px-2 py-4 text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${h.className ?? "text-left"}`}
                    >
                      {h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && renderLoading()}
                {!loading && filteredRows.length === 0 && renderEmpty()}
                {!loading && filteredRows.map((d, index) => (
                  <TableRow
                    key={d.id}
                    className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    {/* No */}
                    <TableCell className="px-2 py-4 text-center">
                      <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                        {(currentPage - 1) * perPage + index + 1}
                      </span>
                    </TableCell>

                    {/* PO Number */}
                    <TableCell className="px-2 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        #{d.transaction?.po_number ?? "—"}
                      </span>
                    </TableCell>

                    {/* Item */}
                    <TableCell className="px-2 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {d.item?.name ?? "—"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {d.item?.category?.name} · {d.item?.subcategory?.name}
                        </p>
                      </div>
                    </TableCell>

                    {/* Serial Number */}
                    <TableCell className="px-2 py-4">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {d.serial_number}
                      </span>
                    </TableCell>

                    {/* Room */}
                    <TableCell className="px-2 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {d.room?.name ?? "—"}
                      </span>
                    </TableCell>

                    {/* Kondisi */}
                    <TableCell className="px-2 py-4">
                      <ConditionBadge condition={d.condition} />
                    </TableCell>

                    {/* User */}
                    <TableCell className="px-2 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-white/10 dark:text-gray-300">
                          {(d.userId?.username ?? "?").charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {d.userId?.username ?? "—"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200/50 p-4 dark:border-white/5 md:flex-row">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalData)} of {totalData}
              </span>
              <span className="text-gray-400">|</span>
              <span>{perPage} rows per page</span>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </div>
  );
}