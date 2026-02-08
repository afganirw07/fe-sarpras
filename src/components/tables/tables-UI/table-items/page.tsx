"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import { Search, Package } from "lucide-react";
import { toast } from "sonner";
import { getItems, Item } from "@/lib/items";
import ActionButtonsItems from "@/components/dialog/dialogItems/dialogActionButtonsItems";

export default function TableItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

const fetchItems = async () => {
  try {
    setLoading(true);
    const response = await getItems();
    console.log('Response:', response); 
    
    if (response?.data && Array.isArray(response.data)) {
      setItems(response.data);
    } else if (Array.isArray(response)) {
      setItems(response);
    } else {
      console.warn('Invalid response format:', response);
      setItems([]);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error("Gagal ambil data items");
    setItems([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchItems();
  }, []);

  // Fungsi untuk format Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredRows = useMemo(() => {
    if (!Array.isArray(items)) {
    console.warn('Items is not an array:', items);
    return [];
  }
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
  }, [search, items]); // Tambahkan items sebagai dependency

  return (
    <>
        {/* responsive table */}
          <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-xs mx-auto">
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

        <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  <TableCell
                    isHeader
                    className="w-20 bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Kode
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Nama
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Merek
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Stok
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Kategori
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Sub Kategori
                  </TableCell>
                  <TableCell
                    isHeader
                    className="bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Unit
                  </TableCell>
                  <TableCell
                    isHeader
                    className="w-32 bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-lexft text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <td colSpan={9} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Memuat data...
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading && filteredRows.length === 0 && (
                  <TableRow>
                    <td colSpan={9} className="py-16">
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
                  filteredRows.map((item, index) => (
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
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.brand || "-"}
                        </p>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.stock}
                        </p>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                          {item.category}
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[clamp(2px,0.85rem,12px)] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          {item.subCategory}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.unit}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <ActionButtonsItems
                        item={item} 
                        onSuccess={fetchItems}  />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          </div>
          </div>
    </>
  );
}