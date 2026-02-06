"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import { Search, Package } from "lucide-react";
import { toast } from "sonner";
import { Item } from "@/lib/items";
import DialogAddItems from "@/components/dialog/dialogItems/dialogAddItems";
import ActionButtonsItems from "@/components/dialog/dialogItems/dialogActionButtonsItems";

const tableData: Item[] = [
  {
    id: "13131313",
    code: "ITM001",
    name: "Laptop",
    brand: "Dell",
    subCategory: "OS-4220",
    price: 120000,
    category: "Elektronik",
    unit: 25,
  },
  {
    id: "31414424",
    code: "ITM002",
    name: "Monitor",
    brand: "LG",
    subCategory: "OS-422",
    price: 120000,
    category: "Elektronik",
    unit: 40,
  },
  {
    id: "151132163",
    code: "ITM003",
    name: "PC",
    brand: "Logitech",
    subCategory: "OS-422",
    price: 120000,
    category: "Aksesoris",
    unit: 15,
  },
  {
    id: "13414669",
    code: "ITM004",
    name: "PC",
    brand: "Logitech",
    subCategory: "OS-422",
    price: 120000,
    category: "Aksesoris",
    unit: 30,
  },
  {
    id: "1313456613",
    code: "ITM005",
    name: "PC",
    brand: "HP",
    subCategory: "OS-422",
    price: 120000,
    category: "Elektronik",
    unit: 12,
  },
];

export default function TableItems() {
  const [items, setItems] = useState<Item[]>([])
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

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
    const keyword = search.toLowerCase();
    return tableData.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        item.brand.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.subCategory.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const kirimAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Item berhasil ditambahkan");
  };


  return (
    <>
        {/* Main Content Card */}
        <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
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
          <div className="relative overflow-x-auto">
  <div className="inline-block min-w-full align-middle">
    <Table className="w-full table-auto">
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
                      Kode
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                      >
                      Nama
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                      >
                      Merek
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                      >
                      Harga
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
                      Sub Kategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                      >
                      Unit
                    </TableCell>
                    <TableCell
                      isHeader
                      className="w-32 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
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
                          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
                            {item.brand}
                          </p>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatRupiah(item.price)}
                          </p>
                        </TableCell>
                        
                        <TableCell className="px-6 py-4">
                          <span className="rounded-lg border border-emerald-200 bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {item.category}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            {item.subCategory}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {item.unit}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              pcs
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <ActionButtonsItems/>
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