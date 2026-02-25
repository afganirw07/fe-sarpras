"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
import { Search, QrCode, Focus } from "lucide-react";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { getDetailItemsByItemId, DetailItem } from "@/lib/items";
import ActionButtonsDetailItems from "@/components/dialog/dialogItems/Detail/dialogActionButtonDetails";

interface ItemDetail {
  id: string;
  name: string;
  category: { name: string };
  subcategory: { name: string };
}

export default function TableShow() {
  const params = useParams();
  const itemId = params?.id as string;

  const [detailItems, setDetailItems] = useState<DetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const detailRes = await getDetailItemsByItemId(itemId);
    setDetailItems(detailRes.data);
  } catch (error) {
    console.error("Failed to fetch:", error);
  } finally {
    setLoading(false);
  }
}, [itemId]);

useEffect(() => {
  if (!itemId) return;
  fetchData();
}, [itemId, fetchData]);


const firstItem = detailItems[0];
const itemName     = firstItem?.item?.name ?? "-";
const categoryName = firstItem?.item?.category?.name ?? "-";
const subCategory  = firstItem?.item?.subcategory?.name ?? "-";
const createdBy = detailItems[0]?.userId?.username ?? detailItems[0]?.created_by ?? "-";

  const filteredDetailItems = detailItems.filter((d) => {
    const keyword = search.toLowerCase();
    return (
      d.serial_number?.toLowerCase().includes(keyword) ||
      d.room?.name?.toLowerCase().includes(keyword) ||
      d.status?.toLowerCase().includes(keyword)
    );
  });

 

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-sm rounded-xl border p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-6">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Detail Master Item
          </h1>

          {loading ? (
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
            </div>
          )}
        </div>

        <div className="mt-12">
          <h1 className="font-quicksand text-2xl font-semibold mb-6">Data Item</h1>

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
                <div className="flex gap-2 flex-wrap">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <QrCode className="mr-2 h-4 w-4" /> Generate Label
                  </Button>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400">
                    <Focus className="mr-2 h-4 w-4" /> Small Label
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-gray-200/50 dark:border-white/5">
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
                        <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                          Memuat data...
                        </td>
                      </TableRow>
                    ) : filteredDetailItems.length === 0 ? (
                      <TableRow>
                        <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                          Tidak ada data item
                        </td>
                      </TableRow>
                    ) : (
                      filteredDetailItems.map((d, index) => (
                        <TableRow key={d.id} className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5">
                          <TableCell className="px-2 py-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                              {index + 1}
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
                            <span className="inline-block rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
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
                                onSuccess={fetchData} 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/50 dark:border-white/5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Item: {filteredDetailItems.length} item
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}