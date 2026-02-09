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
        .some((sub) => 
          sub.name.toLowerCase().includes(keyword) ||
          sub.code.toLowerCase().includes(keyword)
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

      <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-lg mx-auto">
        <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                  Manajemen Kategori
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola kategori dan subkategori
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
            <DialogCategory onSuccess={fetchAllData} />
            <ButtonTrashed route="kategori"/>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Kategori</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Subkategori</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {subcategories.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Tag className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hasil Pencarian</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredCategories.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
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
                      Nama Kategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Instansi
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Subkategori
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
                      <td colSpan={6} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
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
                            {search ? "Data tidak ditemukan" : "Tidak ada kategori"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {search ? "Coba kata kunci pencarian lain" : "Tambahkan kategori baru untuk memulai"}
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
                        <TableCell className="px-6 py-4 border border-gray-200">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                            {(currentPage - 1) * PAGE_SIZE + index + 1}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {category.code}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
                              {category.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {category.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {category.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {category.instansi || "TB-002"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 border border-gray-200">
                          {(() => {
                            const subs = subcategories.filter(
                              (sub) => sub.category_id === category.id,
                            );

                            return subs.length ? (
                              <div className="space-y-1.5">
                                {subs.map((sub) => (
                                  <div 
                                    key={sub.id}
                                    className="flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-50 to-purple-50 px-3 py-2 dark:from-blue-900/20 dark:to-purple-900/20"
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                                      {sub.name}
                                    </span>
                                    <span className="ml-auto rounded bg-blue-200/50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-800/30 dark:text-blue-400">
                                      {sub.code}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-white/5">
                                <span className="text-sm text-gray-400">
                                  Belum ada subkategori
                                </span>
                              </div>
                            );
                          })()}
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center border border-gray-200">
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