"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowRightFromLine,
  Trash2,
} from "lucide-react";
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
import {Input} from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { createMigration } from "@/lib/migration";
import { getRooms, Room } from "@/lib/warehouse";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDetailItemsByRoom } from "@/lib/detail-items";


// ---- Types ----
interface DetailItem {
  id: string;
  serial_number: string;
  condition: string;
  status: string;
  item: { id: string; name: string };
  room: { id: string; name: string };
}

export default function DialogAddMigration({onSuccess}: {onSuccess?: () => void}) {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [fromRoomId, setFromRoomId] = useState("");
  const [toRoomId, setToRoomId] = useState("");
  const [notes, setNotes] = useState("");

  // Table kiri: available detail items dari from_room
  const [availableItems, setAvailableItems] = useState<DetailItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchLeft, setSearchLeft] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Table kanan: staged items yang siap dimutasi
  const [stagedItems, setStagedItems] = useState<DetailItem[]>([]);
  const [searchRight, setSearchRight] = useState("");

  // ---- Fetch rooms on mount ----
  useEffect(() => {
    getRooms()
      .then((res) => setRooms(res.data ?? []))
      .catch(() => toast.error("Gagal memuat data ruangan."));
  }, []);

  // ---- Fetch detail items ketika fromRoomId berubah ----
  useEffect(() => {
  if (!fromRoomId) {
    setAvailableItems([]);
    setSelectedIds([]);
    setStagedItems([]);
    return;
  }

  const fetchDetailItems = async () => {
    setLoadingItems(true);
    try {
      const res = await getDetailItemsByRoom(fromRoomId);
      const stagedIds = new Set(stagedItems.map((s) => s.id));
      setAvailableItems(
        (res.data ?? []).filter((d: DetailItem) => !stagedIds.has(d.id))
      );
      setSelectedIds([]);
    } catch {
      toast.error("Gagal memuat detail item.");
    } finally {
      setLoadingItems(false);
    }
  };

  fetchDetailItems();
}, [fromRoomId]);

  // ---- Filter helpers ----
  const filteredLeft = availableItems.filter(
    (item) =>
      item.item.name.toLowerCase().includes(searchLeft.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchLeft.toLowerCase())
  );

  const filteredRight = stagedItems.filter(
    (item) =>
      item.item.name.toLowerCase().includes(searchRight.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchRight.toLowerCase())
  );

  // ---- Checkbox select all (table kiri) ----
  const isAllSelected =
    filteredLeft.length > 0 && selectedIds.length === filteredLeft.length;

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : filteredLeft.map((i) => i.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ---- Pindahkan: pindah item dari kiri ke kanan ----
  const handlePindahkan = () => {
    if (selectedIds.length === 0) {
      toast.warning("Pilih item terlebih dahulu.");
      return;
    }

    const toMove = availableItems.filter((item) => selectedIds.includes(item.id));
    const newItems = toMove.filter(
      (item) => !stagedItems.find((s) => s.id === item.id)
    );

    setStagedItems((prev) => [...prev, ...newItems]);
    setAvailableItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  // ---- Hapus dari table kanan (kembalikan ke kiri) ----
  const handleRemoveStaged = (id: string) => {
    const item = stagedItems.find((i) => i.id === id);
    if (!item) return;
    setStagedItems((prev) => prev.filter((i) => i.id !== id));
    // Kembalikan ke available hanya jika room masih sama
    if (item.room.id === fromRoomId) {
      setAvailableItems((prev) => [...prev, item]);
    }
  };

  // ---- Submit ----
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
    setAvailableItems([]);
    setStagedItems([]);
    setSelectedIds([]);
    setSearchLeft("");
    setSearchRight("");
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Toaster richColors />
      <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
        Data Mutasi
      </h1>

      <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="font-quicksand text-md bg-blue-800 text-white transition duration-300 hover:bg-blue-900"
            >
              + Add Mutasi
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-5xl p-6">
            <DialogHeader>
              <DialogTitle>Tambah Mutasi</DialogTitle>
            </DialogHeader>

            {/* ---- Pilih Room ---- */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div className="grid w-full gap-2">
                <Label>WH Awal</Label>
                <Select
                  value={fromRoomId}
                  onValueChange={(val) => {
                    setFromRoomId(val);
                    setStagedItems([]);
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
                <Select
                  value={toRoomId}
                  onValueChange={setToRoomId}
                >
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

            {/* ---- Dual Table ---- */}
            <div className="grid grid-cols-2 gap-6">
              {/* Table Kiri: Available Items */}
              <div>
                <Label>
                  WH Awal
                  {loadingItems && (
                    <span className="ml-2 text-xs text-gray-400">Loading...</span>
                  )}
                  {!loadingItems && fromRoomId && (
                    <span className="ml-2 text-xs text-gray-400">
                      {availableItems.length} item tersedia
                    </span>
                  )}
                </Label>

                <div className="mb-4 mt-2 flex w-full items-end justify-end">
                  <div className="relative w-full">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={searchLeft}
                      onChange={(e) => setSearchLeft(e.target.value)}
                      placeholder="Search item / SN"
                      className="w-full rounded-md border border-gray-400 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-transparent"
                    />
                  </div>
                </div>
<div className="max-h-64 overflow-y-auto rounded-md border">
                <Table className="w-full table-auto ">
                  <TableHeader className="border border-gray-100 dark:border-white/[0.05]">
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
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        No
                      </TableCell>
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        Nama
                      </TableCell>
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        SN Number
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredLeft.length === 0 ? (
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
                      filteredLeft.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="border px-3 py-4">
                            <Checkbox
                              checked={selectedIds.includes(item.id)}
                              onCheckedChange={() => toggleSelect(item.id)}
                            />
                          </TableCell>
                          <TableCell className="border px-4 py-4 text-sm text-gray-500">
                            {index + 1}
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
                <Button
                  type="button"
                  onClick={handlePindahkan}
                  disabled={selectedIds.length === 0}
                  className="mt-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50"
                >
                  Pindahkan
                  <ArrowRightFromLine className="ml-2" />
                </Button>
              </div>

              {/* Table Kanan: Staged Items */}
              <div>
                <Label>
                  WH Tujuan
                  {stagedItems.length > 0 && (
                    <span className="ml-2 text-xs text-blue-600">
                      {stagedItems.length} item dipilih
                    </span>
                  )}
                </Label>

                <div className="mb-4 mt-2 flex w-full items-end justify-end">
                  <div className="relative w-full">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={searchRight}
                      onChange={(e) => setSearchRight(e.target.value)}
                      placeholder="Search item / SN"
                      className="w-full rounded-md border border-gray-400 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-transparent"
                    />
                  </div>
                </div>

                <Table className="w-full table-auto">
                  <TableHeader className="border border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        No
                      </TableCell>
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        Nama
                      </TableCell>
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        SN Number
                      </TableCell>
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        WH Asal
                      </TableCell>
                      <TableCell isHeader className="border px-5 py-3 text-xs font-medium text-gray-500">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRight.length === 0 ? (
                      <TableRow>
                        <td
                          colSpan={5}
                          className="border px-6 py-6 text-center text-sm text-gray-500"
                        >
                          Belum ada item dipindahkan
                        </td>
                      </TableRow>
                    ) : (
                      filteredRight.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="border px-4 py-4 text-sm text-gray-500">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border px-4 py-4 text-sm text-gray-500">
                            {item.item.name}
                          </TableCell>
                          <TableCell className="border px-4 py-4 text-xs text-gray-500">
                            {item.serial_number}
                          </TableCell>
                          <TableCell className="border px-4 py-4 text-sm text-gray-500">
                            {item.room.name}
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

                {/* Notes / Remarks */}
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

            {/* Footer */}
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
                className="bg-blue-800 hover:bg-blue-900"
              >
                {loading ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}