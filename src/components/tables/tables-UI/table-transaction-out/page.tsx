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
import { Search, SquareArrowOutUpRight, Calendar, X } from "lucide-react";
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
import ActionButtonLoan from "@/components/dialog/dialogTransaction/transaction-out/actionButton";
import Link from "next/link";
import { Button } from "../../../ui/button";
import { getLoanRequests, LoanRequest, LoanDetailItem } from "@/lib/loan-request";
import { getRooms, Room } from "@/lib/warehouse";
import Pagination from "../../Pagination";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    },
    approved: {
      label: "Approved",
      cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    returned: {
      label: "Returned",
      cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
  };
  const s = map[status] ?? {
    label: status,
    cls: "bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[clamp(9px,0.65rem,11px)] font-semibold ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

export default function TableTransactionOut() {
  const [data, setData] = useState<LoanRequest[]>([]);
  const [allData, setAllData] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const perPage = 10;

  // Rooms untuk roomMap
  const [rooms, setRooms] = useState<Room[]>([]);

  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  // ── roomMap: room_id → room name ──────────────────────────────────────────
  const roomMap = useMemo(() => {
    return rooms.reduce((acc, r) => {
      acc[r.id] = r.name;
      return acc;
    }, {} as Record<string, string>);
  }, [rooms]);

  // ── Helper: ambil semua item names join koma ──────────────────────────────
  const getItemNames = (items: LoanDetailItem[]): string => {
    if (!items || items.length === 0) return "-";
    return items.map((d) => d.item?.name ?? "-").join(", ");
  };

  // ── Helper: ambil semua room names join koma ──────────────────────────────
  const getRoomNames = (items: LoanDetailItem[]): string => {
    if (!items || items.length === 0) return "-";
    // unique room names saja
    const names = [...new Set(items.map((d) => roomMap[d.room_id] ?? d.room?.name ?? "-"))];
    return names.join(", ");
  };

  // ── Helper: semua serial numbers join koma ────────────────────────────────
  const getSerialNumbers = (items: LoanDetailItem[]): string => {
    if (!items || items.length === 0) return "-";
    return items.map((d) => d.serial_number).join(", ");
  };

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getLoanRequests(page, perPage);
      setData(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setTotalData(res.pagination?.total ?? 0);

      // Fetch semua data sekali untuk search/filter
      if (allData.length === 0) {
        const all = await getLoanRequests(1, 9999);
        setAllData(all.data ?? []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        setRooms(res.data ?? []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Tentukan apakah sedang dalam mode filter/search
  const isFiltered = search || filterStatus !== "all" || filterDate;

  // Client-side pagination untuk filtered results
  const [filteredPage, setFilteredPage] = useState(1);

  // Reset halaman saat filter berubah
  useEffect(() => {
    setFilteredPage(1);
  }, [search, filterStatus, filterDate]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    const source = isFiltered ? allData : data;

    return source.filter((trx) => {
      // const itemNames    = getItemNames(trx.item).toLowerCase();
      const serialNums   = getSerialNumbers(trx.item).toLowerCase();
      const roomNames    = getRoomNames(trx.item).toLowerCase();

      const matchSearch =
        !q ||
        trx.id.toLowerCase().includes(q) ||
        trx.status.toLowerCase().includes(q) ||
        (trx.user?.username ?? trx.user_id).toLowerCase().includes(q) ||
        // itemNames.includes(q) ||
        serialNums.includes(q) ||
        roomNames.includes(q);

      const matchStatus =
        filterStatus === "all" ||
        trx.status.toLowerCase() === filterStatus.toLowerCase();

      const matchDate = filterDate
        ? new Date(trx.borrow_date).toDateString() === filterDate.toDateString()
        : true;

      return matchSearch && matchStatus && matchDate;
    });
  }, [data, allData, search, filterStatus, filterDate, isFiltered, roomMap]);

  // Data yang tampil di tabel (dengan client-side pagination saat filter aktif)
  const displayedData = useMemo(() => {
    if (!isFiltered) return data;
    const start = (filteredPage - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [isFiltered, data, filteredData, filteredPage, perPage]);

  const displayedTotalPages = isFiltered
    ? Math.ceil(filteredData.length / perPage)
    : totalPages;

  const displayedTotal   = isFiltered ? filteredData.length : totalData;
  const displayedPage    = isFiltered ? filteredPage : currentPage;

  const handlePageChange = (page: number) => {
    if (isFiltered) setFilteredPage(page);
    else setCurrentPage(page);
  };

  const activeFilterCount = [
    filterStatus !== "all",
    filterDate !== undefined,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterDate(undefined);
  };

  return (
    <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-xs">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 border-b border-gray-200/50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Cari item, user, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tanggal */}
            <PopoverRoot>
              <PopoverTrigger
                className={`h-9 rounded-xl border px-2 text-[clamp(8px,0.7rem,10px)] gap-1.5 inline-flex items-center
                  ${filterDate
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-gray-200 text-gray-500 bg-white dark:border-white/10 dark:bg-white/5"
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {filterDate
                    ? format(filterDate, "dd MMM yyyy", { locale: id })
                    : "Filter Tanggal"}
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

            {/* Filter Status */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 w-36 rounded-xl border-gray-200 text-xs dark:border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filter */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 rounded-xl text-[clamp(8px,0.7rem,8px)] text-gray-500 hover:text-red-500"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Reset
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[clamp(8px,0.7rem,8px)] text-white">
                  {activeFilterCount}
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {[
                    { label: "No",          cls: "w-16" },
                    { label: "ID",          cls: "" },
                    { label: "User",        cls: "" },
                    // { label: "Item",        cls: "" },
                    // { label: "Serial No",   cls: "" },
                    { label: "Warehouse",   cls: "" },
                    { label: "Borrow Date", cls: "" },
                    { label: "Return Date", cls: "" },
                    { label: "Status",      cls: "" },
                    { label: "Aksi",        cls: "w-36 text-center" },
                  ].map((h) => (
                    <TableCell
                      key={h.label}
                      isHeader
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50 px-[clamp(10px,1vw,16px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(8px,0.7rem,8px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${h.cls}`}
                    >
                      {h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <td colSpan={10} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                      </div>
                    </td>
                  </TableRow>
                ) : displayedData.length === 0 ? (
                  <TableRow>
                    <td colSpan={10} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {search || activeFilterCount > 0 ? "Data tidak ditemukan" : "Tidak ada transaksi"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {search || activeFilterCount > 0
                            ? "Coba ubah filter pencarian"
                            : "Tambahkan transaksi baru untuk memulai"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  displayedData.map((trx, index) => (
                    <TableRow
                      key={trx.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      {/* No */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(displayedPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>

                      {/* ID */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-[clamp(9px,0.65rem,11px)] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {trx.id.slice(0, 4)}…
                        </span>
                      </TableCell>

                      {/* User */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="bg-linear-to-br flex h-6 w-6 shrink-0 items-center justify-center rounded-lg from-blue-500 to-blue-600 text-[clamp(8px,0.7rem,8px)] font-semibold text-white shadow-lg shadow-blue-500/20">
                            {(trx.user?.username ?? trx.user_id).charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[clamp(10px,0.7rem,13px)] text-gray-700 dark:text-gray-300">
                            {trx.user?.username ?? trx.user_id.slice(0, 8) + "…"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Item — semua nama join koma
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <span className="text-[clamp(6px,0.7rem,8px)] font-medium text-gray-800 dark:text-gray-200">
                          {getItemNames(trx.item)}
                        </span>
                      </TableCell> */}

                      {/* Serial No — semua join koma
                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="font-mono text-[clamp(9px,0.65rem,11px)] text-gray-500 dark:text-gray-400">
                          {getSerialNumbers(trx.item)}
                        </span>
                      </TableCell> */}

                      {/* Warehouse — unique room names join koma via roomMap */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <span className="text-[clamp(8px,0.7rem,10px)] text-gray-600 dark:text-gray-400">
                          {getRoomNames(trx.item)}
                        </span>
                      </TableCell>

                      {/* Borrow Date */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <span className="text-[clamp(10px,0.7rem,13px)] text-gray-600 dark:text-gray-400">
                          {new Date(trx.borrow_date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>

                      {/* Return Date */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <span className="text-[clamp(10px,0.7rem,13px)] text-gray-600 dark:text-gray-400">
                          {trx.return_date ? (
                            new Date(trx.return_date).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">—</span>
                          )}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <StatusBadge status={trx.status} />
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="border border-gray-200 px-2 py-4 dark:border-gray-800">
                        <div className="flex flex-row items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/dashboard/transaction-out/show/${trx.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 text-[clamp(1px,0.7rem,10px)] disabled:opacity-30"
                                >
                                  <SquareArrowOutUpRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Lihat detail transaksi</TooltipContent>
                          </Tooltip>
                          <ActionButtonLoan
                            loanRequest={trx as any}
                            onSuccess={() => fetchData(currentPage)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {displayedTotalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span>
                  Showing {(displayedPage - 1) * perPage + 1} –{" "}
                  {Math.min(displayedPage * perPage, displayedTotal)} of {displayedTotal} rows
                </span>
                <span className="text-gray-400">|</span>
                <span>{perPage} rows per page</span>
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