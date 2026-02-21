"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
import { 
  Search, 
  Pencil, 
  Trash2, 
  SquareArrowOutUpRight, 
  Warehouse, 
  Building2, 
  Tag, 
  QrCode,
  Archive
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Textarea } from "../../../ui/textarea";
import DialogAddWarehouse from "../../../dialog/dialogWarehouse/dialogaddWarehouse";
import ActionButtonsWarehouse from "@/components/dialog/dialogWarehouse/dialogActionWarehouse";
import { getRooms, Room } from "@/lib/warehouse";
import ButtonQrWarehouse from "@/components/button-qr/buttonQrWarehouse";
import { QRCodeCanvas } from "qrcode.react";
import ButtonTrashed from "@/components/ui/button/trashedButton";
import Pagination from "../../Pagination";

export default function TableWarehouse() {
  const [warehouses, setWarehouses] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 3;

const fetchWarehouses = async (page = currentPage) => {
  try {
    setLoading(true);

    const res = await getRooms(page, perPage);

    setWarehouses(res.data);
    setTotalPages(res.pagination.totalPages);
    setTotalItems(res.pagination.total);
  } catch (error: any) {
    toast.error(error?.message || "Gagal mengambil data warehouse");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchWarehouses(currentPage);
}, [currentPage]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredWarehouses = useMemo(() => {
    const keyword = search.toLowerCase();
    
    return warehouses.filter((warehouse) => {
      return (
        warehouse.code.toLowerCase().includes(keyword) ||
        warehouse.type.toLowerCase().includes(keyword) ||
        warehouse.name.toLowerCase().includes(keyword)
      );
    });
  }, [warehouses, search]);

  return (
        <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-xs">
        <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
            <div className="relative w-full md:w-80">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari warehouse, kategori, atau instansi..."
                value={search}
                onChange={handleSearch}
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
                      Warehouse
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Kategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Instansi
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
                  {loading ? (
                    <TableRow>
                      <td colSpan={5} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                        </div>
                      </td>
                    </TableRow>
                  ) : filteredWarehouses.length === 0 ? (
                    <TableRow>
                      <td colSpan={5} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                            <Warehouse className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {search ? "Data tidak ditemukan" : "Tidak ada warehouse"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {search ? "Coba kata kunci pencarian lain" : "Tambahkan warehouse baru untuk memulai"}
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    filteredWarehouses.map((item, index) => (
                      <TableRow 
                        key={item.id}
                        className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                      >
                        <TableCell className="px-6 py-4">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 lg:text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                           {(currentPage - 1) * perPage + index + 1}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 lg:text-xs font-semibold text-white shadow-lg shadow-blue-500/20">
                              {item.code.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.code}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {item.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="rounded-md bg-blue-50 px-2.5 py-1 lg:text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {item.type}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="lg:text-xs text-gray-700 dark:text-gray-300">
                              {item.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <ActionButtonsWarehouse
                            room={item}
                            onSuccess={fetchWarehouses}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
            <div className="flex justify-between p-4">
             <div className="flex items-center gap-4 text-sm text-muted-foreground">
<span>
  Showing{" "}
  {(currentPage - 1) * perPage + 1} –{" "}
  {Math.min(currentPage * perPage, totalItems)}{" "}
  of {totalItems}
</span>

  <span className="text-gray-400">|</span>

  <span>{perPage} rows per page</span>
</div>

  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={(page) => setCurrentPage(page)}
  />
</div>

)}
          </div>
          </div>
        </div>
  );
}