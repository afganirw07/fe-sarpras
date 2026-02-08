"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Package } from "lucide-react";
import { toast } from "sonner";
import { getDeletedItems, Item } from "@/lib/items";
import { restoreDeleteItems } from "@/lib/items";
import RestoreActionItems from "@/components/dialog/dialogItems/restoreItems";
import ButtonBack from "@/components/ui/button/backButton";

export default function TableTrashedItems() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const fetchDeletedItems = async () => {
    try {
      setLoading(true);
      const response = await getDeletedItems();
      // Extract data dari response
      if (response?.data && Array.isArray(response.data)) {
        setItems(response.data);
      } else if (Array.isArray(response)) {
        setItems(response);
      } else {
        console.warn("Invalid response format:", response);
        setItems([]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal ambil data items terhapus");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    const keyword = search.toLowerCase();
    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        (item.brand && item.brand.toLowerCase().includes(keyword)) ||
        item.category.toLowerCase().includes(keyword) ||
        item.subCategory.toLowerCase().includes(keyword)
      );
    });
  }, [items, search]);

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-3xl lg:max-w-7xl">
      {/* Header Card */}
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br rounded-xl from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Data Item (Terhapus)
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola item yang telah dihapus
              </p>
            </div>
          </div>
          <ButtonBack route="/items" />
        </div>
      </div>

      {/* Main Content Card */}
      <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">
        <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          {/* Search Bar */}
          <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
            <div className="relative w-full md:w-80">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari berdasarkan nama, kode, atau merek..."
                value={search}
                onChange={handleSearch}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                    <TableCell
                      isHeader
                      className="bg-linear-to-br w-20 from-gray-50 to-gray-100/50 px-8 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Kode
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Nama
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Merek
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Stok
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Kategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Sub Kategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br text-lexft w-32 from-gray-50 to-gray-100/50 px-8 py-4 text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 lg:px-4 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading && (
                    <TableRow>
                      <td colSpan={8} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Memuat data...
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  )}

                  {!loading && filteredItems.length === 0 && (
                    <TableRow>
                      <td colSpan={8} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Data tidak ditemukan
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Coba kata kunci pencarian lain
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  )}

                  {!loading &&
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
                          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[clamp(2px,0.85rem,12px)] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {item.code}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.brand || "-"}
                          </p>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className="rounded-lg border border-emerald-200 bg-emerald-100 px-3 py-1.5 text-[clamp(2px,0.85rem,12px)] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {item.category}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[clamp(2px,0.85rem,12px)] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            {item.subCategory}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {item.stock}
                            </span>
                            <span className="text-[clamp(2px,0.85rem,12px)] text-gray-500 dark:text-gray-400">
                              {item.unit}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <RestoreActionItems
                            itemId={item.id}
                            onSuccess={fetchDeletedItems}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
