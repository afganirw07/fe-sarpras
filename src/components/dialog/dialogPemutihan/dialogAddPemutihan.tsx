"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogClose, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table/index";
import { Search, Trash2, ArrowRightFromLine, PackageX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getRooms, Room } from "@/lib/warehouse";
import {
  getCategoriesByWarehouse,
  getItemsByWarehouseAndCategory,
  getDetailItemsByRoomFiltered,
} from "@/lib/detail-items";
import { createPurging } from "@/lib/purging";
import { useSession } from "next-auth/react";
import Pagination from "@/components/tables/Pagination";

interface DetailItem {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  item: { id: string; name: string; category?: { id: string; name: string } };
  room: { id: string; name: string };
}

interface CategoryOption { id: string; name: string }
interface ItemOption { id: string; name: string; category_id: string }

export default function DialogAddPemutihan({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session } = useSession();
  const skipNextFetch = useRef(false);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingItemNames, setLoadingItemNames] = useState(false);
  const [loadingSelectAll, setLoadingSelectAll] = useState(false);

  const [warehouseId, setWarehouseId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [notes, setNotes] = useState("");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);

  const [leftItems, setLeftItems] = useState<DetailItem[]>([]);
  const [leftPage, setLeftPage] = useState(1);
  const [leftTotalPages, setLeftTotalPages] = useState(1);
  const [leftTotal, setLeftTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAllPagesMode, setSelectAllPagesMode] = useState(false);

  const [stagedItems, setStagedItems] = useState<DetailItem[]>([]);
  const [rightPage, setRightPage] = useState(1);
  const [searchRight, setSearchRight] = useState("");
  const RIGHT_PAGE_SIZE = 10;

  useEffect(() => {
    if (!open) return;
    getRooms()
      .then((res) => setRooms(res.data ?? []))
      .catch(() => toast.error("Gagal memuat data gudang."));
  }, [open]);

  useEffect(() => {
    if (!warehouseId) {
      setCategories([]); setCategoryId(""); setItemOptions([]); setSelectedItemId(""); return;
    }
    setLoadingCategories(true);
    getCategoriesByWarehouse(warehouseId)
      .then((res) => setCategories(res.data ?? []))
      .catch(() => toast.error("Gagal memuat kategori."))
      .finally(() => setLoadingCategories(false));
  }, [warehouseId]);

  useEffect(() => {
    if (!warehouseId || !categoryId) { setItemOptions([]); setSelectedItemId(""); return; }
    setLoadingItemNames(true);
    getItemsByWarehouseAndCategory(warehouseId, categoryId)
      .then((res) => setItemOptions(res.data ?? []))
      .catch(() => toast.error("Gagal memuat nama item."))
      .finally(() => setLoadingItemNames(false));
  }, [warehouseId, categoryId]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setLeftPage(1);
      setSelectAllPagesMode(false);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchLeftItems = useCallback(async (currentStagedItems: DetailItem[] = []) => {
    if (!warehouseId) return;
    setLoadingItems(true);
    try {
      const res = await getDetailItemsByRoomFiltered(warehouseId, leftPage, 10, {
        search: search || undefined,
        categoryId: categoryId || undefined,
        itemId: selectedItemId || undefined,
      });

      const stagedIds = new Set(currentStagedItems.map((s) => s.id));
      const filtered = (res.data ?? []).filter(
        (d: DetailItem) => !stagedIds.has(d.id) && d.status === "available"
      );

      setLeftItems(filtered);
      setLeftTotal(res.pagination?.total ?? 0);
      setLeftTotalPages(res.pagination?.totalPages ?? 1);
      setSelectedIds([]);
      setSelectAllPagesMode(false);
    } catch {
      toast.error("Gagal memuat item.");
    } finally {
      setLoadingItems(false);
    }
  }, [warehouseId, leftPage, search, categoryId, selectedItemId]);

  useEffect(() => {
    if (skipNextFetch.current) { skipNextFetch.current = false; return; }
    if (warehouseId) fetchLeftItems(stagedItems);
    else { setLeftItems([]); setLeftTotal(0); setLeftTotalPages(1); }
  }, [warehouseId, leftPage, search, categoryId, selectedItemId]);

  // ── Right table ──
  const filteredRight = stagedItems.filter(
    (item) =>
      item.item.name.toLowerCase().includes(searchRight.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchRight.toLowerCase())
  );
  const rightTotalPages = Math.max(1, Math.ceil(filteredRight.length / RIGHT_PAGE_SIZE));
  const paginatedRight = filteredRight.slice(
    (rightPage - 1) * RIGHT_PAGE_SIZE,
    rightPage * RIGHT_PAGE_SIZE
  );
  useEffect(() => { setRightPage(1); }, [searchRight]);

  // ── Checkbox logic ──
  const isCurrentPageAllSelected =
    leftItems.length > 0 && leftItems.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    if (selectAllPagesMode) {
      setSelectAllPagesMode(false);
      setSelectedIds(leftItems.map((i) => i.id));
      return;
    }
    if (isCurrentPageAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leftItems.map((i) => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectAllPagesMode(false);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ── Fetch semua halaman lalu tandai selectAllPagesMode ──
  const handleSelectAllPages = async () => {
    setLoadingSelectAll(true);
    try {
      const stagedIds = new Set(stagedItems.map((s) => s.id));
      let allItems: DetailItem[] = [];
      let page = 1;

      while (true) {
        const res = await getDetailItemsByRoomFiltered(warehouseId, page, 100, {
          search: search || undefined,
          categoryId: categoryId || undefined,
          itemId: selectedItemId || undefined,
        });

        const batch = (res.data ?? []).filter(
          (d: DetailItem) => !stagedIds.has(d.id) && d.status === "available"
        );
        allItems = [...allItems, ...batch];

        const totalPages = res.pagination?.totalPages ?? 1;
        if (page >= totalPages) break;
        page++;
      }

      // Simpan semua item ke leftItems (gabung dengan yang sudah ada)
      setLeftItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newOnes = allItems.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newOnes];
      });
      setSelectedIds(allItems.map((i) => i.id));
      setSelectAllPagesMode(true);
      toast.success(`${allItems.length} item dari semua halaman dipilih.`);
    } catch {
      toast.error("Gagal memuat semua item.");
    } finally {
      setLoadingSelectAll(false);
    }
  };

  // ── Move to staged ──
  const handlePindahkan = () => {
    if (!selectedIds.length && !selectAllPagesMode) {
      toast.warning("Pilih item terlebih dahulu."); return;
    }

    const selectedSet = new Set(selectedIds);
    const toMove = leftItems.filter((i) => selectedSet.has(i.id));
    const newItems = toMove.filter((i) => !stagedItems.find((s) => s.id === i.id));

    if (!newItems.length) { toast.warning("Item sudah ada di daftar pemutihan."); return; }

    skipNextFetch.current = true;
    setStagedItems((prev) => [...prev, ...newItems]);
    setLeftItems((prev) => prev.filter((i) => !selectedSet.has(i.id)));
    setLeftTotal((prev) => Math.max(0, prev - newItems.length));
    setSelectedIds([]);
    setSelectAllPagesMode(false);
  };

  // ── Remove from staged ──
  const handleRemoveStaged = (id: string) => {
    const removedItem = stagedItems.find((i) => i.id === id);
    skipNextFetch.current = true;
    setStagedItems((prev) => prev.filter((i) => i.id !== id));

    if (removedItem) {
      const matchesCategory = !categoryId || removedItem.item?.category?.id === categoryId;
      const matchesItem = !selectedItemId || removedItem.item?.id === selectedItemId;
      if (matchesCategory && matchesItem) {
        setLeftItems((prev) => [...prev, removedItem]);
        setLeftTotal((prev) => prev + 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!warehouseId) { toast.error("Pilih gudang terlebih dahulu."); return; }
    if (!stagedItems.length) { toast.error("Pilih minimal 1 item."); return; }

    setLoading(true);
    try {
      const firstItem = stagedItems[0];
      const categoryName = categories.find((c) => c.id === categoryId)?.name
        ?? firstItem.item?.category?.name ?? "";

      const payload = {
        serial_number: firstItem.serial_number ?? "",
        item_name:     firstItem.item?.name ?? "",
        category:      categoryName,
        condition:     firstItem.condition ?? "poor",
        item_status:   "damaged",
        letter_status: "pending",
        created_by:    session?.user?.id ?? "",
        notes,
        details: stagedItems.map((i) => ({
          detail_item_id: i.id,
          item_name:      i.item?.name ?? "",
          category:       i.item?.category?.name ?? categoryName,
          subcategory:    "",
          serial_number:  i.serial_number ?? "",
          warehouse_id:   warehouseId,
          item_status:    "damaged",
          condition:      i.condition ?? "poor",
          created_by:     session?.user?.id ?? "",
        })),
      };

      await createPurging(payload as any);
      toast.success(`${stagedItems.length} item berhasil disimpan ke pemutihan.`);
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch {
      toast.error("Gagal menyimpan pemutihan.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setWarehouseId(""); setCategoryId(""); setSelectedItemId(""); setNotes("");
    setLeftItems([]); setStagedItems([]); setSelectedIds([]);
    setSearchInput(""); setSearch(""); setSearchRight("");
    setCategories([]); setItemOptions([]);
    setLeftPage(1); setRightPage(1);
    setSelectAllPagesMode(false);
  };

  const selectedCount = selectAllPagesMode ? leftTotal : selectedIds.length;

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        >
          <PackageX size={16} />
          + Tambah Pemutihan
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl p-6 dark:bg-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <PackageX size={20} className="text-blue-500" />
            Tambah Pemutihan
          </DialogTitle>
        </DialogHeader>

        {/* ── Filter ── */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Gudang <span className="text-red-500">*</span></Label>
            <Select value={warehouseId} onValueChange={(val) => {
              setWarehouseId(val); setCategoryId(""); setSelectedItemId("");
              setStagedItems([]); setLeftPage(1); setSearchInput(""); setSelectAllPagesMode(false);
            }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Gudang" /></SelectTrigger>
              <SelectContent>
                {rooms.map((room) => <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>
              Kategori
              {loadingCategories && <span className="ml-1 text-xs font-normal text-gray-400">Memuat...</span>}
            </Label>
            <Select
              value={categoryId}
              onValueChange={(val) => { setCategoryId(val === "all" ? "" : val); setSelectedItemId(""); setLeftPage(1); setSelectAllPagesMode(false); }}
              disabled={!warehouseId || loadingCategories}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={!warehouseId ? "Pilih gudang dulu" : "Semua Kategori"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>
              Nama Item
              {loadingItemNames && <span className="ml-1 text-xs font-normal text-gray-400">Memuat...</span>}
            </Label>
            <Select
              value={selectedItemId}
              onValueChange={(val) => { setSelectedItemId(val === "all" ? "" : val); setLeftPage(1); setSelectAllPagesMode(false); }}
              disabled={!categoryId || loadingItemNames}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={!categoryId ? "Pilih kategori dulu" : "Semua Item"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Item</SelectItem>
                {itemOptions.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Two-panel ── */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Left */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                Item Tersedia
                {loadingItems && <span className="ml-2 text-xs font-normal text-gray-400">Memuat...</span>}
                {!loadingItems && warehouseId && (
                  <span className="ml-2 text-xs font-normal text-gray-400">{leftTotal} item</span>
                )}
              </Label>
              {selectedCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {selectedCount} dipilih
                </span>
              )}
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari nama / serial number..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200/70 dark:border-white/10">
              {/* Banner: tawarkan select semua halaman */}
              {isCurrentPageAllSelected && !selectAllPagesMode && leftTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 border-b border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
                  <span>Semua {leftItems.length} item di halaman ini dipilih.</span>
                  <button
                    type="button"
                    onClick={handleSelectAllPages}
                    disabled={loadingSelectAll}
                    className="font-semibold underline hover:no-underline disabled:opacity-50"
                  >
                    {loadingSelectAll
                      ? <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Memuat...</span>
                      : `Pilih semua ${leftTotal} item`
                    }
                  </button>
                </div>
              )}

              {/* Banner: semua halaman aktif terpilih */}
              {selectAllPagesMode && (
                <div className="flex items-center justify-center gap-2 border-b border-green-100 bg-green-50 px-3 py-2 text-xs text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400">
                  <span>Semua <strong>{leftTotal}</strong> item terpilih dari semua halaman.</span>
                  <button
                    type="button"
                    onClick={() => { setSelectAllPagesMode(false); setSelectedIds([]); }}
                    className="font-semibold underline hover:no-underline"
                  >
                    Batalkan
                  </button>
                </div>
              )}

              <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-gray-200/70 bg-gray-50/80 dark:border-white/10 dark:bg-white/5">
                      <TableCell isHeader className="w-10 px-3 py-3 text-center">
                        <Checkbox
                          checked={isCurrentPageAllSelected || selectAllPagesMode}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableCell>
                      <TableCell isHeader className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">No</TableCell>
                      <TableCell isHeader className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Item</TableCell>
                      <TableCell isHeader className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Serial No</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!warehouseId ? (
                      <TableRow><td colSpan={4} className="py-10 text-center text-sm text-gray-400">Pilih gudang terlebih dahulu</td></TableRow>
                    ) : loadingItems ? (
                      <TableRow>
                        <td colSpan={4} className="py-10 text-center text-sm text-gray-400">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                            Memuat...
                          </div>
                        </td>
                      </TableRow>
                    ) : leftItems.length === 0 ? (
                      <TableRow><td colSpan={4} className="py-10 text-center text-sm text-gray-400">Tidak ada item tersedia</td></TableRow>
                    ) : (
                      leftItems.map((item, idx) => (
                        <TableRow
                          key={item.id}
                          className="cursor-pointer border-b border-gray-100/70 transition-colors hover:bg-blue-50/30 dark:border-white/5 dark:hover:bg-white/5"
                          onClick={() => toggleSelect(item.id)}
                        >
                          <TableCell className="px-3 py-3 text-center">
                            <Checkbox
                              checked={selectAllPagesMode || selectedIds.includes(item.id)}
                              onCheckedChange={() => toggleSelect(item.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="px-3 py-3 text-sm text-gray-500">
                            {(leftPage - 1) * 10 + idx + 1}
                          </TableCell>
                          <TableCell className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {item.item?.name ?? "-"}
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {item.serial_number}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {warehouseId && leftTotalPages > 1 && (
              <div className="mt-1">
                <Pagination
                  currentPage={leftPage}
                  totalPages={leftTotalPages}
                  onPageChange={(p) => { setLeftPage(p); setSelectAllPagesMode(false); }}
                />
              </div>
            )}

            <Button
              type="button"
              onClick={handlePindahkan}
              disabled={!selectedIds.length && !selectAllPagesMode}
              className="mt-1 w-full gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Pindahkan ke Pemutihan
              {selectAllPagesMode && <span className="ml-1">({leftTotal} item)</span>}
              <ArrowRightFromLine size={16} />
            </Button>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Item Dipunahkan</Label>
              {stagedItems.length > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {stagedItems.length} item
                </span>
              )}
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchRight}
                onChange={(e) => setSearchRight(e.target.value)}
                placeholder="Cari item dipilih..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200/70 dark:border-white/10">
              <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-gray-200/70 bg-gray-50/80 dark:border-white/10 dark:bg-white/5">
                      <TableCell isHeader className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">No</TableCell>
                      <TableCell isHeader className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Item</TableCell>
                      <TableCell isHeader className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Serial No</TableCell>
                      <TableCell isHeader className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Hapus</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRight.length === 0 ? (
                      <TableRow><td colSpan={4} className="py-10 text-center text-sm text-gray-400">Belum ada item dipilih</td></TableRow>
                    ) : (
                      paginatedRight.map((item, idx) => (
                        <TableRow key={item.id} className="border-b border-gray-100/70 transition-colors hover:bg-red-50/20 dark:border-white/5 dark:hover:bg-white/5">
                          <TableCell className="px-3 py-3 text-sm text-gray-500">
                            {(rightPage - 1) * RIGHT_PAGE_SIZE + idx + 1}
                          </TableCell>
                          <TableCell className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {item.item?.name ?? "-"}
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              {item.serial_number}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveStaged(item.id)}
                              className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={14} />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {stagedItems.length > RIGHT_PAGE_SIZE && (
              <div className="mt-1">
                <Pagination currentPage={rightPage} totalPages={rightTotalPages} onPageChange={setRightPage} />
              </div>
            )}

            <div className="mt-2 grid gap-2">
              <Label>Catatan <span className="text-xs font-normal text-gray-400">(opsional)</span></Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alasan pemutihan, kondisi barang, dll..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={loading}>Batal</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !stagedItems.length}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyimpan...
              </>
            ) : (
              <>
                <PackageX size={15} />
                Simpan Pemutihan ({stagedItems.length} item)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}