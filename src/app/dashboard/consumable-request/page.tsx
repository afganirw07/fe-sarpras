"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PackageOpen,
  Receipt,
  CheckCircle2,
  Search,
  ClipboardList,
} from "lucide-react";
import DialogAddConsumableRequest from "@/components/dialog/dialogConsumableRequest/dialogAddConsumableRequest";
import TableConsumableRequest from "@/components/tables/tables-UI/table-consumable-request/page";
import { getConsumableRequests, ConsumableRequest } from "@/lib/consumable-request";
import ExportExcel from "@/components/exports/button-excell/buttonExcell";

export default function ConsumableRequestPage() {
  const [requests,   setRequests]   = useState<ConsumableRequest[]>([]);
  const [search,     setSearch]     = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await getConsumableRequests(1, 9999);
        if (!cancelled) setRequests(res.data ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalRequests = requests.length;
  const totalGood     = requests.filter((r) => r.status === "Baik").length;
  const totalFair     = requests.filter((r) => r.status === "Sedang").length;

  // ── Filter ────────────────────────────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    if (!search) return requests;
    const q = search.toLowerCase();
    return requests.filter(
      (r) =>
        r.item?.[0]?.name?.toLowerCase().includes(q) ||        
        r.createdBy?.username?.toLowerCase().includes(q) ||
        r.requestBy?.full_name?.toLowerCase().includes(q) ||  
        r.employee?.full_name?.toLowerCase().includes(q) ||     
        r.rooms_id?.name?.toLowerCase().includes(q)            
    );
  }, [requests, search]);

   const filteredCount = filteredRequests.length;

  const excelData = useMemo(() =>
    filteredRequests.map((r, index) => ({
      No:               index + 1,
      "Item":           r.item?.[0]?.name ?? "-",            
      "Quantity":       r.quantity,
      "Kondisi":        r.status ?? "-",
      "Status Request": r.request_status ?? "-",
      "Pemohon":        r.requestBy?.full_name ?? "-",
      "Approver":       r.employee?.full_name ?? "-",
      "Room":           r.rooms_id?.name ?? "-",
      "Dibuat Oleh":    r.createdBy?.username ?? "-",
      "Tanggal":        new Date(r.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit", month: "long", year: "numeric"
                        }),
    })),
    [filteredRequests]
  );
  const stats = [
    {
      label:     "Total Request",
      value:     totalRequests,
      icon:      ClipboardList,
      color:     "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label:     "Kondisi Good",
      value:     totalGood,
      icon:      CheckCircle2,
      color:     "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label:     "Kondisi Fair",
      value:     totalFair,
      icon:      Receipt,
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
            {/* Fix: bg-gradient-to-br → bg-linear-to-br */}
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <PackageOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Permintaan
              </h1>
              <p className="text-[clamp(10px,0.7rem,12px)] text-gray-500 dark:text-gray-400">
                Kelola permintaan barang habis pakai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ExportExcel
              data={excelData}
              fileName="consumable-requests"
              sheetName="Permintaan"
            />
            <DialogAddConsumableRequest onSuccess={handleRefresh} />
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
      <TableConsumableRequest
        refreshKey={refreshKey}
        onSearchChange={setSearch}
      />
    </div>
  );
}