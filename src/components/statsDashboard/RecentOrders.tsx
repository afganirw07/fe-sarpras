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
import Badge from "@/components/ui/badge/Badge";
import {
  ArrowDownCircle,
  BookOpen,
  CalendarDays,
  User,
  Hash,
  RotateCcw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RowSource = "transaction" | "loan" | "return";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getStatusColor(
  status: string
): "success" | "warning" | "error" | "info" {
  switch (status) {
    case "received":  return "success";
    case "returned":  return "success";
    case "approved":  return "success";
    case "draft":     return "warning";
    case "borrowed":  return "info";
    default:          return "warning";
  }
}

// ─── Source icon helper ────────────────────────────────────────────────────────

function SourceIcon({ source }: { source: RowSource }) {
  if (source === "transaction") {
    return <ArrowDownCircle className="h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" />;
  }
  if (source === "return") {
    return <RotateCcw className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />;
  }
  return <BookOpen className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans]               = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [txRes, loanRes] = await Promise.all([
          getTransactions(1, 10),
          getLoanRequests(1, 10),
        ]);
        setTransactions(txRes?.data  ?? (Array.isArray(txRes)   ? txRes   : []));
        setLoans(loanRes?.data       ?? (Array.isArray(loanRes) ? loanRes : []));
      } catch (err) {
        console.error("RecentTransactions fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const mergedRows = useMemo<MergedRow[]>(() => {
    const txRows: MergedRow[] = transactions.map((t) => ({
      id:        t.id,
      _source:   "transaction" as const,
      _label:    "Barang Masuk",
      _sortDate: t.created_at,
      po_number: t.po_number,
      in_type:   t.in_type,
      status:    t.status,
    }));

    // Peminjaman: status "approved" (sudah disetujui & sedang dipinjam)
    const loanRows: MergedRow[] = loans
      .filter((l) => l.status === "approved")
      .map((l) => ({
        id:        l.id,
        _source:   "loan" as const,
        _label:    "Peminjaman",
        _sortDate: l.created_at,
        username:  l.user?.username,
        itemName:  l.item?.item?.name ?? l.item?.serial_number,
        status:    l.status,
      }));

    // Pengembalian: status "returned"
    const returnRows: MergedRow[] = loans
      .filter((l) => l.status === "returned")
      .map((l) => ({
        id:        l.id,
        _source:   "return" as const,
        _label:    "Pengembalian Barang",
        _sortDate: l.return_date ?? l.created_at,
        username:  l.user?.username,
        itemName:  l.item?.item?.name ?? l.item?.serial_number,
        status:    l.status,
      }));

    return [...txRows, ...loanRows, ...returnRows]
      .sort(
        (a, b) =>
          new Date(b._sortDate).getTime() - new Date(a._sortDate).getTime()
      )
      .slice(0, 10);
  }, [transactions, loans]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Transactions
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gabungan transaksi masuk, peminjaman &amp; pengembalian terbaru
          </p>
        </div>
        {!loading && (
          <span className="inline-flex h-7 w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            {mergedRows.length} entri
          </span>
        )}
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
              // Skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j} className="py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-white/[0.05]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : mergedRows.length === 0 ? (
              <TableRow>
                <td
                  colSpan={6}
                  className="py-12 text-center text-sm text-gray-400 dark:text-gray-600"
                >
                  Belum ada transaksi
                </td>
              </TableRow>
            ) : (
              mergedRows.map((row, index) => (
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
                  <TableCell className="py-3">
                    <Badge size="sm" color={getStatusColor(row.status)}>
                      {row.status}
                    </Badge>
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