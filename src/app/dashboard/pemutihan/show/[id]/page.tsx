"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { DetailItem, getDeletedDetailItemById } from "@/lib/items";
import {
  Box,
  Tag,
  Hash,
  Warehouse,
  Activity,
  User,
  Calendar,
  Shield,
  Trash2,
} from "lucide-react";
import ButtonBack from "@/components/ui/button/backButton";

interface FieldConfig {
  label: string;
  value: string;
  icon: React.ReactNode;
  badge?: boolean;
}

const StatusBadge = ({ value }: { value: string }) => {
  const colorMap: Record<string, string> = {
    available:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    borrowed:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    damaged:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    Good: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    Fair: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    Poor: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    deleted:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };

  const color =
    colorMap[value] ??
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/10";

  return (
    <span
      className={`font-quicksand inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-semibold ${color}`}
    >
      {value}
    </span>
  );
};

export default function ShowPemutihan() {
  const params = useParams();
  const detailItemId = params?.id as string;

  const [detail, setDetail] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!detailItemId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getDeletedDetailItemById(detailItemId);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setDetail(data);
      } catch (error) {
        console.error("Failed to fetch detail item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [detailItemId]);

  const leftFields: FieldConfig[] = detail
    ? [
        {
          label: "Nama Item",
          value: detail.item?.name ?? "-",
          icon: <Box size={15} />,
        },
        {
          label: "Kategori Item",
          value: detail.item?.category?.name ?? "-",
          icon: <Tag size={15} />,
        },
        {
          label: "Sub Kategori Item",
          value: detail.item?.subcategory?.name ?? "-",
          icon: <Tag size={15} />,
        },
        {
          label: "Serial Number",
          value: detail.serial_number ?? "-",
          icon: <Hash size={15} />,
        },
        {
          label: "Ruangan / Warehouse",
          value: detail.room?.name ?? "-",
          icon: <Warehouse size={15} />,
        },
      ]
    : [];

  const rightFields: FieldConfig[] = detail
    ? [
        {
          label: "Status",
          value: detail.status ?? "-",
          icon: <Activity size={15} />,
          badge: true,
        },
        {
          label: "Kondisi",
          value: detail.condition ?? "-",
          icon: <Shield size={15} />,
          badge: true,
        },
        {
          label: "Dibuat Oleh",
          value: detail.userId?.username ?? "-",
          icon: <User size={15} />,
        },
        {
          label: "Tanggal Dibuat",
          value: detail.created_at
            ? new Date(detail.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-",
          icon: <Calendar size={15} />,
        },
        {
          label: "Tanggal Dihapus",
          value: detail.deleted_at
            ? new Date(detail.deleted_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-",
          icon: <Trash2 size={15} />,
        },
      ]
    : [];

  return (
    <div className="font-quicksand flex flex-col gap-6">
      {/* Main Card */}
      <div className="w-full rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        {/* Card Header */}
        <div className="border-b border-gray-200/50 px-8 py-6 dark:border-white/5">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex w-full items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-500/20">
                <Trash2 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-quicksand text-xl font-bold text-gray-900 dark:text-white">
                  Detail Pemutihan
                </h1>
                <p className="font-quicksand text-sm text-gray-500 dark:text-gray-400">
                  Informasi lengkap barang yang telah dihapus
                </p>
              </div>
            </div>
            <ButtonBack route="/pemutihan" />
          </div>
        </div>

        {/* Card Content */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-500 dark:border-gray-700 dark:border-t-red-400" />
              <p className="font-quicksand text-sm text-gray-500 dark:text-gray-400">
                Memuat data...
              </p>
            </div>
          ) : !detail ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16">
              <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                <Box className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-quicksand text-sm font-medium text-gray-900 dark:text-white">
                Data tidak ditemukan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:divide-x md:divide-gray-100 dark:md:divide-white/5">
              {/* Kolom Kiri */}
              <div className="flex flex-col gap-6 md:pr-16">
                {leftFields.map((field, i) => (
                  <div key={i} className="grid gap-1.5">
                    <label className="font-quicksand flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <span className="text-red-500">{field.icon}</span>
                      {field.label}
                    </label>
                    <Input
                      value={field.value}
                      readOnly
                      className="font-quicksand h-11 border-gray-200/80 bg-gray-50/80 text-sm font-medium text-gray-800 focus-visible:ring-red-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              {/* Kolom Kanan */}
              <div className="flex flex-col gap-6 md:pl-16">
                {rightFields.map((field, i) => (
                  <div key={i} className="grid gap-1.5">
                    <label className="font-quicksand flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <span className="text-red-500">{field.icon}</span>
                      {field.label}
                    </label>
                    {field.badge ? (
                      <StatusBadge value={field.value} />
                    ) : (
                      <Input
                        value={field.value}
                        readOnly
                        className="font-quicksand h-11 border-gray-200/80 bg-gray-50/80 text-sm font-medium text-gray-800 focus-visible:ring-red-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}