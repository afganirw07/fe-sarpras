"use client";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
import {
  Search,
  SquareArrowOutUpRight,
  ArrowDownToLine,
  Warehouse,
  Calendar,
  Receipt,
  CheckCircle2,
  Clock,
  Package,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { getTransactions, Transaction } from "@/lib/transaction";
import ActionButtonIn from "@/components/dialog/dialogTransaction/transactionIn/actionButton";
import Pagination from "../../Pagination";
import { getUsers } from "@/lib/user";
import { getRooms, Room } from "@/lib/warehouse";

export default function TableTransactionIn() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [room, setRooms] = useState<Room[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // semua data
const [transactions, setTransactions] = useState<Transaction[]>([]);        // halaman aktif


  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  

  useEffect(() => {
    getUsers().then(setUsers);
    getRooms().then((res) => setRooms(res.data));
  }, []);
const fetchTransactions = async (page = currentPage) => {
    try {
        setLoading(true);
        
        // Fetch halaman aktif untuk tabel
        const res = await getTransactions(page, limit);
        setTransactions(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.total);

        // Fetch semua data sekali untuk search/filter (hanya saat pertama kali)
        if (allTransactions.length === 0) {
            const all = await getTransactions(1, 9999);
            setAllTransactions(all.data);
        }
    } catch (e) {
        toast.error("Gagal mengambil transaksi");
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase();
    const source = search || filterType !== "all" || filterDate
        ? allTransactions  // ✅ pakai semua data saat ada filter/search
        : transactions;    // pakai halaman aktif kalau tidak ada filter

    return source.filter((trx) => {
        const matchSearch =
            !keyword ||
            trx.user_id.toLowerCase().includes(keyword) ||
            trx.in_type?.toLowerCase().includes(keyword) ||
            trx.status.toLowerCase().includes(keyword);

        const matchType =
            filterType === "all" ||
            trx.in_type?.toLowerCase().includes(filterType.toLowerCase());

        const matchDate = filterDate
            ? new Date(trx.transaction_date).toDateString() === filterDate.toDateString()
            : true;

        return matchSearch && matchType && matchDate;
    });
}, [transactions, allTransactions, search, filterType, filterDate]);

// Tambah state untuk client-side pagination saat filter aktif
const isFiltered = search || filterType !== "all" || filterDate;

// Client-side pagination untuk filtered results
const [filteredPage, setFilteredPage] = useState(1);
const filteredPerPage = limit;

// Reset filtered page saat filter berubah
useEffect(() => {
    setFilteredPage(1);
}, [search, filterType, filterDate]);

// Data yang ditampilkan di tabel
const displayedTransactions = useMemo(() => {
    if (!isFiltered) return transactions; // pakai backend pagination
    // client-side pagination dari filtered results
    const start = (filteredPage - 1) * filteredPerPage;
    return filteredTransactions.slice(start, start + filteredPerPage);
}, [isFiltered, transactions, filteredTransactions, filteredPage, filteredPerPage]);

const displayedTotalPages = isFiltered
    ? Math.ceil(filteredTransactions.length / filteredPerPage)
    : totalPages;

const displayedTotal = isFiltered ? filteredTransactions.length : totalItems;
const displayedPage = isFiltered ? filteredPage : currentPage;

const handlePageChange = (page: number) => {
    if (isFiltered) setFilteredPage(page);
    else setCurrentPage(page);
};

  const userMap = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const roomMap = useMemo(() => {
    return room.reduce((acc, r) => {
      acc[r.id] = r.name;
      return acc;
    }, {} as Record<string, string>);
  }, [room]);

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    if (s === "draft") return {
      class: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: <Package className="h-3.5 w-3.5" />,
    };
    if (s === "disetujui") return {
      class: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      icon: <Clock className="h-3.5 w-3.5" />,
    };
    if (s === "diterima") return {
      class: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
    return {
      class: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: <Package className="h-3.5 w-3.5" />,
    };
  };

  const getTypeConfig = (in_type: string) => {
    const t = in_type?.toLowerCase() ?? "";
    if (t.includes("Donasi") || t.includes("Donasi")) return {
      class: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      label: in_type,
    };
    return {
      class: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      label: in_type,
    };
  };

  const activeFilterCount = [filterType !== "all", filterDate !== undefined].filter(Boolean).length;

  const clearFilters = () => {
    setFilterType("all");
    setFilterDate(undefined);
  };

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-3xl lg:max-w-7xl">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

        {/* Search & Filter Bar */}
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Cari user, tipe, atau status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <PopoverRoot>
                <PopoverTrigger className={`h-9 rounded-xl border px-2 text-xs gap-1.5 inline-flex items-center
                  ${filterDate
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-gray-200 text-gray-500 bg-white dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {filterDate ? format(filterDate, "dd MMM yyyy", { locale: id }) : "Filter Tanggal"}
                  </div>
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

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9 w-36 rounded-xl border-gray-200 text-xs dark:border-white/10">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="Beli">Beli</SelectItem>
                  <SelectItem value="Donasi">Donasi</SelectItem>
                </SelectContent>
              </Select>

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
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {["No", "User", "Tipe", "Ruangan", "Tanggal", "Status", "Aksi"].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-200 ${
                        header === "No" ? "w-20 text-center" : "text-left"
                      }`}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <td colSpan={7} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Memuat data...</p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading && filteredTransactions.length === 0 && (
                  <TableRow>
                    <td colSpan={7} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                          <Receipt className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {search || activeFilterCount > 0 ? "Data tidak ditemukan" : "Tidak ada transaksi"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {search || activeFilterCount > 0 ? "Coba ubah filter pencarian" : "Tambahkan transaksi baru untuk memulai"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading && filteredTransactions.map((trx, index) => {
                  const statusConfig = getStatusConfig(trx.status);
                  const typeConfig = getTypeConfig(trx.in_type ?? trx.type);
                  return (
                    <TableRow
                      key={trx.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-2 py-4 text-center">
                        <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(currentPage - 1) * limit + index + 1}
                        </span>
                      </TableCell>

                      <TableCell className="px-2 py-4">
                        <span className="text-xs font-semibold text-gray-700 dark:text-white">
                          {userMap[trx.user_id] ?? "Loading..."}
                        </span>
                      </TableCell>

                      <TableCell className="px-2 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${typeConfig.class}`}>
                          <ArrowDownToLine className="h-3 w-3" />
                          {typeConfig.label}
                        </span>
                      </TableCell>

                      <TableCell className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {roomMap[trx.detail_items?.[0]?.room_id] ?? "Loading..."}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {new Date(trx.transaction_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-2 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${statusConfig.class}`}>
                          {statusConfig.icon}
                          {trx.status}
                        </span>
                      </TableCell>

                      <TableCell className="flex justify-center gap-2 px-2 py-4 text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/dashboard/transaction-in/show/${trx.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg border-gray-200 p-4 text-xs hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                              >
                                <SquareArrowOutUpRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Lihat detail transaksi</TooltipContent>
                        </Tooltip>

                        <ActionButtonIn
                          key={trx.id}
                          transaction={trx}
                          onSuccess={fetchTransactions}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

{displayedTotalPages > 1 && (
    <div className="flex justify-between p-4">
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>
                Showing {(displayedPage - 1) * limit + 1} –{" "}
                {Math.min(displayedPage * limit, displayedTotal)} of {displayedTotal}
            </span>
            <span>{limit} rows per page</span>
        </div>
        <Pagination
            currentPage={displayedPage}
            totalPages={displayedTotalPages}
            onPageChange={handlePageChange}
        />
    </div>
)}
        </div>
      </div>
    </div>
  );
}