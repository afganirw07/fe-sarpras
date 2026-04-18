"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
import { Search, Focus } from "lucide-react";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { getDetailItemsByItemId, DetailItem } from "@/lib/items";
import ActionButtonsDetailItems from "@/components/dialog/dialogItems/Detail/dialogActionButtonDetails";
import ButtonBack from "@/components/ui/button/backButton";
import Pagination from "../../Pagination";
import ButtonQrShowItem from "@/components/button-qr/buttonQrShowItem";
import ButtonQrSmallItem from "@/components/button-qr/buttonQrSmallItem";

const PER_PAGE = 10;

export default function TableShow() {
  const params = useParams();
  const itemId = params?.id as string;

  const [detailItems, setDetailItems]   = useState<DetailItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalItems, setTotalItems]     = useState(0);

  // ── Selection state ──────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isAllSelected =
    detailItems.length > 0 && detailItems.every((d) => selectedIds.has(d.id));
  const isIndeterminate =
    detailItems.some((d) => selectedIds.has(d.id)) && !isAllSelected;

  const toggleAll = () => {
    if (isAllSelected) {
      // Uncheck semua item di halaman ini
      setSelectedIds((prev) => {
        const next = new Set(prev);
        detailItems.forEach((d) => next.delete(d.id));
        return next;
      });
    } else {
      // Check semua item di halaman ini
      setSelectedIds((prev) => {
        const next = new Set(prev);
        detailItems.forEach((d) => next.add(d.id));
        return next;
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Item yang terpilih untuk dikirim ke ButtonQrShowItem
  const selectedItems = detailItems.filter((d) => selectedIds.has(d.id));

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (page: number = 1, keyword: string = "") => {
    if (!itemId) return;
    try {
      setLoading(true);
      const detailRes = await getDetailItemsByItemId(itemId, page, PER_PAGE, keyword);
      setDetailItems(detailRes.data);
      if (detailRes.pagination) {
        setTotalPages(detailRes.pagination.totalPages);
        setTotalItems(detailRes.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchData(currentPage, search);
  }, [currentPage, itemId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchData(1, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const firstItem    = detailItems[0];
  const itemName     = firstItem?.item?.name ?? "-";
  const categoryName = firstItem?.item?.category?.name ?? "-";
  const subCategory  = firstItem?.item?.subcategory?.name ?? "-";
  const createdBy    = firstItem?.userId?.username ?? firstItem?.created_by ?? "-";
  const spesifikasi   = firstItem?.item?.spesifikasi ?? "-";

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-sm rounded-xl border p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-6">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Detail Master Item
          </h1>

          {loading && detailItems.length === 0 ? (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              Memuat data...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Nama Item :</Label>
                <Input value={itemName} readOnly />
              </div>
              <div className="grid gap-2">
                <Label>Subkategori Item :</Label>
                <Input value={subCategory} readOnly />
              </div>
              <div className="grid gap-2">
                <Label>Kategori Item :</Label>
                <Input value={categoryName} readOnly />
              </div>
              <div className="grid gap-2">
                <Label>Created By :</Label>
                <Input value={createdBy} readOnly />
              </div>
              <div className="grid gap-2">
                <Label>Spesifikasi :</Label>
                <Input value={spesifikasi} readOnly />
              </div>
            </div>
          )}
        </div>

        <div className="mt-12">
          <div className="flex w-full justify-between">
            <h1 className="font-quicksand text-2xl font-semibold mb-6">Data Item</h1>
            <ButtonBack route="/items" />
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

            {/* Search & Buttons */}
            <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-80">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Cari berdasarkan SN, warehouse, atau status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {/* Badge jumlah terpilih */}
                  {selectedIds.size > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedIds.size} item dipilih
                    </span>
                  )}
                  <ButtonQrShowItem
                    items={selectedItems.length > 0 ? selectedItems : detailItems}
                    itemName={itemName}
                  />
                   <ButtonQrSmallItem
                    items={selectedItems.length > 0 ? selectedItems : detailItems}
                    itemName={itemName}
                  />
            
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-gray-200/50 dark:border-white/5">

                      {/* Checkbox select all */}
                      <TableCell
                        isHeader
                        className="w-10 bg-linear-to-br from-gray-50 to-gray-100/50 px-2 py-4 dark:from-white/5 dark:to-white/10"
                      >
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = isIndeterminate;
                          }}
                          onChange={toggleAll}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-indigo-600"
                        />
                      </TableCell>

                      {["No", "SN Number", "Warehouse", "PO Number", "Kondisi", "Status", "Action"].map((h, i) => (
                        <TableCell
                          key={i}
                          isHeader
                          className="bg-linear-to-br from-gray-50 to-gray-100/50 px-2 py-4 text-left text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <td colSpan={8} className="py-12 text-center text-sm text-gray-500">
                          Memuat data...
                        </td>
                      </TableRow>
                    ) : detailItems.length === 0 ? (
                      <TableRow>
                        <td colSpan={8} className="py-12 text-center text-sm text-gray-500">
                          Tidak ada data item
                        </td>
                      </TableRow>
                    ) : (
                      detailItems.map((d, index) => (
                        <TableRow
                          key={d.id}
                          className={`border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5 ${
                            selectedIds.has(d.id)
                              ? "bg-indigo-50/60 dark:bg-indigo-900/10"
                              : ""
                          }`}
                        >
                          {/* Checkbox per row */}
                          <TableCell className="px-2 py-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(d.id)}
                              onChange={() => toggleOne(d.id)}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-indigo-600"
                            />
                          </TableCell>

                          <TableCell className="px-2 py-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                              {(currentPage - 1) * PER_PAGE + index + 1}
                            </span>
                          </TableCell>

                          <TableCell className="px-2 py-4">
                            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {d.serial_number}
                            </span>
                          </TableCell>

                          <TableCell className="px-2 py-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {d.room?.name || "-"}
                            </p>
                          </TableCell>

                          <TableCell className="px-2 py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {d.transaction?.po_number || "-"}
                            </p>
                          </TableCell>

                          <TableCell className="px-2 py-4">
                            <span
                              className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                                d.condition === "Poor"
                                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : d.condition === "Fair"
                                  ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              }`}
                            >
                              {d.condition}
                            </span>
                          </TableCell>

                          <TableCell className="px-2 py-4">
                            <span className="inline-block rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                              {d.status}
                            </span>
                          </TableCell>

                          <TableCell className="px-2 py-4 text-center">
                            <ActionButtonsDetailItems
                              item={d}
                              onSuccess={() => fetchData(currentPage, search)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Footer + Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/50 p-4 dark:border-white/5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Item: <span className="font-medium">{totalItems}</span> item
                {totalPages > 1 && (
                  <span className="ml-2 text-gray-400">
                    · Halaman {currentPage} dari {totalPages}
                  </span>
                )}
              </p>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}