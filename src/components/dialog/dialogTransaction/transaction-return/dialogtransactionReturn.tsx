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
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  getBorrowedDetailItems,
  returnDetailItems,
  BorrowedDetailItem,
} from "@/lib/transaction-return";
import { getEmployees, Employee } from "@/lib/roles"; // sesuaikan path


interface ReturnEntry {
  item: BorrowedDetailItem;
  kondisi: string;
}


export default function DialogTransactionReturn({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [borrowedItems, setBorrowedItems] = useState<BorrowedDetailItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedKondisi, setSelectedKondisi] = useState("");
  const [returnList, setReturnList] = useState<ReturnEntry[]>([]);

  // ── Fetch saat dialog buka ──
  useEffect(() => {
    if (!open) return;
    getBorrowedDetailItems()
      .then(setBorrowedItems)
      .catch(() => toast.error("Gagal memuat item borrowed."));
    getEmployees()
      .then(setEmployees)
      .catch(() => toast.error("Gagal memuat data employee."));
  }, [open]);

  // Item yang belum masuk returnList
  const availableItems = borrowedItems.filter(
    (item) => !returnList.find((r) => r.item.id === item.id)
  );

  const handleAddToList = () => {
    if (!selectedItemId) {
      toast.warning("Pilih item terlebih dahulu.");
      return;
    }
    if (!selectedKondisi) {
      toast.warning("Pilih kondisi barang setelah dikembalikan.");
      return;
    }
    const item = borrowedItems.find((i) => i.id === selectedItemId);
    if (!item) return;

    setReturnList((prev) => [...prev, { item, kondisi: selectedKondisi }]);
    setSelectedItemId("");
    setSelectedKondisi("");
  };

  const handleRemoveEntry = (id: string) => {
    setReturnList((prev) => prev.filter((r) => r.item.id !== id));
  };

  const handleSubmit = async () => {
    if (!selectedEmployeeId) {
      toast.error("Pilih user yang mengembalikan.");
      return;
    }
    if (returnList.length === 0) {
      toast.error("Tambahkan minimal satu item.");
      return;
    }

    setLoading(true);
    try {
    await returnDetailItems(returnList, selectedEmployeeId);
      toast.success(`${returnList.length} item berhasil dikembalikan.`);
      setOpen(false);
      resetForm();
      onSuccess?.();
      router.refresh();
    } catch {
      toast.error("Gagal memproses pengembalian.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedItemId("");
    setSelectedEmployeeId("");
    setSelectedKondisi("");
    setReturnList([]);
    setShowTable(false);
  };

  const kondisiBadge = (kondisi: string) => {
    if (kondisi === "Good") return "bg-green-100 text-green-700";
    if (kondisi === "Fair") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-800 text-white hover:bg-blue-900">
          + Add Transaction Return
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold">
            Add Transaction Return
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* ── Row 1: Item + Kondisi ── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Not Returned Item</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Pilih Item (Borrowed)" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.length === 0 ? (
                    <SelectItem value="-" disabled>
                      {borrowedItems.length === 0
                        ? "Tidak ada item borrowed"
                        : "Semua item sudah dipilih"}
                    </SelectItem>
                  ) : (
                    availableItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.serial_number} — {item.item.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Kondisi Barang</Label>
              <Select value={selectedKondisi} onValueChange={setSelectedKondisi}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Pilih Kondisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Row 2: Employee + Tombol Tambah ── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>User Yang Mengembalikan</Label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Pilih Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleAddToList}
                disabled={!selectedItemId || !selectedKondisi}
                className="h-11 w-full bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                + Tambah ke Daftar
              </Button>
            </div>
          </div>

          {/* ── Tabel opsional ── */}
          {returnList.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowTable((v) => !v)}
                className="mb-2 flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
              >
                {showTable ? (
                  <><ChevronUp size={15} /> Sembunyikan daftar</>
                ) : (
                  <><ChevronDown size={15} /> Lihat daftar ({returnList.length} item)</>
                )}
              </button>

              {showTable && (
                <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/[0.03]">
                  <div className="overflow-x-auto">
                    <Table className="w-full min-w-[560px] table-auto">
                      <TableHeader>
                        <TableRow>
                          {["No", "Item Name", "SN Number", "WH Asal", "Kondisi Lama", "Kondisi Baru", "Action"].map(
                            (col, i, arr) => (
                              <TableCell
                                key={col}
                                isHeader
                                className={`border bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200 ${i === 0 ? "rounded-l-md" : ""} ${i === arr.length - 1 ? "rounded-r-md" : ""}`}
                              >
                                {col}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {returnList.map((entry, index) => (
                          <TableRow key={entry.item.id}>
                            <TableCell className="border px-4 py-3 text-sm text-gray-600">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border px-4 py-3 text-sm text-gray-600">
                              {entry.item.item.name}
                            </TableCell>
                            <TableCell className="border px-4 py-3 text-xs font-mono text-gray-500">
                              {entry.item.serial_number}
                            </TableCell>
                            <TableCell className="border px-4 py-3 text-sm text-gray-600">
                              {entry.item.room.name}
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${kondisiBadge(entry.item.condition)}`}>
                                {entry.item.condition}
                              </span>
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${kondisiBadge(entry.kondisi)}`}>
                                {entry.kondisi}
                              </span>
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Button
                                size="sm"
                                variant="destructive"
                                type="button"
                                onClick={() => handleRemoveEntry(entry.item.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-8 gap-3">
          <DialogClose asChild>
            <Button variant="outline" type="button">Close</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || returnList.length === 0 || !selectedEmployeeId}
            className="bg-blue-800 text-white hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}