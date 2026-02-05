"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { 
  Search, 
  SquareArrowOutUpRight, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  User, 
  Package, 
  ArrowLeft,
  Box,
  Warehouse,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

import { Supplier, getSupplierById } from "@/lib/supplier";
import { Button } from "@/components/ui/button";

interface Item {
  id: string;
  sn_number: string;
  warehouse: string;
  po_number: string;
  condition: string;
  status: string;
}

export default function SupplierShowPage() {
  const { id } = useParams<{ id: string }>();

  const [supplier, setSupplier] = useState<Supplier | null>();
  const [items] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchSupplier = async () => {
      try {
        const data = await getSupplierById(id);
        setSupplier(data);
      } catch {
        toast.error("Gagal mengambil detail supplier");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((item) => {
      return (
        item.sn_number.toLowerCase().includes(keyword) ||
        item.warehouse.toLowerCase().includes(keyword) ||
        item.po_number.toLowerCase().includes(keyword) ||
        item.condition.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      );
    });
  }, [items, search]);

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

  if (!supplier) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <Truck className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Supplier tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-2 sm:p-3 shadow-lg shadow-blue-500/20">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Detail Supplier
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Informasi lengkap supplier dan item terkait
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <h2 className="mb-4 sm:mb-6 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            Informasi Supplier
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                Nama Supplier
              </Label>
              <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white wrap-break-word">
                {supplier.name}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500" />
                Instansi Supplier
              </Label>
              <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white wrap-break-word">
                SMK Taruna Bhakti
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                Email Supplier
              </Label>
              <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white break-all">
                {supplier.email}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                Kontak Supplier
              </Label>
              <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
                {supplier.phone_number}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500" />
                Alamat Supplier
              </Label>
              <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white warp-break-words">
                {supplier.address}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-500" />
                Created by
              </Label>
              <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                -
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="border-b border-gray-200/50 p-4 sm:p-6 dark:border-white/5">
            <div className="flex flex-col gap-4">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                Data Item
              </h2>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    placeholder="Cari item..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg sm:rounded-xl border border-gray-200 bg-white py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                  />
                </div>

                <div className="rounded-lg sm:rounded-xl border border-blue-200 bg-blue-50 px-3 sm:px-4 py-2 dark:border-blue-900/50 dark:bg-blue-900/20 self-start sm:self-auto">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                    {filteredItems.length} Item
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="block lg:hidden">
            {filteredItems.length === 0 ? (
              <div className="py-12 sm:py-16">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? "Data tidak ditemukan" : "Tidak ada item"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                    {search ? "Coba kata kunci pencarian lain" : "Belum ada item terkait supplier ini"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50 dark:divide-white/5">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                            {index + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Box className="h-3.5 w-3.5 text-blue-500" />
                              <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {item.sn_number}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/dashboard/items/detail/${item.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-lg border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 h-8 px-2.5 text-xs"
                          >
                            <SquareArrowOutUpRight className="h-3.5 w-3.5" />
                            <span className="hidden xs:inline">Detail</span>
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Warehouse className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Warehouse</span>
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium">{item.warehouse}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <FileText className="h-3.5 w-3.5 text-blue-500" />
                            <span>PO Number</span>
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium">{item.po_number}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold ${getConditionColor(item.condition)}`}>
                          {item.condition.toLowerCase().includes("baik") || item.condition.toLowerCase().includes("good") ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {item.condition}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                    <TableCell
                      isHeader
                      className="w-20 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Id
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      User
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Warehouse
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="w-32 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Aksi
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredItems.length === 0 ? (
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
                            {search ? "Coba kata kunci pencarian lain" : "Belum ada item terkait supplier ini"}
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
                              {item.sn_number}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4 text-indigo-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {item.warehouse}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {item.po_number}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${getConditionColor(item.condition)}`}>
                            {item.condition.toLowerCase().includes("baik") || item.condition.toLowerCase().includes("good") ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5" />
                            )}
                            {item.condition}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/dashboard/items/detail/${item.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2 rounded-lg border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                                >
                                  <SquareArrowOutUpRight className="h-4 w-4" />
                                  Detail
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Lihat detail item</TooltipContent>
                          </Tooltip>
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