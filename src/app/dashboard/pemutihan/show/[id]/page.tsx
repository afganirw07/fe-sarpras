"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { getPurgingById, Purging } from "@/lib/purging";
import {
  Box, Tag, Hash, Warehouse, Activity, User,
  Calendar, Shield, FileText, PackageX, ClipboardList,
} from "lucide-react";
import ButtonBack from "@/components/ui/button/backButton";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table/index";

interface FieldConfig {
  label: string;
  value: string;
  icon: React.ReactNode;
  badge?: boolean;
}

const StatusBadge = ({ value }: { value: string }) => {
  const colorMap: Record<string, string> = {
    available:   "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    borrowed:    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    damaged:     "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    Good:        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    Fair:        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    Poor:        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    pending:     "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    approved:    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    rejected:    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };

  const color = colorMap[value]
    ?? "bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/10";

  return (
    <span className={`font-quicksand inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-semibold ${color}`}>
      {value}
    </span>
  );
};

export default function ShowPemutihan() {
  const params = useParams();
  const purgingId = params?.id as string;

  const [purging, setPurging] = useState<Purging | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!purgingId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getPurgingById(purgingId);
        setPurging(res.data);
      } catch (error) {
        console.error("Failed to fetch purging:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [purgingId]);

  const leftFields: FieldConfig[] = purging ? [
    { label: "Nama Item",    value: purging.item_name ?? "-",  icon: <Box size={15} /> },
    { label: "Kategori",     value: purging.category ?? "-",   icon: <Tag size={15} /> },
    { label: "Serial Number",value: purging.serial_number ?? "-", icon: <Hash size={15} /> },
    { label: "Dibuat Oleh", value: purging.createdBy?.username ?? purging.created_by ?? "-", icon: <User size={15} /> },
    {
      label: "Tanggal Dibuat",
      value: purging.created_at
        ? new Date(purging.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
        : "-",
      icon: <Calendar size={15} />,
    },
  ] : [];

  const rightFields: FieldConfig[] = purging ? [
    { label: "Kondisi",        value: purging.condition ?? "-",     icon: <Shield size={15} />,    badge: true },
    { label: "Status Barang",  value: purging.item_status ?? "-",   icon: <Activity size={15} />,  badge: true },
    { label: "Status Surat",   value: purging.letter_status ?? "-", icon: <FileText size={15} />,  badge: true },
    {
      label: "Tanggal Update",
      value: purging.updated_at
        ? new Date(purging.updated_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
        : "-",
      icon: <Calendar size={15} />,
    },
    {
      label: "Tanggal Dihapus",
      value: purging.deleted_at
        ? new Date(purging.deleted_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
        : "Belum dihapus",
      icon: <PackageX size={15} />,
    },
  ] : [];

  return (
    <div className="font-quicksand flex flex-col gap-6">
      {/* Header Card */}
      <div className="w-full rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="border-b border-gray-200/50 px-8 py-6 dark:border-white/5">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-500/20">
                <PackageX size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-quicksand text-xl font-bold text-gray-900 dark:text-white">
                  Detail Pemutihan
                </h1>
                <p className="font-quicksand text-sm text-gray-500 dark:text-gray-400">
                  Informasi lengkap data pemutihan barang
                </p>
              </div>
            </div>
            <ButtonBack route="/pemutihan" />
          </div>
        </div>

        {/* Info Fields */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-500 dark:border-gray-700 dark:border-t-red-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
            </div>
          ) : !purging ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16">
              <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                <Box className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Data tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:divide-x md:divide-gray-100 dark:md:divide-white/5">
              {/* Kolom Kiri */}
              <div className="flex flex-col gap-6 md:pr-16">
                {leftFields.map((field, i) => (
                  <div key={i} className="grid gap-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <span className="text-red-500">{field.icon}</span>
                      {field.label}
                    </label>
                    <Input
                      value={field.value}
                      readOnly
                      className="h-11 border-gray-200/80 bg-gray-50/80 text-sm font-medium text-gray-800 focus-visible:ring-red-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              {/* Kolom Kanan */}
              <div className="flex flex-col gap-6 md:pl-16">
                {rightFields.map((field, i) => (
                  <div key={i} className="grid gap-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <span className="text-red-500">{field.icon}</span>
                      {field.label}
                    </label>
                    {field.badge ? (
                      <StatusBadge value={field.value} />
                    ) : (
                      <Input
                        value={field.value}
                        readOnly
                        className="h-11 border-gray-200/80 bg-gray-50/80 text-sm font-medium text-gray-800 focus-visible:ring-red-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Table Card */}
      {!loading && purging && (
        <div className="w-full rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="border-b border-gray-200/50 px-8 py-5 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                <ClipboardList size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Detail Item</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {purging.details?.length ?? 0} item dalam pemutihan ini
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {["No", "Nama Item", "Kategori", "Serial Number", "Kondisi", "Status"].map((h, i) => (
                    <TableCell
                      key={i}
                      isHeader
                      className="bg-gradient-to-br from-gray-50 to-gray-100/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!purging.details || purging.details.length === 0 ? (
                  <TableRow>
                    <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                      Tidak ada detail item
                    </td>
                  </TableRow>
                ) : (
                  purging.details.map((detail, index) => (
                    <TableRow
                      key={detail.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-4 py-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {detail.item_name ?? "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="inline-block rounded-lg border border-green-200 bg-lime-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {detail.category ?? "-"}
                        </span>
                      </TableCell>
                      {/* <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {detail.subcategory || "-"}
                      </TableCell> */}
                      <TableCell className="px-4 py-3">
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {detail.serial_number ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <StatusBadge value={detail.condition ?? "-"} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <StatusBadge value={detail.item_status ?? "-"} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200/50 px-6 py-3 dark:border-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total: <span className="font-semibold">{purging.details?.length ?? 0}</span> item
            </p>
          </div>
        </div>
      )}
    </div>
  );
}