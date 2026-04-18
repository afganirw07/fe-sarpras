"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import { Search, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { getItems, Item, DetailItem } from "@/lib/items";
import ActionButtonsItems from "@/components/dialog/dialogItems/dialogActionButtonsItems";
import Pagination from "../../Pagination";
import DialogFilterItems, { FilterState } from "@/components/dialog/dialogItems/dialogFilterItem";
import { getDetailItemsFiltered, getAllDetailItemsFiltered } from "@/lib/items";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

type ItemStats = {
  totalItems: number;
  totalStock: number;
  totalCategories: number;
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Kondisi badge   
const CONDITION_CONFIG: Record<string, { label: string; className: string }> = {
  good: {
    label: "Good",
    className:
      "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400",
  },
  fair: {
    label: "Fair",
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  },
  poor: {
    label: "Poor",
    className:
      "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400",
  },
};

function ConditionBadge({ condition }: { condition: string }) {
  const cfg = CONDITION_CONFIG[condition?.toLowerCase()] ?? {
    label: condition ?? "-",
    className: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

export default function TableItems({
  onStatsUpdate,
}: {
  onStatsUpdate?: (stats: ItemStats) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;

  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({ condition: "", period: null });

  const [detailItems, setDetailItems] = useState<DetailItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailPage, setDetailPage] = useState(1);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [detailTotal, setDetailTotal] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const DETAIL_PER_PAGE = 10;

  const activeFilterCount = (filter.condition ? 1 : 0) + (filter.period ? 1 : 0);


  const fetchItemsFnRef = useRef<(page?: number) => Promise<void>>();

  const fetchItems = useCallback(
    async (page?: number) => {
      const targetPage = page ?? currentPage;
      try {
        setLoading(true);
        const response = await getItems(targetPage, perPage);

        if (response?.data && Array.isArray(response.data)) {
          setItems(response.data);
          const total = response.pagination?.total || response.data.length;
          const pages = response.pagination?.totalPages || 1;
          setTotalPages(pages);
          setTotalItems(total);

          const uniqueCategories = new Set(
            response.data.map((item) => item.category_id).filter(Boolean)
          );
          onStatsUpdate?.({
            totalItems: total,
            totalStock: response.data.reduce((s, i) => s + (i.stock || 0), 0),
            totalCategories: uniqueCategories.size,
          });
        } else {
          setItems([]);
          onStatsUpdate?.({ totalItems: 0, totalStock: 0, totalCategories: 0 });
        }
      } catch {
        toast.error("Gagal ambil data items");
        setItems([]);
        onStatsUpdate?.({ totalItems: 0, totalStock: 0, totalCategories: 0 });
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage]
  );

  // Selalu simpan versi terbaru fetchItems ke ref
  // Ini yang dipakai oleh ActionButtonsItems lewat onSuccess
  fetchItemsFnRef.current = fetchItems;

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  // ── FIX 2: Satu useEffect untuk detail items ──────────────────────────────
  // Sebelumnya ada 2 useEffect terpisah (filter & detailPage) yang menyebabkan
  // race condition: filter berubah → reset detailPage ke 1 → useEffect ke-2
  // langsung jalan sebelum reset selesai → fetch ganda / data void
  const prevFilterRef = useRef<FilterState>(filter);

  useEffect(() => {
    const isFilterChange = prevFilterRef.current !== filter;
    prevFilterRef.current = filter;

    // Jika filter berubah, paksa kembali ke page 1
    // Jika hanya detailPage berubah, fetch page tersebut
    const targetPage = isFilterChange ? 1 : detailPage;

    if (isFilterChange) {
      setDetailPage(1);
    }

    // Jika tidak ada filter aktif, kosongkan detail table
    if (!filter.condition && !filter.period) {
      setDetailItems([]);
      setDetailTotal(0);
      setDetailTotalPages(1);
      return;
    }

    const fetchDetail = async () => {
      setDetailLoading(true);
      try {
        const res = await getDetailItemsFiltered({
          condition: filter.condition || undefined,
          periodMonths: filter.period,
          page: targetPage,
          limit: DETAIL_PER_PAGE,
        });
        setDetailItems(res.data ?? []);
        setDetailTotal(res.pagination?.total ?? 0);
        setDetailTotalPages(res.pagination?.totalPages ?? 1);
      } catch {
        toast.error("Gagal memuat detail item.");
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [filter, detailPage]);

  // ── FIX 3: Clear filter juga refetch master table ─────────────────────────
  // Sebelumnya saat filter di-clear, master table bisa tampak kosong karena
  // tidak ada trigger ulang untuk fetchItems
  const handleClearFilter = useCallback(() => {
    setFilter({ condition: "", period: null });
    // Paksa refetch master table dengan page saat ini
    fetchItemsFnRef.current?.(currentPage);
  }, [currentPage]);

  // ── Filter master item (client-side search) ──────────────────────────────
  const filteredRows = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const keyword = search.toLowerCase();
    return items.filter((item) => {
      const categoryName = item.category?.name || "";
      const subcategoryName = item.subcategory?.name || "";
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        (item.brand && item.brand.toLowerCase().includes(keyword)) ||
        categoryName.toLowerCase().includes(keyword) ||
        subcategoryName.toLowerCase().includes(keyword)
      );
    });
  }, [search, items]);

  // ── Export Excel ─────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const allItems = await getAllDetailItemsFiltered({
        condition: filter.condition || undefined,
        periodMonths: filter.period,
      });

      if (!allItems.length) {
        toast.error("Tidak ada data untuk di export");
        return;
      }

      const rows = allItems.map((d, i) => ({
        No: i + 1,
        Kategori: d.item?.category?.name ?? "-",
        SubKategori: d.item?.subcategory?.name ?? "-",
        "Nama Item": d.item?.name ?? "-",
        "Serial Number": d.serial_number,
        Kondisi: d.condition,
        "Rusak pada": formatDate(d.updated_at),
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
        fill: { fgColor: { rgb: "DC2626" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "CCCCCC" } },
          bottom: { style: "thin", color: { rgb: "CCCCCC" } },
          left: { style: "thin", color: { rgb: "CCCCCC" } },
          right: { style: "thin", color: { rgb: "CCCCCC" } },
        },
      };

      const headers = Object.keys(rows[0]);
      headers.forEach((_, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
        if (worksheet[cellAddress]) worksheet[cellAddress].s = headerStyle;
      });

      worksheet["!cols"] = headers.map((key) => ({
        wch:
          Math.max(key.length, ...rows.map((r) => String((r as any)[key] ?? "").length)) + 4,
      }));
      worksheet["!rows"] = [{ hpt: 28 }];

      const condLabel = filter.condition ? `_${filter.condition}` : "";
      const periodLabel = filter.period ? `_${filter.period}bln` : "";
      const fileName = `detail-item${condLabel}${periodLabel}_${new Date()
        .toLocaleDateString("id-ID")
        .replace(/\//g, "-")}`;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, "Detail Item");
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${fileName}.xlsx`
      );
      toast.success(`${allItems.length} item berhasil di-export`);
    } catch {
      toast.error("Gagal export Excel.");
    } finally {
      setExportLoading(false);
    }
  };

  // ── Table headers ────────────────────────────────────────────────────────
  const tableHeaders = [
    { label: "No", className: "w-20 text-center" },
    { label: "Kode" },
    { label: "Nama" },
    { label: "Merek" },
    { label: "Stok Rusak (Poor)", className: "text-center" },
    { label: "Kategori" },
    { label: "Sub Kategori" },
    { label: "Unit" },
    { label: "Action", className: "w-32" },
  ];

  const renderEmptyState = (msg: string, desc: string) => (
    <TableRow>
      <td colSpan={9} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{msg}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
      </td>
    </TableRow>
  );

  const renderLoading = (cols: number) => (
    <TableRow>
      <td colSpan={cols} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
        </div>
      </td>
    </TableRow>
  );

  return (
    <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-md mx-auto flex flex-col gap-6">

      {/* ── Tabel Master Item ── */}
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

        {/* Toolbar */}
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari berdasarkan nama, kode, atau merek..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            {/* Filter + Export */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-blue-500"
              >
                <Filter size={16} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={exportLoading}
                className="flex items-center gap-2 rounded-xl border bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-900 disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white"
              >
                {exportLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                ) : (
                  <Download size={16} />
                )}
                Export Excel
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
                    filtered
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">Filter aktif:</span>
              {filter.condition && (
                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  Kondisi: {filter.condition}
                </span>
              )}
              {filter.period && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {filter.period} Bulan Terakhir
                </span>
              )}
              {/* FIX 3: Gunakan handleClearFilter bukan setFilter langsung */}
              <button
                type="button"
                onClick={handleClearFilter}
                className="text-xs font-semibold text-gray-400 underline hover:text-gray-600 dark:hover:text-gray-200"
              >
                Hapus semua
              </button>
            </div>
          )}
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
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50 px-2 py-4 text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${
                        h.className || "text-left"
                      }`}
                    >
                      {h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && renderLoading(9)}
                {!loading &&
                  filteredRows.length === 0 &&
                  renderEmptyState("Data tidak ditemukan", "Coba kata kunci pencarian lain")}
                {!loading &&
                  filteredRows.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-2 py-4 text-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300 mx-auto">
                          {(currentPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 py-4">
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {item.code}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      </TableCell>
                      <TableCell className="px-2 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.brand || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="px-2 py-4 text-center">
                        {/* FIX 1: Pass fetchItemsFnRef.current agar tidak stale */}
                        <PoorStockCell itemId={item.id} />
                      </TableCell>
                      <TableCell className="px-2 py-4">
                        <p className="inline-block rounded-lg border border-green-200 bg-lime-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 truncate max-w-35">
                          {item.category?.name || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="px-2 py-4">
                        <span className="inline-block rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 truncate max-w-35">
                          {item.subcategory?.name || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.unit}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 py-4 text-center">
                        {/*
                         * FIX 1: Gunakan arrow function yang membaca ref saat dipanggil,
                         * bukan saat render — ini mencegah stale closure
                         */}
                        <ActionButtonsItems
                          item={item}
                          onSuccess={() => fetchItemsFnRef.current?.(currentPage)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200/50 dark:border-white/5">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {(currentPage - 1) * perPage + 1}–
                {Math.min(currentPage * perPage, totalItems)} of {totalItems}
              </span>
              <span className="text-gray-400">|</span>
              <span>{perPage} rows per page</span>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* ── Tabel Detail Item (muncul saat ada filter aktif) ── */}
      {activeFilterCount > 0 && (
        <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="border-b border-gray-200/50 px-6 py-4 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                  Hasil Filter Detail Item
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {detailLoading ? "Memuat..." : `${detailTotal} item ditemukan`}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {[
                    "No",
                    "Kategori",
                    "Sub Kategori",
                    "Nama Item",
                    "Serial Number",
                    "Kondisi",
                    "Rusak pada",
                  ].map((h, i) => (
                    <TableCell
                      key={i}
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailLoading && renderLoading(7)}
                {!detailLoading && detailItems.length === 0 && (
                  <TableRow>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                      Tidak ada data sesuai filter
                    </td>
                  </TableRow>
                )}
                {!detailLoading &&
                  detailItems.map((d, idx) => (
                    <TableRow
                      key={d.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-4 py-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(detailPage - 1) * DETAIL_PER_PAGE + idx + 1}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="inline-block rounded-lg border border-green-200 bg-lime-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {d.item?.category?.name ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="inline-block rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          {d.item?.subcategory?.name ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {d.item?.name ?? "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {d.serial_number}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <ConditionBadge condition={d.condition} />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(d.updated_at)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {detailTotalPages > 1 && (
            <div className="border-t border-gray-200/50 p-4 dark:border-white/5">
              <Pagination
                currentPage={detailPage}
                totalPages={detailTotalPages}
                onPageChange={setDetailPage}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Modal Filter ── */}
      <DialogFilterItems
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filter={filter}
        onApply={setFilter}
      />
    </div>
  );
}

// ── PoorStockCell ─────────────────────────────────────────────────────────────
// Sudah benar (cancelled flag mencegah set state setelah unmount)
function PoorStockCell({ itemId }: { itemId: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/items").then(({ getPoorStockByItemId }) => {
      getPoorStockByItemId(itemId).then((n) => {
        if (!cancelled) setCount(n);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (count === null) {
    return (
      <span className="flex items-center justify-center">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-red-500" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-bold ${
        count > 0
          ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          : "bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500"
      }`}
    >
      {count}
    </span>
  );
}