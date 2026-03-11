"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import { Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { getPurgings, Purging } from "@/lib/purging";
import Pagination from "../../Pagination";
import ActionButtonsPemutihan from "@/components/dialog/dialogPemutihan/dialogActionPemutihan";

export default function TablePemutihan({
  onStatsUpdate,
}: {
  onStatsUpdate?: (stats: {
    totalDeleted: number;
    totalJenis: number;
    totalKategori: number;
  }) => void;
}) {
  const [purgingItems, setPurgingItems] = useState<Purging[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;

  const fetchPurgings = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await getPurgings(page, perPage);

      if (response?.data && Array.isArray(response.data)) {
        setPurgingItems(response.data);

        const total = response.pagination?.total || response.data.length;
        const pages = response.pagination?.totalPages || 1;
        setTotalPages(pages);
        setTotalItems(total);

        const uniqueJenis = new Set(
          response.data.map((d) => d.item_name).filter(Boolean)
        );
        const uniqueKategori = new Set(
          response.data.map((d) => d.category).filter(Boolean)
        );

        onStatsUpdate?.({
          totalDeleted: total,
          totalJenis: uniqueJenis.size,
          totalKategori: uniqueKategori.size,
        });
      } else {
        setPurgingItems([]);
        onStatsUpdate?.({ totalDeleted: 0, totalJenis: 0, totalKategori: 0 });
      }
    } catch (error) {
      toast.error("Gagal ambil data purging");
      setPurgingItems([]);
      onStatsUpdate?.({ totalDeleted: 0, totalJenis: 0, totalKategori: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurgings(currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleChecked = (id: string, checked: boolean) => {
  setSelectedIds(prev => {
    const next = new Set(prev);
    checked ? next.add(id) : next.delete(id);
    return next;
  });
};

  const filteredRows = useMemo(() => {
    if (!Array.isArray(purgingItems)) return [];
    const keyword = search.toLowerCase();
    return purgingItems.filter((item) => {
      const itemName = item?.item_name ?? "-";
      const category = item?.category ?? "-";
      const condition = item?.condition ?? "-";
      const itemStatus = item?.item_status ?? "-";

      return (
        itemName.toLowerCase().includes(keyword) ||
        category.toLowerCase().includes(keyword) ||
        condition.toLowerCase().includes(keyword) ||
        itemStatus.toLowerCase().includes(keyword)
      );
    });
  }, [search, purgingItems]);

  const tableHeaders = [
    { label: "No", className: "w-20 text-center" },
    { label: "Serial Number" },
    { label: "Nama" },
    { label: "Kategori" },
    { label: "Kondisi" },
    { label: "Status" },
    { label: "Status Surat" }, 
    { label: "Aksi", className: "w-32 text-center" },
  ];

  const renderEmptyState = (message: string, description: string) => (
    <TableRow>
      <td colSpan={8} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </td>
    </TableRow>
  );

  const renderLoadingState = () => (
    <TableRow>
      <td colSpan={7} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat data...
          </p>
        </div>
      </td>
    </TableRow>
  );

  return (
    <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-md mx-auto">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

        {/* Search Bar + Generate Surat */}
        <div className="flex justify-between items-center border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Cari berdasarkan nama, kategori, kondisi, atau status..."
              value={search}
              onChange={handleSearch}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <button
            type="button"
            className="
              inline-flex items-center gap-2
              rounded-xl border border-blue-500
              bg-blue-600
              px-5 py-2.5
              text-sm font-semibold text-white
              shadow-md shadow-blue-500/25
              transition-all duration-200
              hover:from-blue-600 hover:to-blue-700
              hover:shadow-lg hover:shadow-blue-500/30
              active:translate-y-0 active:shadow-sm
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
              dark:from-blue-600 dark:to-blue-700
              dark:hover:from-blue-500 dark:hover:to-blue-600
              whitespace-nowrap ml-4
            "
          >
            <FileText size={16} />
            Generate Surat
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {tableHeaders.map((header, index) => (
                    <TableCell
                      key={index}
                      isHeader
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50 px-2 py-4 text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${
                        header.className || "text-left"
                      }`}
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && renderLoadingState()}

                {!loading &&
                  filteredRows.length === 0 &&
                  renderEmptyState(
                    "Data tidak ditemukan",
                    "Coba kata kunci pencarian lain"
                  )}

                {!loading &&
                  filteredRows.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      {/* No */}
                      <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-[clamp(10px,0.7rem,10px)] font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300 mx-auto">
                          {(currentPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>

                      {/* Serial Number */}
                      <TableCell className="px-2 py-4">
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {item.serial_number ?? "-"}
                        </span>
                      </TableCell>

                      {/* Nama Barang */}
                      <TableCell className="px-2 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.item_name ?? "-"}
                        </p>
                      </TableCell>

                      {/* Kategori */}
                      <TableCell className="px-2 py-4">
                        <p className="inline-block rounded-lg border border-green-200 bg-lime-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 truncate max-w-35">
                          {item.category ?? "-"}
                        </p>
                      </TableCell>

                      {/* Kondisi */}
                      <TableCell className="px-2 py-4">
                        <span className="inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold truncate max-w-35 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                          {item.condition ?? "-"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-2 py-4">
                        <span className="inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold truncate max-w-35 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                          {item.item_status ?? "-"}
                        </span>
                      </TableCell>

                      {/* Status Surat */}
                        <TableCell className="px-2 py-4">
                          <span className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold truncate max-w-35 ${
                            item.letter_status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                              : item.letter_status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                          }`}>
                            {item.letter_status ?? "-"}
                          </span>
                        </TableCell>
                          
                      {/* Action */}
                      <TableCell className="px-2 py-4 text-center">
                        <ActionButtonsPemutihan
                        detailItem={item}
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={handleChecked}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200/50 dark:border-white/5">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
  );
}