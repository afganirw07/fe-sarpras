"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getItems, Item } from "@/lib/items";
import ActionButtonsItems from "@/components/dialog/dialogItems/dialogActionButtonsItems";
import Pagination from "../../Pagination";

export default function TableItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;

  const fetchItems = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await getItems(page, perPage);
      console.log("Response:", response);

      if (response?.data && Array.isArray(response.data)) {
        setItems(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.total);
      } else if (Array.isArray(response)) {
        setItems(response);
      } else {
        console.warn("Invalid response format:", response);
        setItems([]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal ambil data items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredRows = useMemo(() => {
    if (!Array.isArray(items)) {
      console.warn("Items is not an array:", items);
      return [];
    }
    const keyword = search.toLowerCase();
    return items.filter((item) => {
      const categoryName = item.category?.name || "";
      const subcategoryName = item.subcategory?.name || "";

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        (item.brand && item.brand.toLowerCase().includes(keyword)) ||
        categoryName.toLowerCase().includes(keyword) ||
        subcategoryName.toLowerCase().includes(keyword)
      );
    });
  }, [search, items]);

  const tableHeaders = [
    { label: "No", className: "w-20" },
    { label: "Kode" },
    { label: "Nama" },
    { label: "Merek" },
    { label: "Stok" },
    { label: "Kategori" },
    { label: "Sub Kategori" },
    { label: "Unit" },
    { label: "Action", className: "w-32" },
  ];

  const renderEmptyState = (message: string, description: string) => (
    <TableRow>
      <td colSpan={9} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </td>
    </TableRow>
  );

  const renderLoadingState = () => (
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
  );

  return (
    <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-md mx-auto">
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
                  {tableHeaders.map((header, index) => (
                    <TableCell
                      key={index}
                      isHeader
                      className={`bg-linear-to-br from-gray-50 to-gray-100/50 px-8 py-4 lg:px-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300 ${
                        header.className || ""
                      }`}
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && renderLoadingState()}

                {!loading &&
                  filteredRows.length === 0 &&
                  renderEmptyState(
                    "Data tidak ditemukan",
                    "Coba kata kunci pencarian lain"
                  )}

                {!loading &&
                  filteredRows.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-6 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(currentPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>

                      <TableCell className="px-4 py-4">
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.stock}
                        </p>
                      </TableCell>

                      <TableCell className="px-4 py-4">
                        <p className="inline-block rounded-lg border border-green-200 bg-lime-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 truncate max-w-35">
                          {item.category?.name || "-"}
                        </p>
                      </TableCell>

                      <TableCell className="px-4 py-4">
                        <span className="inline-block rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 truncate max-w-35">
                          {item.subcategory?.name || "-"}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.unit}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <ActionButtonsItems item={item} onSuccess={fetchItems} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200/50 dark:border-white/5">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {(currentPage - 1) * perPage + 1} –{" "}
                {Math.min(currentPage * perPage, totalItems)} of {totalItems}
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
  );
}