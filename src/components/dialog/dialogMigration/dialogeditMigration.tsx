"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, ArrowRightFromLine, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  getMigrationById,
  updateMigration,
  type ItemMigration,
  type DetailItem,
} from "@/lib/migration";
import { getRooms, type Room } from "@/lib/warehouse";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDetailItemsByRoom } from "@/lib/detail-items";
import Pagination from "@/components/tables/Pagination";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEFT_PAGE_SIZE = 10;
const RIGHT_PAGE_SIZE = 10;

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DialogEditMigration({
  migrationId,
  onSuccess,
}: {
  migrationId: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // ── Form fields ──
  const [fromRoomId, setFromRoomId] = useState("");
  const [toRoomId, setToRoomId] = useState("");
  const [notes, setNotes] = useState("");
  const [letterStatus, setLetterStatus] = useState("");

  // ── Left table: server-side paginated ──
  const [leftItems, setLeftItems] = useState<DetailItem[]>([]);
  const [leftPage, setLeftPage] = useState(1);
  const [leftTotalPages, setLeftTotalPages] = useState(1);
  const [leftTotal, setLeftTotal] = useState(0);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchLeftInput, setSearchLeftInput] = useState("");

  // ── Right table: client-side staged list ──
  const [stagedItems, setStagedItems] = useState<DetailItem[]>([]);
  const [stagedIds, setStagedIds] = useState<Set<string>>(new Set());
  const [searchRight, setSearchRight] = useState("");
  const [rightPage, setRightPage] = useState(1);

  // ── Checkbox selection (left table, current page only) ──
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Fetch rooms once on mount ──
  useEffect(() => {
    getRooms()
      .then((res) => setRooms(res.data ?? []))
      .catch(() => toast.error("Gagal memuat data ruangan."));
  }, []);

  // ── Load existing migration data when dialog opens ──
  useEffect(() => {
    if (!open) return;

    const loadMigration = async () => {
      setLoadingInitial(true);
      try {
        const res = await getMigrationById(migrationId);
        const migration = res.data;

        setFromRoomId(migration.from_room_id);
        setToRoomId(migration.to_room_id);
        setNotes(migration.notes ?? "");
        setLetterStatus(migration.letter_status);

        // Restore staged items dari detail_items yang sudah ada
        const existingItems = (migration.detail_items ?? []) as DetailItem[];
        setStagedItems(existingItems);
        setStagedIds(new Set(existingItems.map((i) => i.id)));
      } catch {
        toast.error("Gagal memuat data mutasi.");
      } finally {
        setLoadingInitial(false);
      }
    };

    loadMigration();
  }, [open, migrationId]);

  // ── Debounce left search ──
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchLeft(searchLeftInput);
      setLeftPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchLeftInput]);

  // ── Fetch left items, exclude already-staged IDs ──
  const fetchLeftItems = useCallback(async () => {
    if (!fromRoomId) return;
    setLoadingItems(true);
    try {
      const res = await getDetailItemsByRoom(
        fromRoomId,
        leftPage,
        LEFT_PAGE_SIZE,
        searchLeft
      );
      const filtered = (res.data ?? []).filter((d) => !stagedIds.has(d.id));
      setLeftItems(filtered as any);
      setLeftTotal(res.pagination?.total ?? 0);
      setLeftTotalPages(res.pagination?.totalPages ?? 1);
      setSelectedIds([]);
    } catch {
      toast.error("Gagal memuat detail item.");
    } finally {
      setLoadingItems(false);
    }
  }, [fromRoomId, leftPage, searchLeft, stagedIds]);

  useEffect(() => {
    if (fromRoomId) {
      fetchLeftItems();
    } else {
      setLeftItems([]);
      setLeftTotal(0);
      setLeftTotalPages(1);
    }
  }, [fromRoomId, leftPage, searchLeft, fetchLeftItems]);

  // ── Right table: filter + paginate client-side ──
  const filteredRight = stagedItems.filter(
    (item) =>
      item.item.name.toLowerCase().includes(searchRight.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchRight.toLowerCase())
  );
  const rightTotalPages = Math.max(
    1,
    Math.ceil(filteredRight.length / RIGHT_PAGE_SIZE)
  );
  const paginatedRight = filteredRight.slice(
    (rightPage - 1) * RIGHT_PAGE_SIZE,
    rightPage * RIGHT_PAGE_SIZE
  );

  useEffect(() => {
    setRightPage(1);
  }, [searchRight]);

  // ── Room name lookup ──
  const getRoomName = (roomId: string) =>
    rooms.find((r) => r.id === roomId)?.name ?? "—";

  // ── Select all on current left page ──
  const isAllSelected =
    leftItems.length > 0 &&
    leftItems.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : leftItems.map((i) => i.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ── Move selected items to staged ──
  const handlePindahkan = () => {
    if (selectedIds.length === 0) {
      toast.warning("Pilih item terlebih dahulu.");
      return;
    }
    const toMove = leftItems.filter(
      (item) => selectedIds.includes(item.id) && !stagedIds.has(item.id)
    );
    if (toMove.length === 0) return;

    setStagedItems((prev) => [...prev, ...toMove]);
    setStagedIds((prev) => {
      const next = new Set(prev);
      toMove.forEach((i) => next.add(i.id));
      return next;
    });
    setLeftItems((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id))
    );
    setSelectedIds([]);
  };

  // ── Remove item from staged ──
  const handleRemoveStaged = (id: string) => {
    setStagedItems((prev) => prev.filter((i) => i.id !== id));
    setStagedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // ── Submit (PUT) ──
  const handleSubmit = async () => {
    if (!fromRoomId || !toRoomId) {
      toast.error("WH Awal dan WH Tujuan harus dipilih.");
      return;
    }
    if (fromRoomId === toRoomId) {
      toast.error("WH Awal dan WH Tujuan tidak boleh sama.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Sesi tidak valid. Silakan login ulang.");
      return;
    }

    setLoading(true);
    try {
      await updateMigration(migrationId, {
        from_room_id: fromRoomId,
        to_room_id: toRoomId,
        migrated_by: session.user.id,
        letter_status: letterStatus,
        notes,
         detail_item_ids: stagedItems.map((i) => i.id),
      });
      toast.success("Mutasi berhasil diperbarui.");
      setOpen(false);
      resetForm();
      onSuccess?.();
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui mutasi.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset all state ──
  const resetForm = () => {
    setFromRoomId("");
    setToRoomId("");
    setNotes("");
    setLetterStatus("");
    setLeftItems([]);
    setStagedItems([]);
    setStagedIds(new Set());
    setSelectedIds([]);
    setSearchLeftInput("");
    setSearchLeft("");
    setSearchRight("");
    setLeftPage(1);
    setRightPage(1);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit Mutasi"
        >
          <Pencil size={14} />
        </button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl p-6 dark:bg-black">
        <DialogHeader>
          <DialogTitle>Edit Mutasi</DialogTitle>
        </DialogHeader>

        {/* ── Loading state awal ── */}
        {loadingInitial ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            Memuat data mutasi...
          </div>
        ) : (
          <>
            {/* ── WH Select ── */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div className="grid w-full gap-2">
                <Label>WH Awal</Label>
                <Select
                  value={fromRoomId}
                  onValueChange={(val) => {
                    setFromRoomId(val);
                    setStagedItems([]);
                    setStagedIds(new Set());
                    setLeftPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih WH Awal" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem
                        key={room.id}
                        value={room.id}
                        disabled={room.id === toRoomId}
                      >
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>WH Tujuan</Label>
                <Select value={toRoomId} onValueChange={setToRoomId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih WH Tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem
                        key={room.id}
                        value={room.id}
                        disabled={room.id === fromRoomId}
                      >
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* ── Tabel Kiri: Available Items ── */}
              <div>
                <Label>
                  Item Tersedia
                  {loadingItems && (
                    <span className="ml-2 text-xs text-gray-400">
                      Loading...
                    </span>
                  )}
                  {!loadingItems && fromRoomId && (
                    <span className="ml-2 text-xs text-gray-400">
                      {leftTotal} item
                    </span>
                  )}
                </Label>

                <div className="mb-4 mt-2 relative w-full">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={searchLeftInput}
                    onChange={(e) => setSearchLeftInput(e.target.value)}
                    placeholder="Search nama / SN"
                    className="w-full rounded-md border border-gray-400 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-transparent"
                  />
                </div>

                <div className="rounded-md border overflow-y-auto max-h-64">
                  <Table className="w-full table-auto">
                    <TableHeader className="border border-gray-100 dark:border-white/5">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="flex justify-center border px-3 py-3 font-medium text-gray-800"
                        >
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          No
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          Nama
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          SN Number
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leftItems.length === 0 ? (
                        <TableRow>
                          <td
                            colSpan={4}
                            className="border px-6 py-6 text-center text-sm text-gray-500"
                          >
                            {!fromRoomId
                              ? "Pilih WH Awal terlebih dahulu"
                              : loadingItems
                              ? "Memuat data..."
                              : "Tidak ada item tersedia"}
                          </td>
                        </TableRow>
                      ) : (
                        leftItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="border px-3 py-4">
                              <Checkbox
                                checked={selectedIds.includes(item.id)}
                                onCheckedChange={() => toggleSelect(item.id)}
                              />
                            </TableCell>
                            <TableCell className="border px-4 py-4 text-sm text-gray-500">
                              {(leftPage - 1) * LEFT_PAGE_SIZE + index + 1}
                            </TableCell>
                            <TableCell className="border px-4 py-4 text-sm text-gray-500">
                              {item.item.name}
                            </TableCell>
                            <TableCell className="border px-4 py-4 text-xs text-gray-500">
                              {item.serial_number}
                            </TableCell>
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
                )}

                <Button
                  type="button"
                  onClick={handlePindahkan}
                  disabled={selectedIds.length === 0}
                  className="mt-3 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 dark:text-white"
                >
                  Pindahkan <ArrowRightFromLine className="ml-2" />
                </Button>
              </div>

              {/* ── Tabel Kanan: Staged Items ── */}
              <div>
                <Label>
                  Item Dipindahkan
                  {stagedItems.length > 0 && (
                    <span className="ml-2 text-xs text-blue-600">
                      {stagedItems.length} item
                    </span>
                  )}
                </Label>

                <div className="mb-4 mt-2 relative w-full">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={searchRight}
                    onChange={(e) => setSearchRight(e.target.value)}
                    placeholder="Search nama / SN"
                    className="w-full rounded-md border border-gray-400 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-transparent"
                  />
                </div>

                <div className="rounded-md border overflow-y-auto max-h-64">
                  <Table className="w-full table-auto">
                    <TableHeader className="border border-gray-100 dark:border-white/5">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          No
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          Nama
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          SN Number
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          WH Asal
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border px-5 py-3 text-xs font-medium text-gray-500"
                        >
                          Aksi
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRight.length === 0 ? (
                        <TableRow>
                          <td
                            colSpan={5}
                            className="border px-6 py-6 text-center text-sm text-gray-500"
                          >
                            Belum ada item dipindahkan
                          </td>
                        </TableRow>
                      ) : (
                        paginatedRight.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="border px-4 py-4 text-sm text-gray-500">
                              {(rightPage - 1) * RIGHT_PAGE_SIZE + index + 1}
                            </TableCell>
                            <TableCell className="border px-4 py-4 text-sm text-gray-500">
                              {item.item.name}
                            </TableCell>
                            <TableCell className="border px-4 py-4 text-xs text-gray-500">
                              {item.serial_number}
                            </TableCell>
                            <TableCell className="border px-4 py-4 text-sm text-gray-500">
                              {getRoomName(item.room_id)}
                            </TableCell>
                            <TableCell className="border px-4 py-4">
                              <Button
                                size="sm"
                                variant="destructive"
                                type="button"
                                onClick={() => handleRemoveStaged(item.id)}
                              >
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNotes(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-800 hover:bg-blue-900 dark:text-white"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}