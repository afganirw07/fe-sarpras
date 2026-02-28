"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Search, SquareArrowOutUpRight, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActionButtonLoan from "@/components/dialog/dialogTransaction/transaction-out/actionButton";
import Link from "next/link";
import { Button } from "../../../ui/button";
import { getLoanRequests } from "@/lib/loan-request";
import Pagination from "../../Pagination";

interface LoanRequest {
  id: string;
  user_id: string;
  item_id: string;
  borrow_date: string;
  return_date: string | null;
  status: string;
  description: string | null;
  updated_at: string;
  created_at: string;
  user?: { username: string };
  item?: {
    serial_number: string;
    condition: string;
    item: { name: string };
    room: { name: string };
  };
}

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
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[clamp(9px,0.65rem,11px)] font-semibold ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

export default function TableTransactionOut() {
  const [data, setData] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const perPage = 10;

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getLoanRequests(page, perPage);
      setData(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setTotalData(res.pagination?.total ?? 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const filtered = data.filter((trx) => {
    const q = search.toLowerCase();
    return (
      trx.id.toLowerCase().includes(q) ||
      trx.status.toLowerCase().includes(q) ||
      (trx.user?.username ?? trx.user_id).toLowerCase().includes(q) ||
      (trx.item?.item?.name ?? "").toLowerCase().includes(q) ||
      (trx.item?.serial_number ?? "").toLowerCase().includes(q)
    );
  });

  return (
 <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-xs">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-3 border-b border-gray-200/50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Cari item, user, status..."
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
                  {[
                    { label: "No", cls: "w-16" },
                    { label: "ID", cls: "" },
                    { label: "User", cls: "" },
                    { label: "Item", cls: "" },
                    { label: "Serial No", cls: "" },
                    { label: "Warehouse", cls: "" },
                    { label: "Borrow Date", cls: "" },
                    { label: "Return Date", cls: "" },
                    { label: "Status", cls: "" },
                    { label: "Aksi", cls: "w-36 text-center" },
                  ].map((h) => (
                    <TableCell
                      key={h.label}
                      isHeader
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50  px-[clamp(10px,1vw,16px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(8px,0.7rem,8px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${h.cls}`}
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Memuat data...
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <td colSpan={10} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {search
                            ? "Data tidak ditemukan"
                            : "Tidak ada transaksi"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {search
                            ? "Coba kata kunci pencarian lain"
                            : "Tambahkan transaksi baru untuk memulai"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  filtered.map((trx, index) => (
                    <TableRow
                      key={trx.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(currentPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-[clamp(9px,0.65rem,11px)] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {trx.id.slice(0, 8)}…
                        </span>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="bg-linear-to-br flex h-8 w-8 shrink-0 items-center justify-center rounded-lg from-blue-500 to-blue-600 text-xs font-semibold text-white shadow-lg shadow-blue-500/20">
                            {(trx.user?.username ?? trx.user_id)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="text-[clamp(10px,0.7rem,13px)] text-gray-700 dark:text-gray-300">
                            {trx.user?.username ??
                              trx.user_id.slice(0, 8) + "…"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="text-[clamp(8px,0.7rem,13px)] font-medium text-gray-800 dark:text-gray-200">
                          {trx.item?.item?.name ?? "-"}
                        </span>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="font-mono text-[clamp(9px,0.65rem,11px)] text-gray-500 dark:text-gray-400">
                          {trx.item?.serial_number ??
                            trx.item_id.slice(0, 16) + "…"}
                        </span>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="text-[clamp(10px,0.7rem,13px)] text-gray-600 dark:text-gray-400">
                          {trx.item?.room?.name ?? "-"}
                        </span>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="text-[clamp(10px,0.7rem,13px)] text-gray-600 dark:text-gray-400">
                          {new Date(trx.borrow_date).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <span className="text-[clamp(10px,0.7rem,13px)] text-gray-600 dark:text-gray-400">
                          {trx.return_date ? (
                            new Date(trx.return_date).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">
                              —
                            </span>
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <StatusBadge status={trx.status} />
                      </TableCell>
                      <TableCell className="border border-gray-200 px-[clamp(10px,1vw,18px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                        <div className="flex flex-row items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/dashboard/transaction-out/show/${trx.id}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 text-[clamp(1px,0.7rem,10px)] disabled:opacity-30"
                                >
                                  <SquareArrowOutUpRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              Lihat detail transaksi
                            </TooltipContent>
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

          {totalData > perPage && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span>
                  Showing {(currentPage - 1) * perPage + 1} –{" "}
                  {Math.min(currentPage * perPage, totalData)} of {totalData}{" "}
                  rows
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
    </div>
  );
}
