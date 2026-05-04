"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
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
import Input from "@/components/form/input/InputField";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getItems, Item } from "@/lib/items";
import { getEmployees, Employee } from "@/lib/roles";
import { getRooms, Room } from "@/lib/warehouse";
import { createConsumableRequest, ConsumableRequestStatus } from "@/lib/consumable-request";
import { Search, Trash2, Plus } from "lucide-react";

const STATUS_OPTIONS: ConsumableRequestStatus[] = ["Baik", "Sedang", "Buruk"];

interface ItemRow {
  item_id: string;
  name:    string;
  stock:   number;
  qty:     number;
  status:  ConsumableRequestStatus;
}

interface Props {
  onSuccess?: () => void;
}

function SearchableSelect({
  label, error, value, displayLabel, placeholder,
  searchValue, onSearchChange, onValueChange, disabled, children,
}: {
  label: string; error?: string; value: string; displayLabel: string;
  placeholder: string; searchValue: string;
  onSearchChange: (v: string) => void; onValueChange: (v: string) => void;
  disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <Select
        value={value}
        onValueChange={(val) => { onValueChange(val); onSearchChange(""); }}
        disabled={disabled}
      >
        <SelectTrigger className={`h-10 ${error ? "border-red-500" : ""}`}>
          <SelectValue placeholder={placeholder}>{displayLabel || placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
          <div className="sticky top-0 z-10 bg-white dark:bg-black px-2 pb-2 pt-1">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Cari..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">{children}</div>
        </SelectContent>
      </Select>
    </div>
  );
}

export default function DialogAddConsumableRequest({ onSuccess }: Props) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const [isOpen,    setIsOpen]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [items,     setItems]     = useState<Item[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rooms,     setRooms]     = useState<Room[]>([]);

  // ── Selector state ────────────────────────────────────────────────────────
  const [selectedItemId,      setSelectedItemId]      = useState("");
  const [selectedRoomId,      setSelectedRoomId]      = useState("");
  const [selectedRoomSearch,  setSelectedRoomSearch]  = useState("");
  const [itemSearch,          setItemSearch]          = useState("");
  const [requesterSearch,     setRequesterSearch]     = useState("");
  const [requestBy,           setRequestBy]           = useState("");

  // ── Rows (multiple items) ─────────────────────────────────────────────────
  const [rows,   setRows]   = useState<ItemRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fix error 1: cast eksplisit pada hasil getItems
  const fetchData = useCallback(async () => {
    try {
      const [itemsRes, empRes, roomsRes] = await Promise.all([
        getItems(1, 999),
        getEmployees(),
        getRooms(),
      ]);
      const itemsData = (itemsRes as any).data ?? itemsRes ?? [];
      setItems((itemsData as Item[]).filter((i: Item) => i.type === "HabisPakai"));
      setEmployees(Array.isArray(empRes) ? empRes : ((empRes as any).data ?? []));
      setRooms(Array.isArray(roomsRes) ? roomsRes : ((roomsRes as any).data ?? []));
    } catch {
      toast.error("Gagal memuat data master");
    }
  }, []);

  useEffect(() => { if (isOpen) fetchData(); }, [isOpen, fetchData]);

  const filteredItems = useMemo(() => {
    const addedIds = new Set(rows.map((r) => r.item_id));
    return items.filter(
      (i) =>
        !addedIds.has(i.id) &&
        (i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
          i.code.toLowerCase().includes(itemSearch.toLowerCase()))
    );
  }, [items, itemSearch, rows]);

  const filteredRooms = useMemo(() =>
    rooms.filter((r) => r.name.toLowerCase().includes(selectedRoomSearch.toLowerCase())),
    [rooms, selectedRoomSearch]
  );

  const filteredRequesters = useMemo(() =>
    employees.filter((e) => e.full_name.toLowerCase().includes(requesterSearch.toLowerCase())),
    [employees, requesterSearch]
  );

  const selectedItemLabel      = items.find((i) => i.id === selectedItemId)?.name ?? "";
  const selectedRoomLabel      = rooms.find((r) => r.id === selectedRoomId)?.name ?? "";
  const selectedRequesterLabel = employees.find((e) => e.id === requestBy)?.full_name ?? "";

  // ── Add item to rows ──────────────────────────────────────────────────────
  const handleAddItem = () => {
    if (!selectedItemId) return toast.error("Pilih item dulu");
    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    setRows((prev) => [...prev, {
      item_id: item.id,
      name:    item.name,
      stock:   item.stock,
      qty:     1,
      status:  "Baik",
    }]);
    setSelectedItemId("");
    setItemSearch("");
    setErrors((prev) => ({ ...prev, rows: "" }));
  };

  const handleRemoveRow = (itemId: string) => {
    setRows((prev) => prev.filter((r) => r.item_id !== itemId));
  };

  // Fix error 2: cast value ke ConsumableRequestStatus
  const handleRowChange = (itemId: string, field: "qty" | "status", value: number | string) => {
    setRows((prev) => prev.map((r) => {
      if (r.item_id !== itemId) return r;
      if (field === "qty") {
        const qty = Math.min(Math.max(1, Number(value)), r.stock);
        return { ...r, qty };
      }
      return { ...r, status: value as ConsumableRequestStatus };
    }));
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setRows([]);
    setSelectedItemId("");
    setSelectedRoomId("");
    setRequestBy("");
    setItemSearch("");
    setRequesterSearch("");
    setSelectedRoomSearch("");
    setErrors({});
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (open) { resetForm(); fetchData(); }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!selectedRoomId)   newErrors.room    = "Warehouse wajib dipilih";
    if (!requestBy)        newErrors.request = "Pemohon wajib dipilih";
    if (rows.length === 0) newErrors.rows    = "Tambahkan minimal satu item";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Harap lengkapi semua field");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        rows.map((row) =>
          createConsumableRequest({
            item_id:     row.item_id,
            quantity:    row.qty,
            status:      row.status,
            approved_by: userId,   
            request_by:  requestBy,
            room_id:     selectedRoomId,
            created_by:  userId,
          })
        )
      );
      toast.success(`${rows.length} consumable request berhasil dibuat`);
      resetForm();
      setIsOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal membuat request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-quicksand text-md transition duration-300"
        >
          + Permintaan
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-6 dark:bg-black">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Permintaan barang</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-5">

            {/* ── Row 1: Pilih Item + Pilih Warehouse ── */}
            <div className="grid grid-cols-2 gap-4">
              <SearchableSelect
                label="Pilih Item (Habis pakai)"
                error={errors.item}
                value={selectedItemId}
                displayLabel={selectedItemLabel}
                placeholder="Pilih item"
                searchValue={itemSearch}
                onSearchChange={setItemSearch}
                onValueChange={setSelectedItemId}
                disabled={loading}
              >
                {filteredItems.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400 text-center">
                    Item tidak ditemukan
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <span className="font-mono text-xs text-gray-400 mr-2">{item.code}</span>
                      {item.name}
                      <span className="ml-2 text-xs text-gray-400">(stok: {item.stock})</span>
                    </SelectItem>
                  ))
                )}
              </SearchableSelect>

              <SearchableSelect
                label="Warehouse *"
                error={errors.room}
                value={selectedRoomId}
                displayLabel={selectedRoomLabel}
                placeholder="Pilih warehouse"
                searchValue={selectedRoomSearch}
                onSearchChange={setSelectedRoomSearch}
                onValueChange={(val) => { setSelectedRoomId(val); setErrors((p) => ({ ...p, room: "" })); }}
                disabled={loading}
              >
                {filteredRooms.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400 text-center">
                    Warehouse tidak ditemukan
                  </div>
                ) : (
                  filteredRooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))
                )}
              </SearchableSelect>
            </div>

            {/* ── Tabel Items ── */}
            <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                    {["No", "Nama Item", "Stock", "Qty", "Kondisi", ""].map((col) => (
                      <th
                        key={col}
                        className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                        {errors.rows
                          ? <span className="text-red-400">{errors.rows}</span>
                          : "Belum ada item ditambahkan"
                        }
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => (
                      <tr
                        key={row.item_id}
                        className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-gray-500">{row.stock}</td>
                        <td className="px-4 py-3 w-24">
                          {/* Fix error 4 & 5: min max jadi string */}
                          <Input
                            type="number"
                            min="1"
                            max={String(row.stock)}
                            defaultValue={row.qty}
                            onChange={(e) => handleRowChange(row.item_id, "qty", Number(e.target.value))}
                            disabled={loading}
                          />
                        </td>
                        <td className="px-4 py-3 w-32">
                          <Select
                            value={row.status}
                            onValueChange={(val) => handleRowChange(row.item_id, "status", val)}
                            disabled={loading}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleRemoveRow(row.item_id)}
                            disabled={loading}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Request By + Add Item ── */}
            <div className="flex justify-between items-end">
              <div className="w-72">
                <SearchableSelect
                  label="Request By *"
                  error={errors.request}
                  value={requestBy}
                  displayLabel={selectedRequesterLabel}
                  placeholder="Pilih pemohon"
                  searchValue={requesterSearch}
                  onSearchChange={setRequesterSearch}
                  onValueChange={(val) => { setRequestBy(val); setErrors((p) => ({ ...p, request: "" })); }}
                  disabled={loading}
                >
                  {filteredRequesters.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400 text-center">
                      Employee tidak ditemukan
                    </div>
                  ) : (
                    filteredRequesters.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>
                    ))
                  )}
                </SearchableSelect>
              </div>

              <Button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedItemId || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Plus size={16} /> Add Item
              </Button>
            </div>

          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : `Save${rows.length > 0 ? ` (${rows.length} item)` : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}