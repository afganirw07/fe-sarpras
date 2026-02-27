"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, User, Building2, Tag,
  FileText, Package, CalendarDays, Hash, Info, ArrowDownCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { getUsers } from "@/lib/user";
import {
  getTransactionById,
  Transaction,
  TransactionDetail,
  ItemConditions,
} from "@/lib/transaction";
import { getItems } from "@/lib/items";
import { getRooms } from "@/lib/warehouse";
import { getSuppliers } from "@/lib/supplier";
import { useParams } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

function formatMonth(month: number, year: number) {
  return `${MONTH_NAMES[month - 1] ?? month} ${year}`;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function formatPrice(price: number | null) {
  if (price == null) return "-";
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function conditionBadgeClass(condition: string) {
  switch (condition) {
    case ItemConditions.GOOD: return "border-emerald-200 bg-emerald-100 text-emerald-700";
    case ItemConditions.FAIR: return "border-amber-200 bg-amber-100 text-amber-700";
    case ItemConditions.POOR: return "border-rose-200 bg-rose-100 text-rose-700";
    default:                  return "border-gray-200 bg-gray-100 text-gray-700";
  }
}


export default function ShowTransaction() {
  const { id } = useParams();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading]         = useState(true);
  const [users, setUsers]             = useState<any[]>([]);
  const [suppliers, setSuppliers]     = useState<any[]>([]);
  const [item, setItem] = useState<any[]>([])
  const [room, setRoom] = useState<any[]>([])
  const [search, setSearch]           = useState("");

  const transactionDetails: TransactionDetail[] = transaction?.transaction_details ?? [];

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getTransactionById(id as string) as any;
        setTransaction(res?.data ?? res);
      } catch {
        toast.error("Gagal ambil detail transaksi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    getSuppliers().then((res: any) => {
      setSuppliers(res?.data ?? res);
    });
  }, []);

  useEffect(() => {
    getRooms().then((res: any) => {
      setRoom (res?.data ?? res);
    });
  }, []);

   useEffect(() => {
    getItems().then((res: any) => {
      setItem (res?.data ?? []);
    });
  }, []);

   const roomMap = useMemo(() => {
    return room.reduce((acc, room) => {
      acc[room.id] = room.name;
      return acc;
    }, {} as Record<string, string>);
  }, [room]);

  const itemMap = useMemo(() => {
    return item.reduce((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {} as Record<string, string>);
  }, [item]);

  const userMap = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const supplierMap = useMemo(() => {
    return suppliers.reduce((acc, s) => {
      acc[s.id] = s.name;
      return acc;
    }, {} as Record<string, string>);
  }, [suppliers]);

  const filteredDetails = useMemo(() => {
    const keyword = search.toLowerCase();
    return transactionDetails.filter((item) =>
      item.item_id.toLowerCase().includes(keyword) ||
      item.room_id.toLowerCase().includes(keyword) ||
      item.condition.toLowerCase().includes(keyword)
    );
  }, [search, transactionDetails]);

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

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-3xl lg:max-w-7xl">
      <Toaster />

      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
              Detail Transaction
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Informasi lengkap transaksi dan item terkait
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Informasi Transaksi
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-blue-500" />
              Created By
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {userMap[transaction.user_id] ?? "Loading..."}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <ArrowDownCircle className="h-4 w-4 text-blue-500" />
              Tipe Transaksi
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {transaction.in_type ?? "-"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="h-4 w-4 text-blue-500" />
              Status
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {transaction.status}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Hash className="h-4 w-4 text-blue-500" />
              PO Number
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {transaction.po_number}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Building2 className="h-4 w-4 text-blue-500" />
              Supplier
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {supplierMap[transaction.supplier_id] ?? "Loading..."}
            </div>
          </div>

          {/* Tanggal Transaksi */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              Tanggal Transaksi
            </label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {formatDate(transaction.transaction_date)}
            </div>
          </div>

        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Data Item
            </h2>
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900/50 dark:bg-blue-900/20">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {filteredDetails.length} Item
              </p>
            </div>
          </div>

          <div className="mt-4 relative w-full md:w-80">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Cari item ID, room, atau kondisi..."
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
                {["No", "Item ID", "Room ID", "Quantity", "Price", "Kondisi", "Tahun Pengadaan"].map((col) => (
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
              {filteredDetails.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {search ? "Data tidak ditemukan" : "Tidak ada item"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {search ? "Coba kata kunci lain" : "Belum ada item di transaksi ini"}
                      </p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                filteredDetails.map((detail, index) => (
                  <TableRow
                    key={detail.item_id}
                    className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    {/* No */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                        {index + 1}
                      </span>
                    </TableCell>

                    {/* Item ID */}
                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        {itemMap[detail.item_id] ?? "Loading..."}
                      </span>
                    </TableCell>

                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                           {roomMap[detail.room_id] ?? "Loading..."}
                      </span>
                    </TableCell>

                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-sm text-gray-700 dark:text-gray-300">
                      {detail.quantity}
                    </TableCell>

                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-sm text-gray-700 dark:text-gray-300">
                      {formatPrice(detail.price)}
                    </TableCell>

                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)]">
                      <span className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold ${conditionBadgeClass(detail.condition)}`}>
                        {detail.condition}
                      </span>
                    </TableCell>

                    <TableCell className="px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-sm text-gray-700 dark:text-gray-300">
                      {detail.procurement_year}
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