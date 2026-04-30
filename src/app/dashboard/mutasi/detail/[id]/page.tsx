"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  User,
  Tag,
  FileText,
  Package,
  CalendarDays,
  Info,
  ArrowUpFromLine,
  Clock,
  RotateCcw,
  Boxes,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { getLoanRequests } from "@/lib/loan-request";
import { useParams } from "next/navigation";
import { getMigrationById, ItemMigration } from "@/lib/migration";
import { getUsers } from "@/lib/user";
import { getRooms } from "@/lib/warehouse";
import Pagination from "@/components/tables/Pagination";
import ButtonBack from "@/components/ui/button/backButton";


interface LoanRequest {
  id: string;
  user_id: string;
  item_id: string;
  borrow_date: string;
  return_date: string | null;
  status: string;
  description: string | null;
  created_at: string;
  user?: { username: string };
  item?: {
    serial_number: string;
    condition: string;
    item: { name: string };
    room: { name: string };
  };
}

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function statusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
      
  
 
    case "available":
      return "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "borrowed":
      return "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "damaged":
      return "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400";

  }
}

function conditionBadgeClass(condition: string) {
  switch (condition?.toLowerCase()) {
    case "good":
      return "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "fair":
      return "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "poor":
      return "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
    default:
      return "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

export default function ShowTransactionOut() {
  const { id } = useParams();
  const [migration, setMigration] = useState<ItemMigration | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getMigrationById(id as string);
        setMigration(res.data ?? res);
        const roomRes = await getRooms();
        const userRes = await getUsers();
        setRooms(roomRes.data ?? []);
        setUsers(userRes);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const itemRows = useMemo(() => {
  if (!migration?.detail_items) return [];

  return migration.detail_items.filter((detail) => {
    const keyword = search.toLowerCase();

    const name = detail.item?.name?.toLowerCase() || "";
    const serial = detail.serial_number?.toLowerCase() || "";
    const room =
      rooms.find((r) => r.id === detail.room_id)?.name?.toLowerCase() || "";
    const condition = detail.condition?.toLowerCase() || "";


    return (
      name.includes(keyword) ||
      serial.includes(keyword) ||
      room.includes(keyword) ||
      condition.includes(keyword)
    );
  });
}, [migration, search, rooms]);

 useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ─── Pagination logic ──────────────────────────────────────────────────────
  const totalPages = Math.ceil(itemRows.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return itemRows.slice(start, start + itemsPerPage);
  }, [itemRows, currentPage, itemsPerPage]);


  const roomMap = useMemo(() =>
    rooms.reduce((acc, r) => ({ ...acc, [r.id]: r.name }), {} as Record<string, string>)
  , [rooms]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!migration) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Data Mutasi tidak ditemukan
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="mx-auto w-full max-w-xs md:max-w-3xl lg:max-w-7xl">
      <Toaster />

      <div className="flex w-full justify-between items-center   mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
            <ArrowUpFromLine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
              Detail Mutasi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Informasi lengkap Mutasi Item
            </p>
          </div>
        </div>
        <ButtonBack route="/mutasi"/>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Informasi Mutasi
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-blue-500" />
              Ruangan Asal
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {migration.from_room_id && rooms.find((r) => r.id === migration.from_room_id)?.name} &rarr;{" "}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="h-4 w-4 text-blue-500" />
              Ruangan Tujuan
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span
                className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold`}
              >
               {migration.to_room_id && rooms.find((r) => r.id === migration.to_room_id)?.name}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              Tanggal mutasi
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {formatDate(migration.migrated_at)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <RotateCcw className="h-4 w-4 text-blue-500" />
              Nama Item
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {migration.detail_items?.[0]?.item?.name ?? "-"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4 text-blue-500" />
              Catatan
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {migration.notes ?? "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Data Item
            </h2>
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900/50 dark:bg-blue-900/20">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {itemRows.length} Item
              </p>
            </div>
          </div>

          <div className="relative mt-4 w-full md:w-80">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Cari nama item, ruangan, atau kondisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                {[
                  "No",
                  "Nama Item",
                  "Serial Number",
                  "Ruangan",
                  "Kondisi",
                  "Status",
                ].map((col) => (
                  <TableCell
                    key={col}
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                        <Boxes className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {search ? "Data tidak ditemukan" : "Tidak ada item"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {search
                          ? "Coba kata kunci lain"
                          : "Belum ada item di transaksi ini"}
                      </p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                itemRows.map((m, index) => (
                  <TableRow
                    key={m.id}
                    className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    {/* No */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                        {index + 1}
                      </span>
                    </TableCell>

                    {/* Nama Item */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {m.item?.name}
                      </span>
                    </TableCell>

                    {/* Serial Number */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        {m.serial_number}
                      </span>
                    </TableCell>

                    {/* Ruangan */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {roomMap[m.room_id] ?? "-"}
                      </span>
                    </TableCell>

                    {/* Kondisi */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span
                        className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold ${conditionBadgeClass(
                          m.condition ?? ""
                        )}`}
                      >
                        {m.condition ?? "-"}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span
                        className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold ${statusBadgeClass(
                          m.status
                        )}`}
                      >
                        {m.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}