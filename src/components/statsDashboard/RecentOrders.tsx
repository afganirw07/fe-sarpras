"use client";

import { useEffect, useState, useMemo } from "react";
import { getTransactions } from "@/lib/transaction";
import { getLoanRequests } from "@/lib/loan-request";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import {
  ArrowDownCircle,
  BookOpen,
  CalendarDays,
  User,
  Hash,
  RotateCcw,
  X,
  ShoppingCart,
} from "lucide-react";
import { getConsumableRequests, ConsumableRequest } from "@/lib/consumable-request";


type RowSource = "transaction" | "loan" | "return" | "HabisPakai";

type MergedRow = {
  id: string;
  _source: RowSource;
  _label: string;
  _sortDate: string;
  po_number?: string;
  in_type?: string;
  username?: string;
  itemName?: string;
  status: string;
  
};


function formatDate(iso: string) {
  const date = new Date(iso);
  const dateStr = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { dateStr, timeStr };
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Diterima":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "Disetujui":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "Dikembalikan":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "Draft":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400";
  }
}

function SourceIcon({ source }: { source: RowSource }) {
  if (source === "transaction")
    return <ArrowDownCircle className="h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" />;
  if (source === "return")
    return <RotateCcw className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />;
  return <BookOpen className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />;
  // if (source === "consumable")
  // return <ShoppingCart className="h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400" />;
}


export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans]               = useState<any[]>([]);
  const [consumables, setConsumables] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);

  const [filterJenis,  setFilterJenis]  = useState<string>("all"); // all | transaction | loan | return
  const [filterStatus, setFilterStatus] = useState<string>("all"); // all | received | approved | returned | draft | borrowed

  const activeFilterCount = [
    filterJenis  !== "all",
    filterStatus !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterJenis("all");
    setFilterStatus("all");
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [txRes, loanRes, consumableRes] = await Promise.all([
          getTransactions(1, 50),
          getLoanRequests(1, 50),
          getConsumableRequests(1, 50),
        ]);
        setTransactions(txRes?.data ?? (Array.isArray(txRes)   ? txRes   : []));
        setLoans(loanRes?.data      ?? (Array.isArray(loanRes) ? loanRes : []));
        setConsumables(consumableRes?.data ?? (Array.isArray(consumableRes) ? consumableRes : []));
      } catch (err) {
        console.error("RecentTransactions fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  function capitalizeFirst(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

  // ── Merge + filter ─────────────────────────────────────────────────────────
  const allRows = useMemo<MergedRow[]>(() => {
    const txRows: MergedRow[] = transactions.map((t) => ({
      id:        t.id,
      _source:   "transaction" as const,
      _label:    "Barang Masuk",
      _sortDate: t.created_at,
      po_number: t.po_number,
      in_type:   t.in_type,
      status:    t.status,
    }));

    const loanRows: MergedRow[] = loans
      .filter((l) => l.status === "Disetujui")
      .map((l) => ({
        id:        l.id,
        _source:   "loan" as const,
        _label:    "Peminjaman",
        _sortDate: l.created_at,
        username:  l.user?.username,
        itemName:  l.item?.item?.name ?? l.item?.serial_number,
        status:    l.status,
      }));

    const returnRows: MergedRow[] = loans
      .filter((l) => l.status === "Dikembalikan")
      .map((l) => ({
        id:        l.id,
        _source:   "return" as const,
        _label:    "Pengembalian Barang",
        _sortDate: l.return_date ?? l.created_at,
        username:  l.user?.username,
        itemName:  l.item?.item?.name ?? l.item?.serial_number,
        status:    l.status,
      }));

      const consumableRows: MergedRow[] = consumables.map((c) => ({
  id:        c.id,
  _source:   "HabisPakai" as const,
  _label:    "Permintaan Barang",
  _sortDate: c.created_at,
  username:  c.requestBy?.full_name ?? c.createdBy?.username,
  itemName:  c.item?.[0]?.name ?? "-",
  status:    c.request_status,
}));

    return [...txRows, ...loanRows, ...returnRows, ...consumableRows].sort(
      (a, b) => new Date(b._sortDate).getTime() - new Date(a._sortDate).getTime()
    );
  }, [transactions, loans, consumables]);

  const filteredRows = useMemo<MergedRow[]>(() => {
    return allRows
      .filter((row) => filterJenis  === "all" || row._source === filterJenis)
      .filter((row) => filterStatus === "all" || row.status  === filterStatus)
      .slice(0, 10);
  }, [allRows, filterJenis, filterStatus]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Riwayat Transaksi
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gabungan transaksi masuk, peminjaman &amp; pengembalian terbaru
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Filter Jenis Transaksi */}
          <Select value={filterJenis} onValueChange={setFilterJenis}>
            <SelectTrigger className="h-8 w-44 rounded-xl border-gray-200 text-xs dark:border-white/10">
              <SelectValue placeholder="Jenis Transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="transaction">Barang Masuk</SelectItem>
              <SelectItem value="loan">Peminjaman</SelectItem>
              <SelectItem value="return">Pengembalian</SelectItem>
              <SelectItem value="consumable">Permintaan Barang</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Status */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-8 w-36 rounded-xl border-gray-200 text-xs dark:border-white/10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Diterima">Diterima</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Disetujui">Disetujui</SelectItem>
              <SelectItem value="Dikembalikan">Dikembalikan</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset filter */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 rounded-xl text-xs text-gray-500 hover:text-red-500"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reset
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {activeFilterCount}
              </span>
            </Button>
          )}

          {/* Counter entri */}
          {!loading && (
            <span className="inline-flex h-8 w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
              {filteredRows.length} entri
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              {["No", "Tipe", "Referensi", "Detail", "Status", "Tanggal"].map((h) => (
                <TableCell
                  key={h}
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j} className="py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-white/[0.05]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <td
                  colSpan={6}
                  className="py-12 text-center text-sm text-gray-400 dark:text-gray-600"
                >
                  {activeFilterCount > 0 ? "Tidak ada data untuk filter ini" : "Belum ada transaksi"}
                </td>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
                <TableRow key={`${row._source}-${row.id}`}>

                  {/* No */}
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>

                  {/* Tipe */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5">
                      <SourceIcon source={row._source} />
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {row._label}
                      </span>
                    </div>
                  </TableCell>

                  {/* Referensi */}
                  <TableCell className="py-3">
                    {row._source === "transaction" ? (
                      <div className="flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                        <span className="text-theme-sm text-gray-800 dark:text-white/90">
                          PO-{row.po_number}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                        <span className="text-theme-sm text-gray-800 dark:text-white/90">
                          {row.username ?? "-"}
                        </span>
                      </div>
                    )}
                  </TableCell>

                  {/* Detail */}
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {row._source === "transaction" ? (
                      row.in_type ?? "-"
                    ) : (
                      <span className="block max-w-[140px] truncate">
                        {row.itemName ?? "-"}
                      </span>
                    )}
                  </TableCell>

                  {/* Status */}
                 {/* Status */}
<TableCell className="py-3">
  <div
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(row.status)}`}
  >
    {capitalizeFirst(row.status)}
  </div>
</TableCell>

                  {/* Tanggal */}
                  <TableCell className="py-3">
                    <div className="flex items-start gap-1.5 text-theme-xs text-gray-500 dark:text-gray-400">
                      <CalendarDays className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span>{formatDate(row._sortDate).dateStr}</span>
                        <span className="text-gray-400 dark:text-gray-600">
                          {formatDate(row._sortDate).timeStr}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}