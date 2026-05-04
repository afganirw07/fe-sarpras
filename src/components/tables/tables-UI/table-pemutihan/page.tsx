"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, X } from "lucide-react";
import { Search, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPurgings, generateSuratPemutihan, Purging } from "@/lib/purging";
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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false); // ← loading state generate
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
        const uniqueJenis = new Set(response.data.map((d) => d.item_name).filter(Boolean));
        const uniqueKategori = new Set(response.data.map((d) => d.category).filter(Boolean));
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

  // ── Generate surat untuk semua ID yang dipilih ──
  const handleGenerateSurat = async () => {
    if (selectedIds.size === 0) return;

    setGenerating(true);
    const ids = Array.from(selectedIds);
    let successCount = 0;
    let failCount = 0;

    for (const id of ids) {
      try {
        await generateSuratPemutihan(id);
        successCount++;

        // Update letter_status di local state → 'done'
        setPurgingItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, letter_status: 'done' } : item
          )
        );

        // Hapus dari selectedIds
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

      } catch (error) {
        failCount++;
        toast.error(`Gagal generate surat untuk ID: ${id}`);
      }
    }

    setGenerating(false);

    if (successCount > 0) {
      toast.success(`${successCount} surat berhasil di-generate`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} surat gagal di-generate`);
    }
  };

const filteredRows = useMemo(() => {
  if (!Array.isArray(purgingItems)) return [];
  const keyword = search.toLowerCase();
  return purgingItems.filter((item) => {
    const matchSearch =
      (item?.item_name ?? "").toLowerCase().includes(keyword) ||
      (item?.category ?? "").toLowerCase().includes(keyword) ||
      (item?.condition ?? "").toLowerCase().includes(keyword) ||
      (item?.item_status ?? "").toLowerCase().includes(keyword);

    const matchStatus =
      filterStatus === "all" || item.letter_status === filterStatus;

    const matchDate = filterDate
      ? new Date(item.created_at).toDateString() === filterDate.toDateString()
      : true;

    return matchSearch && matchStatus && matchDate;
  });
}, [search, purgingItems, filterStatus, filterDate]);

const activeFilterCount = [
  filterStatus !== "all",
  filterDate !== undefined
].filter(Boolean).length;

const clearFilters = () => {
  setFilterStatus("all");
  setFilterDate(undefined);
};

const tableHeaders = [
  { label: "No", className: "w-20 text-center" },
  { label: "Dibuat Tanggal" }, 
  // { label: "Pengguna" },         
  { label: "Nama Barang" },         
  { label: "Kategori" },
  { label: "Kondisi" },
  { label: "Status" },
  { label: "Status Surat" },
  { label: "Aksi", className: "w-32 text-center" },
];

function formatTanggal(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getConditionBadge(condition: string) {
  switch (condition) {
    case 'Bail':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    case 'Sedang':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    case 'Buruk':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
  }
}

  const renderEmptyState = (message: string, description: string) => (
    <TableRow>
      <td colSpan={8} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </td>
    </TableRow>
  );

  const renderLoadingState = () => (
    <TableRow>
      <td colSpan={8} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
        </div>
      </td>
    </TableRow>
  );

  return (
    <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-md mx-auto">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

          {/* Search Bar + Filter + Generate Surat */}
          <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Cari berdasarkan nama, kategori, kondisi..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              {/* Filter + Generate */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* Filter Tanggal */}
                <PopoverRoot>
                  <PopoverTrigger className={`h-9 rounded-xl border px-3 text-xs gap-1.5 flex items-center
                    ${filterDate
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "border-gray-200 text-gray-500 bg-white dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {filterDate ? format(filterDate, "dd MMM yyyy", { locale: id }) : "Filter Tanggal"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 h-auto">
                    <CalendarComponent
                      mode="single"
                      selected={filterDate}
                      onSelect={(date) => setFilterDate(date ?? undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </PopoverRoot>
                  
                {/* Filter Status Surat */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9 w-36 rounded-xl border-gray-200 text-xs dark:border-white/10">
                    <SelectValue placeholder="Status Surat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                  
                {/* Reset Filter */}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 rounded-xl text-xs text-gray-500 hover:text-red-500"
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Reset
                    <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      {activeFilterCount}
                    </span>
                  </Button>
                )}

                {/* Tombol Generate Surat */}
                <button
                  type="button"
                  onClick={handleGenerateSurat}
                  disabled={selectedIds.size === 0 || generating}
                  className={`
                    inline-flex items-center gap-2
                    rounded-xl border
                    px-5 py-2.5
                    text-sm font-semibold
                    shadow-md
                    transition-all duration-200
                    focus:outline-none focus:ring-4
                    whitespace-nowrap
                    ${selectedIds.size === 0 || generating
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                      : 'border-blue-500 bg-blue-600 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 focus:ring-blue-500/20'
                    }
                  `}
                >
                  {generating
                    ? <Loader2 size={16} className="animate-spin" />
                    : <FileText size={16} />
                  }
                  {generating
                    ? `Generating... (${selectedIds.size})`
                    : selectedIds.size > 0
                      ? `Generate Surat (${selectedIds.size})`
                      : 'Generate Surat'
                  }
                </button>
              </div>
            </div>
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
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50 px-2 py-4 text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${header.className || "text-left"}`}
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && renderLoadingState()}
                {!loading && filteredRows.length === 0 && renderEmptyState("Data tidak ditemukan", "Coba kata kunci pencarian lain")}

                {!loading && filteredRows.map((item, index) => (
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

                    {/* created at */}
                    <TableCell className="px-2 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                         {formatTanggal(item.created_at)}
                      </span>
                    </TableCell>

                    {/* Nama Barang */}
                    <TableCell className="px-2 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{item.item_name ?? "-"}</p>
                      {/* <p className="font-medium text-gray-900 dark:text-white">{item.createdBy?.username ?? '-'}</p> */}
                    </TableCell>

                    {/* Kategori */}
                    <TableCell className="px-2 py-4">
                      <p className="inline-block rounded-lg border border-green-200 bg-lime-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 truncate max-w-35">
                        {item.category ?? "-"}
                      </p>
                    </TableCell>

                    {/* Kondisi */}
                    <TableCell className="px-2 py-4">
                      <span className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold truncate max-w-35 ${getConditionBadge(item.condition)} `}>
                        {item.condition ?? "-"}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-2 py-4">
                      <span className="inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold truncate max-w-35 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                        {item.item_status ?? "-"}
                      </span>
                    </TableCell>

                    {/* Status Surat ── badge hijau jika done */}
                    <TableCell className="px-2 py-4">
                      <span className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold truncate max-w-35 ${
                        item.letter_status === 'done'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                      }`}>
                        {item.letter_status ?? "-"}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="px-2 py-4 text-center">
                      <ActionButtonsPemutihan
                        detailItem={item}
                        showCheckbox={item.letter_status != null}
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