"use client";

import React, { useMemo, useState } from "react";
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
  User,
  Package,
  Warehouse,
  Calendar,
  ArrowUpDown,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import Link from "next/link";
import DialogTransactionIn from "../../../dialog/dialogTransaction/transactionIn/dialogTransactionIn";
import { useEffect } from "react";
import { getTransactions, Transaction } from "@/lib/transaction";
import { useSession } from "next-auth/react";
import ActionButtonIn from "@/components/dialog/dialogTransaction/transactionIn/actionButton";
import Pagination from "../../Pagination";
import { getUsers } from "@/lib/user";
import { getRooms, Room } from "@/lib/warehouse";

export default function TableTransactionIn() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [room, setRooms] = useState<Room[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getUsers().then(setUsers);
     getRooms().then(res => setRooms(res.data))
  }, []);

    const fetchTransactions = async (page = currentPage) => {
    try {
      setLoading(true)
      const res = await getTransactions(page, limit)

      setTransactions(res.data)
      setTotalPages(res.pagination.totalPages)
      setTotalItems(res.pagination.total)
    } catch (e) {
      toast.error("Gagal mengambil transaksi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase();
    return transactions.filter((trx) => {
      return (
        trx.user_id.toLowerCase().includes(keyword) ||
        trx.type.toLowerCase().includes(keyword) ||
        trx.supplier_id.toLowerCase().includes(keyword) ||
        trx.status.toLowerCase().includes(keyword)
      );
    });
  }, [transactions, search]);

  const userMap = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user.username;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [users]);

  const roomMap = useMemo(() => {
    return room.reduce(
      (acc, room) => {
        acc[room.id] = room.name;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [room]);

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("approved") ||
      statusLower.includes("selesai") ||
      statusLower.includes("success")
    )
      return {
        class:
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      };
    if (statusLower.includes("pending") || statusLower.includes("process"))
      return {
        class:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        icon: <Clock className="h-3.5 w-3.5" />,
      };
    if (
      statusLower.includes("reject") ||
      statusLower.includes("gagal") ||
      statusLower.includes("failed")
    )
      return {
        class:
          "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
        icon: <XCircle className="h-3.5 w-3.5" />,
      };
    return {
      class:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: <Package className="h-3.5 w-3.5" />,
    };
  };

  const getTypeConfig = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("in") || typeLower.includes("masuk"))
      return "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800";
    if (typeLower.includes("out") || typeLower.includes("keluar"))
      return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const totalPending = transactions.filter((t) =>
    t.status.toLowerCase().includes("draft"),
  ).length;
  const totalApproved = transactions.filter(
    (t) =>
      t.status.toLowerCase().includes("approved") ||
      t.status.toLowerCase().includes("received"),
  ).length;

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-3xl lg:max-w-7xl">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Cari user, tipe, atau status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-[clamp(10px,0.7rem,10px)] placeholder-gray-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {[
                    "No",
                    "User",
                    "Tipe",
                    "Warehouse",
                    "Tanggal",
                    "Status",
                    "Aksi",
                  ].map((header, i) => (
                    <TableCell
                      key={header}
                      isHeader
                      className={`bg-linear-to-br dark:text-gray-300} w-20 from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-200`}
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
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-sky-500 dark:border-gray-700 dark:border-t-sky-400"></div>
                        <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                          Memuat data...
                        </p>
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
                        <p className="text-[clamp(10px,0.7rem,10px)] font-medium text-gray-900 dark:text-white">
                          {search
                            ? "Data tidak ditemukan"
                            : "Tidak ada transaksi"}
                        </p>
                        <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                          {search
                            ? "Coba kata kunci pencarian lain"
                            : "Tambahkan transaksi baru untuk memulai"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading &&
                  filteredTransactions.map((trx, index) => {
                    const statusConfig = getStatusConfig(trx.status);
                    return (
                      <TableRow
                        key={trx.id}
                        className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                      >
                        <TableCell className=" px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-[clamp(10px,0.7rem,10px)] font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                            {(currentPage - 1) * limit + index + 1}
                          </span>
                        </TableCell>

                        <TableCell className=" px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                          <div className="flex items-center gap-2">
                            <div className="flex  items-center justify-center rounded-lg text-[clamp(10px,0.7rem,12px)] font-semibold dark:text-white">
                              {userMap[trx.user_id] ?? "Loading..."}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className=" px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[clamp(10px,0.7rem,10px)] font-semibold ${getTypeConfig(trx.type)}`}
                          >
                            <ArrowDownToLine className="h-3 w-3" />
                            {trx.type}
                          </span>
                        </TableCell>

                        <TableCell className=" px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                          <div className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4 text-gray-400" />
                            <span className="text-[clamp(10px,0.7rem,10px)] text-gray-700 dark:text-gray-300">
                              {roomMap[trx.transaction_details?.[0]?.room_id] ?? "-"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className=" px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-[clamp(10px,0.7rem,10px)] text-gray-700 dark:text-gray-300">
                              {new Date(
                                trx.transaction_date,
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className=" px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[clamp(10px,0.7rem,10px)] font-semibold ${statusConfig.class}`}
                          >
                            {statusConfig.icon}
                            {trx.status}
                          </span>
                        </TableCell>

                        <TableCell className="flex justify-center gap-2 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/dashboard/transaction/show/${trx.id}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-gray-200 p-4 text-[clamp(10px,0.7rem,10px)] hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:hover:border-sky-500 dark:hover:bg-sky-900/20"
                                >
                                  <SquareArrowOutUpRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              Lihat detail transaksi
                            </TooltipContent>
                          </Tooltip>

                          {/* {(session?.user.role === "admin" || session?.user.role === "approver") && ( */}
                          <ActionButtonIn
          key={trx.id}
          transaction={trx}
          onSuccess={fetchTransactions} // 🔥 INI KUNCINYA
        />
                          {/* )} */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between p-4">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span>
                  Showing {(currentPage - 1) * limit + 1} –{" "}
                  {Math.min(currentPage * limit, totalItems)} of {totalItems}
                </span>

                <span>{limit} rows per page</span>
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
