"use client";

import React, { useMemo, useState, useEffect } from "react";
import TableTransactionOut from "@/components/tables/tables-UI/table-transaction-out/page";
import {
  ArrowUpFromLine,
  Receipt,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
} from "lucide-react";
import { getLoanRequests } from "@/lib/loan-request";
import DialogTransactionOut from "@/components/dialog/dialogTransaction/transaction-out/dialogTransactionOut";
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

export default function TransactionOut({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [transactions, setTransactions] = useState<LoanRequest[]>([]);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTransactions = async () => {
    try {
      const res = await getLoanRequests(1, 100); // fetch all for stats
      setTransactions(res.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const totalPending = transactions.filter(
    (t) => t.status.toLowerCase() === "Pending"
  ).length;

  const totalApproved = transactions.filter(
    (t) =>
      t.status.toLowerCase() === "Disetujui" ||
      t.status.toLowerCase() === "Dikembalikan"
  ).length;

  const filteredCount = useMemo(() => {
    if (!search) return transactions.length;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        (t.user?.username ?? t.user_id).toLowerCase().includes(q) ||
        (t.item?.item?.name ?? "").toLowerCase().includes(q)
    ).length;
  }, [transactions, search]);

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <ArrowUpFromLine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Transaksi Peminjaman
              </h1>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Kelola riwayat transaksi keluar & peminjaman
              </p>
            </div>
          </div>
          <DialogTransactionOut onSuccess={handleRefresh}/>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Total Transaksi
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Approved / Returned */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Disetujui
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalApproved}
              </p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPending}
              </p>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
              <Search className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Hasil Cari
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <TableTransactionOut key={refreshKey} />
    </div>
  );
}