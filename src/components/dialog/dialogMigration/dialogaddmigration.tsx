"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, ArrowRightFromLine, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createMigration } from "@/lib/migration";
import { getRooms, Room } from "@/lib/warehouse";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDetailItemsByRoom } from "@/lib/detail-items";
import Pagination from "@/components/tables/Pagination";

interface DetailItem {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  item: { id: string; name: string };
  room: { id: string; name: string };
}

// ─── Pagination Component ────────────────────────────────────────────────────
function TablePagination({
  page,
  totalPages,
  total,
  limit,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
      <span>{from}–{to} dari {total}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1 rounded border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-2 font-medium">{page} / {totalPages}</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1 rounded border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DialogAddMigration({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  const [fromRoomId, setFromRoomId] = useState("");
  const [toRoomId, setToRoomId] = useState("");
  const [notes, setNotes] = useState("");

  // ── Tabel kiri: data dari backend ──
  const [leftItems, setLeftItems] = useState<DetailItem[]>([]);
  const [leftPage, setLeftPage] = useState(1);
  const [leftTotalPages, setLeftTotalPages] = useState(1);
  const [leftTotal, setLeftTotal] = useState(0);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchLeftInput, setSearchLeftInput] = useState(""); // debounce input

  // ── Tabel kanan: staged items (client-side) ──
  const [stagedItems, setStagedItems] = useState<DetailItem[]>([]);
  const [searchRight, setSearchRight] = useState("");
  const [rightPage, setRightPage] = useState(1);
  const RIGHT_PAGE_SIZE = 10;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Fetch rooms ──
  useEffect(() => {
    getRooms()
      .then((res) => setRooms(res.data ?? []))
      .catch(() => toast.error("Gagal memuat data ruangan."));
  }, []);

  // ── Debounce search kiri ──
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchLeft(searchLeftInput);
      setLeftPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchLeftInput]);

  const fetchLeftItems = useCallback(async () => {
    if (!fromRoomId) return;
    setLoadingItems(true);
    try {
      const res = await getDetailItemsByRoom(fromRoomId, leftPage, 10, searchLeft);
      const stagedIds = new Set(stagedItems.map((s) => s.id));
      const filtered = (res.data ?? []).filter((d: DetailItem) => !stagedIds.has(d.id));
      setLeftItems(filtered);
      setLeftTotal(res.pagination?.total ?? 0);
      setLeftTotalPages(res.pagination?.totalPages ?? 1);
      setSelectedIds([]);
    } catch {
      toast.error("Gagal memuat detail item.");
    } finally {
      setLoadingItems(false);
    }
  }, [fromRoomId, leftPage, searchLeft, stagedItems]);

  useEffect(() => {
    if (fromRoomId) fetchLeftItems();
    else {
      setLeftItems([]);
      setLeftTotal(0);
      setLeftTotalPages(1);
    }
  }, [fromRoomId, leftPage, searchLeft]);

  // ── Staged items pagination (client-side) ──
  const filteredRight = stagedItems.filter(
    (item) =>
      item.item.name.toLowerCase().includes(searchRight.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchRight.toLowerCase())
  );
  const rightTotalPages = Math.ceil(filteredRight.length / RIGHT_PAGE_SIZE);
  const paginatedRight = filteredRight.slice(
    (rightPage - 1) * RIGHT_PAGE_SIZE,
    rightPage * RIGHT_PAGE_SIZE
  );

  useEffect(() => { setRightPage(1); }, [searchRight]);

  // ── Select all (hanya di page ini) ──
  const isAllSelected = leftItems.length > 0 && leftItems.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : leftItems.map((i) => i.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePindahkan = () => {
    if (selectedIds.length === 0) {
      toast.warning("Pilih item terlebih dahulu.");
      return;
    }
    const toMove = leftItems.filter((item) => selectedIds.includes(item.id));
    const newItems = toMove.filter((item) => !stagedItems.find((s) => s.id === item.id));
    setStagedItems((prev) => [...prev, ...newItems]);
    setSelectedIds([]);
    setLeftItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
};

 const handleRemoveStaged = (id: string) => {
    const removedItem = stagedItems.find((i) => i.id === id);
    setStagedItems((prev) => prev.filter((i) => i.id !== id));
    if (removedItem) {
      setLeftItems((prev) => [...prev, removedItem]);
    }
};

  const handleSubmit = async () => {
    if (!fromRoomId || !toRoomId) {
      toast.error("WH Awal dan WH Tujuan harus dipilih.");
      return;
    }
    if (fromRoomId === toRoomId) {
      toast.error("WH Awal dan WH Tujuan tidak boleh sama.");
      return;
    }
    if (stagedItems.length === 0) {
      toast.error("Tidak ada item yang dipindahkan.");
      return;
    }
    setLoading(true);
    try {
      await createMigration({
        from_room_id: fromRoomId,
        to_room_id: toRoomId,
        migrated_by: session?.user?.id ?? "",
        detail_item_ids: stagedItems.map((i) => i.id),
        notes,
      });
      toast.success("Mutasi berhasil disimpan.");
      setOpen(false);
      resetForm();
      onSuccess?.();
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan mutasi.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFromRoomId("");
    setToRoomId("");
    setNotes("");
    setLeftItems([]);
    setStagedItems([]);
    setSelectedIds([]);
    setSearchLeftInput("");
    setSearchLeft("");
    setSearchRight("");
    setLeftPage(1);
    setRightPage(1);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-quicksand text-md bg-blue-800 text-white transition duration-300 hover:bg-blue-900">
          + Add Mutasi
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl p-6 dark:bg-black">
        <DialogHeader>
          <DialogTitle>Tambah Mutasi</DialogTitle>
        </DialogHeader>

        {/* WH Select */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div className="grid w-full gap-2">
            <Label>WH Awal</Label>
            <Select value={fromRoomId} onValueChange={(val) => { setFromRoomId(val); setStagedItems([]); setLeftPage(1); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Pilih WH Awal" /></SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id} disabled={room.id === toRoomId}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>WH Tujuan</Label>
            <Select value={toRoomId} onValueChange={setToRoomId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Pilih WH Tujuan" /></SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id} disabled={room.id === fromRoomId}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* ── Tabel Kiri ── */}
          <div>
            <Label>
              WH Awal
              {loadingItems && <span className="ml-2 text-xs text-gray-400">Loading...</span>}
              {!loadingItems && fromRoomId && (
                <span className="ml-2 text-xs text-gray-400">{leftTotal} item tersedia</span>
              )}
            </Label>

            <div className="mb-4 mt-2 relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchLeftInput}
                onChange={(e) => setSearchLeftInput(e.target.value)}
                placeholder="Search item / SN"
                className="w-full rounded-md border border-gray-400 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-transparent"
              />
            </div>

       <div className="rounded-md border overflow-y-auto max-h-64">
              <Table className="w-full table-auto">
                <TableHeader className="border border-gray-100 dark:border-white/5">
                  <TableRow>
                    <TableCell isHeader className="flex justify-center border px-3 py-3 font-medium text-gray-800">
                      <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                    </TableCell>
                    <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">No</TableCell>
                    <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">Nama</TableCell>
                    <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">SN Number</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leftItems.length === 0 ? (
                    <TableRow>
                      <td colSpan={4} className="border px-6 py-6 text-center text-sm text-gray-500">
                        {!fromRoomId ? "Pilih WH Awal terlebih dahulu" : loadingItems ? "Memuat data..." : "Tidak ada item tersedia"}
                      </td>
                    </TableRow>
                  ) : (
                    leftItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="border px-3 py-4">
                          <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleSelect(item.id)} />
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm text-gray-500">
                          {(leftPage - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm text-gray-500">{item.item.name}</TableCell>
                        <TableCell className="border px-4 py-4 text-xs text-gray-500">{item.serial_number}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
{fromRoomId && (
  <div className="mt-2">
  <Pagination
    currentPage={leftPage}
    totalPages={leftTotalPages}
    onPageChange={setLeftPage}
    />
    </div>
)}       <Button
              type="button"
              onClick={handlePindahkan}
              disabled={selectedIds.length === 0}
              className="mt-3 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 dark:text-white"
            >
              Pindahkan <ArrowRightFromLine className="ml-2" />
            </Button>
          </div>

          {/* ── Tabel Kanan ── */}
          <div>
            <Label>
              WH Tujuan
              {stagedItems.length > 0 && (
                <span className="ml-2 text-xs text-blue-600">{stagedItems.length} item dipilih</span>
              )}
            </Label>

            <div className="mb-4 mt-2 relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchRight}
                onChange={(e) => setSearchRight(e.target.value)}
                placeholder="Search item / SN"
                className="w-full rounded-md border border-gray-400 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-transparent"
              />
            </div>

<div className="rounded-md border overflow-y-auto max-h-64">

            <Table className="w-full table-auto">
              <TableHeader className="border border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">No</TableCell>
                  <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">Nama</TableCell>
                  <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">SN Number</TableCell>
                  <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">WH Asal</TableCell>
                  <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRight.length === 0 ? (
                  <TableRow>
                    <td colSpan={5} className="border px-6 py-6 text-center text-sm text-gray-500">
                      Belum ada item dipindahkan
                    </td>
                  </TableRow>
                ) : (
                  paginatedRight.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="border px-4 py-4 text-sm text-gray-500">
                        {(rightPage - 1) * RIGHT_PAGE_SIZE + index + 1}
                      </TableCell>
                      <TableCell className="border px-4 py-4 text-sm text-gray-500">{item.item.name}</TableCell>
                      <TableCell className="border px-4 py-4 text-xs text-gray-500">{item.serial_number}</TableCell>
                      <TableCell className="border px-4 py-4 text-sm text-gray-500">{item.room.name}</TableCell>
                      <TableCell className="border px-4 py-4">
                        <Button size="sm" variant="destructive" type="button" onClick={() => handleRemoveStaged(item.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
              </div>
           
{stagedItems.length > 0 && (
  <div className="mt-2">
  <Pagination
    currentPage={rightPage}
    totalPages={rightTotalPages}
    onPageChange={setRightPage}
    />
    </div>
)}

            <div className="mt-4 grid gap-2">
              <Label>Remarks</Label>
              <Input
                placeholder="Catatan mutasi..."
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={loading} className="bg-blue-800 hover:bg-blue-900 dark:text-white">
            {loading ? "Menyimpan..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}