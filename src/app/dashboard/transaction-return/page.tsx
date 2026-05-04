"use client";

import React, { useMemo, useState, useEffect } from "react";
import TableTransactionReturn from "@/components/tables/tables-UI/table-transaction-return/page";
import {
  RotateCcw,
  Receipt,
  CheckCircle2,
  PackageCheck,
  Search,
} from "lucide-react";
import DialogTransactionReturn from "@/components/dialog/dialogTransaction/transaction-return/dialogtransactionReturn";
import { getLoanRequests, LoanRequest } from "@/lib/loan-request";

export default function TransactionReturnPage() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLoanRequests = async () => {
    try {
      const res = await getLoanRequests(1, 9999);
      setLoanRequests(res.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLoanRequests();
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalTransaksi    = loanRequests.length;
  const totalSudahReturn  = loanRequests.filter((r) => r.status === "Dikembalikan").length;
  const totalBelumReturn  = loanRequests.filter((r) => r.status === "Disetujui").length;

  const filteredCount = useMemo(() => {
    if (!search) return totalSudahReturn;
    const q = search.toLowerCase();
    return loanRequests
      .filter((r) => r.status === "Dikembalikan")
      .filter((r) =>
        (r.user?.username ?? "").toLowerCase().includes(q) ||
        r.item.some(
          (d) =>
            d.item?.name.toLowerCase().includes(q) ||
            d.serial_number.toLowerCase().includes(q) ||
            d.room?.name.toLowerCase().includes(q)
        )
      ).length;
  }, [loanRequests, search, totalSudahReturn]);

  const stats = [
    {
      label:     "Total Transaksi",
      value:     totalTransaksi,
      icon:      Receipt,
      color:     "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label:     "Sudah Dikembalikan",
      value:     totalSudahReturn,
      icon:      CheckCircle2,
      color:     "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label:     "Belum Dikembalikan",
      value:     totalBelumReturn,
      icon:      PackageCheck,
      color:     "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label:     "Hasil Cari",
      value:     filteredCount,
      icon:      Search,
      color:     "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">
      {/* ── Header ── */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Pengembalian Barang
              </h1>
              <p className="text-[clamp(10px,0.7rem,12px)] text-gray-500 dark:text-gray-400">
                Kelola pengembalian barang dari peminjaman
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DialogTransactionReturn onSuccess={handleRefresh} />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <TableTransactionReturn refreshKey={refreshKey} onSearchChange={setSearch} />
    </div>
  );
}