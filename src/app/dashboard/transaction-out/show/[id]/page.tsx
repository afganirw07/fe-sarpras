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

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    case "approved":
      return "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending":
      return "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "returned":
      return "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "rejected":
      return "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
    default:
      return "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400";
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShowTransactionOut() {
  const { id } = useParams();

  const [transaction, setTransaction] = useState<LoanRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        // getLoanRequests fetches all; filter by id client-side
        // Or replace with a dedicated getLoanRequestById(id) if available
        const res = await getLoanRequests(1, 100);
        const all: LoanRequest[] = res.data ?? [];
        const found = all.find((t) => t.id === id) ?? null;
        setTransaction(found);
      } catch {
        toast.error("Gagal ambil detail transaksi keluar");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Single transaction rendered as a one-row "detail table"
  // We still apply search to the item name / room / condition
  const itemRows = useMemo(() => {
    if (!transaction) return [];
    const rows = [transaction];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (t) =>
        (t.item?.item?.name ?? "").toLowerCase().includes(q) ||
        (t.item?.room?.name ?? "").toLowerCase().includes(q) ||
        (t.item?.condition ?? "").toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [transaction, search]);

  // ── Loading ────────────────────────────────────────────────────────────────

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

  if (!transaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Transaksi tidak ditemukan
          </p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-3xl lg:max-w-7xl">
      <Toaster />

      {/* ── Header ── */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
            <ArrowUpFromLine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
              Detail Transaksi Keluar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Informasi lengkap transaksi peminjaman
            </p>
          </div>
        </div>
      </div>

      {/* ── Info Section ── */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Informasi Transaksi
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Dibuat Oleh */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-blue-500" />
              Dibuat Oleh
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {transaction.user?.username ?? transaction.user_id}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="h-4 w-4 text-blue-500" />
              Status
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span
                className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold ${statusBadgeClass(transaction.status)}`}
              >
                {transaction.status}
              </span>
            </div>
          </div>

          {/* Tanggal Pinjam */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              Tanggal Pinjam
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {formatDate(transaction.borrow_date)}
            </div>
          </div>

          {/* Tanggal Kembali */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <RotateCcw className="h-4 w-4 text-blue-500" />
              Tanggal Kembali
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {formatDate(transaction.return_date)}
            </div>
          </div>

          {/* Dibuat Pada */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="h-4 w-4 text-blue-500" />
              Dibuat Pada
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {formatDate(transaction.created_at)}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4 text-blue-500" />
              Deskripsi
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {transaction.description ?? "-"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Item Table Section ── */}
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
              {itemRows.length === 0 ? (
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
                itemRows.map((t, index) => (
                  <TableRow
                    key={t.id}
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
                        {t.item?.item?.name ?? "-"}
                      </span>
                    </TableCell>

                    {/* Serial Number */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        {t.item?.serial_number ?? "-"}
                      </span>
                    </TableCell>

                    {/* Ruangan */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t.item?.room?.name ?? "-"}
                      </span>
                    </TableCell>

                    {/* Kondisi */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span
                        className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold ${conditionBadgeClass(
                          t.item?.condition ?? ""
                        )}`}
                      >
                        {t.item?.condition ?? "-"}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span
                        className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold ${statusBadgeClass(
                          t.status
                        )}`}
                      >
                        {t.status}
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