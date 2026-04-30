"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import {
  getConsumableRequests,
  ConsumableRequest,
} from "@/lib/consumable-request";
import ActionButtonConsumable from "@/components/dialog/dialogConsumableRequest/actionButtonConsumableRequest";

// ─── Badge: Kondisi Barang (Good / Fair / Poor) ───────────────────────────────
function ConditionBadge({ condition }: { condition: string }) {
  const map: Record<string, string> = {
    Good: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    Fair: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Poor: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[condition] ?? "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {condition ?? "—"}
    </span>
  );
}

// ─── Badge: Status Request (pending / approved / returned) ────────────────────
function RequestStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    returned:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };
  const label: Record<string, string> = {
    pending:  "Pending",
    approved: "Approved",
    returned: "Returned",
  };
  return (
    <span
      className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[status] ?? "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {label[status] ?? status ?? "—"}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  refreshKey?: number;
  onSearchChange?: (val: string) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TableConsumableRequest({ refreshKey, onSearchChange }: Props) {
  const [data,        setData]        = useState<ConsumableRequest[]>([]);
  const [search,      setSearch]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalData,   setTotalData]   = useState(0);
  const perPage = 10;

  const fetchData = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getConsumableRequests(page, perPage);
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

  const handleRefresh = () => fetchData(currentPage);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, refreshKey]);

  useEffect(() => {
    onSearchChange?.(search);
  }, [search]);

  // ── Client-side filter ────────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return data;
    return data.filter(
      (d) =>
        d.item?.[0]?.name?.toLowerCase().includes(q) ||
        d.item?.[0]?.code?.toLowerCase().includes(q) ||
        d.createdBy?.username?.toLowerCase().includes(q) ||
        // approved by → relasi employee (EmployeeOwner)
        d.employee?.full_name?.toLowerCase().includes(q) ||
        // request by → relasi requestBy (RequestBy)
        d.requestBy?.full_name?.toLowerCase().includes(q) ||
        d.status?.toLowerCase().includes(q) ||
        d.request_status?.toLowerCase().includes(q)
    );
  }, [search, data]);

  // ── Table headers ─────────────────────────────────────────────────────────
  const tableHeaders = [
    { label: "No",             className: "w-16 text-center" },
    { label: "Item"                                           },
    { label: "Qty"                                            },
    { label: "Kondisi"                                        },
    { label: "Status"                                         },
    // { label: "Requested By"                                   },
    { label: "Approved By"                                    },
    { label: "Ruangan"                                      },
    { label: "Tanggal"                                        },
    { label: "Aksi",         className: "text-center"       },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderLoading = () => (
    <TableRow>
      <td colSpan={tableHeaders.length} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
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
            {search ? "Data tidak ditemukan" : "Belum ada consumable request"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {search ? "Coba kata kunci lain" : "Tambahkan request baru"}
          </p>
        </div>
      </td>
    </TableRow>
  );

  // ── Avatar helper ─────────────────────────────────────────────────────────
  const Avatar = ({ name, color = "gray" }: { name: string; color?: "gray" | "emerald" | "blue" }) => {
    const colorMap = {
      gray:    "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300",
      emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      blue:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return (
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colorMap[color]}`}>
        {(name ?? "?").charAt(0).toUpperCase()}
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-md md:max-w-2xl lg:max-w-7xl">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

        {/* Search Bar */}
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Cari item, user, kondisi, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
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
                      className={`bg-gradient-to-br from-gray-50 to-gray-100/50 px-2 py-4 text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${
                        h.className ?? "text-left"
                      }`}
                    >
                      {h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && renderLoading()}
                {!loading && filteredRows.length === 0 && renderEmpty()}
                {!loading &&
                  filteredRows.map((d, index) => (
                    <TableRow
                      key={d.id}
                      className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      {/* No */}
                      <TableCell className="px-2 py-4 text-center">
                        <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(currentPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>

                      {/* Item */}
                      <TableCell className="px-2 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {d.item?.[0]?.name ?? "—"}
                          </p>
                        </div>
                      </TableCell>

                      {/* Qty */}
                      <TableCell className="px-2 py-4">
                        {/* <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"> */}
                          {d.quantity} {d.item?.[0]?.unit ?? "pcs"}
                        {/* </span> */}
                      </TableCell>

                      {/* Kondisi (Good/Fair/Poor) */}
                      <TableCell className="px-2 py-4">
                        <ConditionBadge condition={d.status} />
                      </TableCell>

                      {/* Status Request (pending/approved/returned) */}
                      <TableCell className="px-2 py-4">
                        <RequestStatusBadge status={d.request_status} />
                      </TableCell>

                      {/* Requested By → requestBy (Employee yang minta) */}
                      <TableCell className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={d.requestBy?.full_name ?? "?"} color="blue" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {d.requestBy?.full_name ?? "—"}
                          </p>
                        </div>
                      </TableCell>

                      {/* Approved By → employee (EmployeeOwner) */}
                      {/* <TableCell className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={d.employee?.full_name ?? "?"} color="emerald" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {d.employee?.full_name ?? "—"}
                          </p>
                        </div>
                      </TableCell> */}

                      {/* Warehouse */}
                      <TableCell className="px-2 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {d.rooms_id?.name ?? "—"}
                        </span>
                      </TableCell>

                      {/* Tanggal */}
                      <TableCell className="px-2 py-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(d.created_at)}
                        </span>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="px-2 py-4 text-center">
                        <ActionButtonConsumable request={d} onSuccess={handleRefresh} />
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
                Showing {(currentPage - 1) * perPage + 1}–
                {Math.min(currentPage * perPage, totalData)} of {totalData}
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
    </div>
  );
}