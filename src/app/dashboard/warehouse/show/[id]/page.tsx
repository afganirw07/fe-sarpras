"use client";

import React, { ReactElement, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SquareArrowOutUpRight, 
  Focus, 
  QrCode, 
  Warehouse,
  Building2,
  Tag,
  User,
  Package,
  FileText,
  ArrowLeft,
  Download,
  Box,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getRoomById, Room } from "@/lib/warehouse";
import { Label } from "@/components/ui/label";

interface Item {
  id: number;
  nama: string;
  po_number: string;
  kondisi: string;
  status: string;
  sn_number: string;
}

const tableData: Item[] = [];

export default function TableDetailWarehouse() {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState<Room | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRoomById(id as string);
        setWarehouse(data);
      } catch {
        toast.error("Gagal ambil detail warehouse");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();
    return tableData.filter((item) => {
      return (
        item.nama.toLowerCase().includes(keyword) ||
        item.po_number.toLowerCase().includes(keyword) ||
        item.kondisi.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.sn_number.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("active") || statusLower.includes("available")) 
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (statusLower.includes("pending")) 
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (statusLower.includes("inactive")) 
      return "bg-gray-100 text-gray-700 border-gray-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getConditionColor = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("baik") || conditionLower.includes("good")) 
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (conditionLower.includes("rusak") || conditionLower.includes("broken")) 
      return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <Warehouse className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Warehouse tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <Warehouse className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Detail Warehouse
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Informasi lengkap warehouse dan item terkait
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Informasi Warehouse
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Warehouse className="h-4 w-4 text-blue-500" />
                Nama Warehouse
              </Label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
                {warehouse.name}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Tag className="h-4 w-4 text-blue-500" />
                Kode Warehouse
              </Label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
                {warehouse.code}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Building2 className="h-4 w-4 text-blue-500" />
                Kategori Warehouse
              </Label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
                {warehouse.type}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="h-4 w-4 text-blue-500" />
                Created by
              </Label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                -
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Data Item
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  className="gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40"
                >
                  <Download className="h-4 w-4" />
                  Generate Excel
                </Button>

                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900/50 dark:bg-blue-900/20">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {filteredItems.length} Item
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 relative w-full md:w-80">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari item berdasarkan nama, PO, atau SN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                    <TableCell
                      isHeader
                      className="w-20 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Nama Item
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      PO Number
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Kondisi
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      SN Number
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <td colSpan={6} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {search ? "Data tidak ditemukan" : "Tidak ada item"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {search ? "Coba kata kunci pencarian lain" : "Belum ada item di warehouse ini"}
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    filteredItems.map((item, index) => (
                      <TableRow 
                        key={item.id}
                        className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                      >
                        <TableCell className="px-6 py-4">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                            {index + 1}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.nama}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-cyan-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {item.po_number}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${getConditionColor(item.kondisi)}`}>
                            {item.kondisi.toLowerCase().includes("baik") || item.kondisi.toLowerCase().includes("good") ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5" />
                            )}
                            {item.kondisi}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {item.sn_number}
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
      </div>
  );
}