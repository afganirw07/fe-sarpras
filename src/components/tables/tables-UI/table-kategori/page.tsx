"use client";

import React, { ReactElement, useMemo } from "react";
import Pagination from "../../Pagination";
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
  ArrowRightFromLine,
  FolderOpen,
  Tag,
  Building2,
  List,
} from "lucide-react";
import DialogCategory from "@/components/dialog/dialogCategory/dialogAddCategory";
import { useEffect, useState } from "react";
import {
  getCategories,
  Category,
  Subcategory,
  getSubcategories,
} from "@/lib/category";
import { toast } from "sonner";
import ActionButtonsCategory from "@/components/dialog/dialogCategory/dialogActionCategory";
import ButtonTrashed from "@/components/ui/button/trashedButton";

export default function TableKategori() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [catsRes, subsRes] = await Promise.all([
        getCategories(),
        getSubcategories(),
      ]);

      setCategories(catsRes.data);
      setSubcategories(subsRes.data);
    } catch {
      toast.error("Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("SUBCATEGORIES UPDATED:", subcategories);
  }, [subcategories]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCategories = useMemo(() => {
    const keyword = search.toLowerCase();

    return categories.filter((category) => {
      const matchesCategory =
        category.name.toLowerCase().includes(keyword) ||
        category.code.toLowerCase().includes(keyword) ||
        (category.instansi?.toLowerCase().includes(keyword) ?? false);

      const matchesSubcategory = subcategories
        .filter((sub) => sub.category_id === category.id)
        .some(
          (sub) =>
            sub.name.toLowerCase().includes(keyword) ||
            sub.code.toLowerCase().includes(keyword),
        );

      return matchesCategory || matchesSubcategory;
    });
  }, [categories, subcategories, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredCategories.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCategories, currentPage]);

  return (
    

      <div className="mx-auto w-full max-w-xs md:max-w-3xl lg:max-w-7xl">
        <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          {/* Search Bar */}
          <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
            <div className="relative w-full md:w-80">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari kategori, kode, atau instansi..."
                value={search}
                onChange={handleSearch}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>

         <div className="relative w-full overflow-x-auto lg:overflow-x-visible">
              <Table className="min-w-225 lg:min-w-full table-auto">
                <TableHeader>
                  <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                    <TableCell
                      isHeader
                      className="bg-linear-to-br w-20 from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Kode
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Nama Kategori
                    </TableCell>
                    {/* <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Instansi
                    </TableCell> */}
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-left text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Subkategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br w-32 from-gray-50 to-gray-100/50 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-center text-[clamp(10px,0.7rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Aksi
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <td colSpan={6} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Memuat data...
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <td colSpan={6} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {search
                              ? "Data tidak ditemukan"
                              : "Tidak ada kategori"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {search
                              ? "Coba kata kunci pencarian lain"
                              : "Tambahkan kategori baru untuk memulai"}
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    paginatedCategories.map((category, index) => (
                      <TableRow
                        key={category.id}
                        className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                      >
                        <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                            {(currentPage - 1) * PAGE_SIZE + index + 1}
                          </span>
                        </TableCell>

                        <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <Tag className="h-[clamp(12px,1vw,16px)] w-[clamp(12px,1vw,16px)] text-blue-500" />
                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[clamp(9px,0.65rem,11px)] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {category.code}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="bg-linear-to-br flex h-10 w-10 items-center justify-center rounded-lg from-blue-500 to-blue-600 text-[clamp(11px,0.85rem,14px)] font-semibold text-white shadow-lg shadow-blue-500/20">
                              {category.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p
                                className="max-w-40 truncate whitespace-nowrap text-[clamp(10px,0.7rem,10px)]"
                              >
                                {category.name}
                              </p>

                             <p
                                className="max-w-40 truncate whitespace-nowrap text-[clamp(10px,0.7rem,10px)]"
                              >
                                ID: {category.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="max-w-40 truncate whitespace-nowrap text-[clamp(10px,0.7rem,10px)]] text-gray-700 dark:text-gray-300">
                              {category.instansi || "TB-002"}
                            </span>
                          </div>
                        </TableCell> */}

                        <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] dark:border-gray-800">
                          {(() => {
                            const subs = subcategories.filter(
                              (sub) => sub.category_id === category.id,
                            );

                            return subs.length ? (
                              <div className="space-y-1.5">
                                {subs.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="bg-linear-to-r flex items-center gap-2 rounded-lg from-blue-50 to-purple-50 px-3 py-2 dark:from-blue-900/20 dark:to-purple-900/20"
                                  >
                                    {/* <div className="h-1.5 w-1.5 rounded-full bg-blue-500 sm:hidden"></div> */}
                                    <span className="text-[clamp(9px,0.65rem,11px)] font-medium text-blue-900 dark:text-blue-300">
                                      {sub.name}
                                    </span>
                                    <span className="ml-auto rounded bg-blue-200/50 px-2 py-0.5 text-[clamp(9px,0.65rem,11px)] font-semibold text-blue-700 dark:bg-blue-800/30 dark:text-blue-400">
                                      {sub.code}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-white/5">
                                <span className="text-[clamp(11px,0.85rem,14px)] text-gray-400">
                                  Belum ada subkategori
                                </span>
                              </div>
                            );
                          })()}
                        </TableCell>

                        <TableCell className="border border-gray-200 px-[clamp(12px,1vw,20px)] py-[clamp(10px,0.9vw,16px)] text-center dark:border-gray-800">
                          <ActionButtonsCategory
                            categoryId={category.id}
                            onSuccess={fetchAllData}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex justify-end border-t border-gray-200/50 p-4 dark:border-white/5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
  );
}
