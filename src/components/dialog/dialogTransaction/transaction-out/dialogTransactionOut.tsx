"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
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
import Label from "../../../form/Label";
import { Input } from "../../../ui/input";
import { createLoanRequest } from "@/lib/loan-request";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getAvailableDetailItems,
  getCategoriesByWarehouse,
  getItemsByWarehouseAndCategory,
} from "@/lib/detail-items";
import { getRooms, Room } from "@/lib/warehouse";
import { Item } from "@/lib/items";
import { getUsers, User } from "@/lib/user";
import { Category } from "@/lib/category";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DetailItem {
  id: string;
  item_id: string;
  room_id: string;
  serial_number: string;
  condition: string;
  status: string;
  room: { name: string };
  item: {
    name: string;
    category: { name: string };
    subcategory: { name: string };
  };
}

interface TransactionOutRow {
  detail_item_id: string;
  item_id: string;
  item_name: string;
  serial_number: string;
  subcategory: string;
  condition: string;
  warehouse_name: string;
  remarks: string;
}

interface DialogTransactionOutProps {
  onSuccess?: () => void;
}

export default function DialogTransactionOut({ onSuccess }: DialogTransactionOutProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [warehouse, setWarehouse] = useState<Room[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [rows, setRows] = useState<TransactionOutRow[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [borrowerWarehouseId, setBorrowerWarehouseId] = useState("");
  const [originWarehouseId, setOriginWarehouseId] = useState("");
  const [selectedUsersId, setSelectedUsersId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [borrowDate, setBorrowDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();

  const [availableDetailItems, setAvailableDetailItems] = useState<DetailItem[]>([]);
  const [selectedDetailItemId, setSelectedDetailItemId] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchAll = async () => {
      try {
        const [roomRes, usersRes] = await Promise.all([getRooms(), getUsers()]);
        setWarehouse(roomRes.data);
        setUsers(usersRes);
      } catch (error) {
        console.error("Fetch dialog data error:", error);
      }
    };
    fetchAll();
  }, [open]);

  useEffect(() => {
    if (!originWarehouseId) {
      setCategory([]);
      setSelectedCategoryId("");
      setSelectedItemId("");
      setItems([]);
      setAvailableDetailItems([]);
      return;
    }

    const fetchCategoriesByWarehouse = async () => {
      setLoadingCategory(true);
      try {
        const res = await getCategoriesByWarehouse(originWarehouseId);
        setCategory(res.data);
        setSelectedCategoryId("");
        setSelectedItemId("");
        setItems([]);
        setAvailableDetailItems([]);
        setSelectedDetailItemId("");
        
      } catch (error) {
        console.error("Fetch categories by warehouse error:", error);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategoriesByWarehouse();
  }, [originWarehouseId]);

  useEffect(() => {
    if (!originWarehouseId || !selectedCategoryId) {
      setItems([]);
      setSelectedItemId("");
      setAvailableDetailItems([]);
      return;
    }

    const fetchItemsByWarehouseAndCategory = async () => {
      setLoadingItems(true);
      try {
        const res = await getItemsByWarehouseAndCategory(originWarehouseId, selectedCategoryId);
        setItems(res.data);
        setSelectedItemId("");
        setAvailableDetailItems([]);
        setSelectedDetailItemId("");
      } catch (error) {
        console.error("Fetch items by warehouse+category error:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItemsByWarehouseAndCategory();
  }, [originWarehouseId, selectedCategoryId]);

  useEffect(() => {
    if (!selectedItemId || !originWarehouseId) {
      setAvailableDetailItems([]);
      return;
    }

    const fetchDetailItems = async () => {
      setLoadingDetail(true);
      try {
        const res = await getAvailableDetailItems(selectedItemId, originWarehouseId);
        const addedIds = new Set(rows.map((r) => r.detail_item_id));
        setAvailableDetailItems((res.data ?? []).filter((d: DetailItem) => !addedIds.has(d.id)));
        setSelectedDetailItemId("");
        
      } catch (error) {
        console.error("Fetch detail items error:", error);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetailItems();
  }, [selectedItemId, originWarehouseId]);

  const resetForm = () => {
    setRows([]);
    setBorrowDate(undefined);
    setReturnDate(undefined);
    setSelectedItemId("");
    setSelectedCategoryId("");
    setOriginWarehouseId("");
    setBorrowerWarehouseId("");
    setRemarks("");
    setAvailableDetailItems([]);
    setSelectedDetailItemId("");
    setSelectedUsersId("");
    setCategory([]);
    setItems([]);
  };

  const handleAddItem = () => {
    if (!selectedDetailItemId) {
      toast.error("Pilih unit (serial number) terlebih dahulu");
      return;
    }
    const detail = availableDetailItems.find((d) => d.id === selectedDetailItemId);
    if (!detail) return;

    setRows((prev) => [
      ...prev,
      {
        detail_item_id: detail.id,
        item_id: detail.item_id,
        item_name: detail.item.name,
        serial_number: detail.serial_number,
        subcategory: detail.item.subcategory?.name ?? "-",
        condition: detail.condition,
        warehouse_name: detail.room?.name ?? warehouse.find((w) => w.id === originWarehouseId)?.name ?? "-",
        remarks: remarks,
      },
    ]);
    setAvailableDetailItems((prev) => prev.filter((d) => d.id !== selectedDetailItemId));
    setSelectedDetailItemId("");
  };

  const handleRemoveRow = (detail_item_id: string) => {
    setRows((prev) => prev.filter((r) => r.detail_item_id !== detail_item_id));
  };

  const handleSave = async () => {
    if (!borrowDate || !returnDate) {
      toast.error("Tanggal wajib diisi");
      return;
    }
    if (!borrowerWarehouseId || !originWarehouseId) {
      toast.error("Warehouse belum dipilih");
      return;
    }
    if (!rows.length) {
      toast.error("Belum ada item dipilih");
      return;
    }

    try {
      setLoading(true);
      await Promise.all(
        rows.map((row) =>
          createLoanRequest({
            user_id: selectedUsersId,
            item_id: row.detail_item_id,
            qty: 1,
            borrow_date: borrowDate?.toISOString(),
            return_date: returnDate?.toISOString() ?? undefined,
            description: row.remarks || remarks,
            origin_warehouse_id: originWarehouseId,
            borrower_warehouse_id: borrowerWarehouseId,
          })
        )
      );
      toast.success(`${rows.length} transaksi berhasil dibuat`);
      resetForm();
      setOpen(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat transaksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const addedDetailIds = new Set(rows.map((r) => r.detail_item_id));

  console.log("category state:", category);
console.log("originWarehouseId:", originWarehouseId);
console.log("loadingCategory:", loadingCategory);

  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-blue-800 text-white hover:bg-blue-900">
            + Add Transaction Out
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] w-full max-w-6xl overflow-y-auto p-8 dark:bg-black">
          <form>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold">
                Add Transaction Out
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Warehouse Peminjam</Label>
                <Select value={borrowerWarehouseId} onValueChange={setBorrowerWarehouseId}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih Warehouse Peminjam" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouse.map((room) => (
                      <SelectItem key={room.id} value={room.id} disabled={room.id === originWarehouseId}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Warehouse Asal Items</Label>
                <Select
                  value={originWarehouseId}
                  onValueChange={(val) => {
                    setOriginWarehouseId(val);
                    setSelectedDetailItemId("");
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih Warehouse Asal" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouse.map((room) => (
                      <SelectItem key={room.id} value={room.id} disabled={room.id === borrowerWarehouseId}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2: Kategori - disabled until WH Asal selected */}
              <div className="flex flex-col gap-2">
                <Label>
                  Kategori
                  {loadingCategory && (
                    <span className="ml-2 text-xs text-gray-400">Loading...</span>
                  )}
                  {!originWarehouseId && (
                    <span className="ml-2 text-xs text-amber-500">Pilih Warehouse Asal dulu</span>
                  )}
                </Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(val) => {
                    setSelectedCategoryId(val);
                    setSelectedItemId("");
                    setAvailableDetailItems([]);
                    setSelectedDetailItemId("");
                  }}
                  disabled={!originWarehouseId || loadingCategory}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={!originWarehouseId ? "Pilih Warehouse Asal dulu" : "Pilih Kategori"} />
                  </SelectTrigger>
                  <SelectContent>
                    {category.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        {loadingCategory ? "Loading..." : "Tidak ada kategori tersedia"}
                      </div>
                    ) : (
                      category
                        .filter((cat) => cat?.id && cat?.name)
                        .map((cat, i) => (
                          <SelectItem key={`cat-${cat.id ?? i}`} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 3: Item - disabled until Kategori selected */}
              <div className="flex flex-col gap-2">
                <Label>
                  Item
                  {loadingItems && (
                    <span className="ml-2 text-xs text-gray-400">Loading...</span>
                  )}
                  {originWarehouseId && !selectedCategoryId && (
                    <span className="ml-2 text-xs text-amber-500">Pilih Kategori dulu</span>
                  )}
                </Label>
                <Select
                  value={selectedItemId}
                  onValueChange={(val) => {
                    setSelectedItemId(val);
                    setSelectedDetailItemId("");
                  }}
                  disabled={!selectedCategoryId || loadingItems}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={!selectedCategoryId ? "Pilih Kategori dulu" : "Pilih Item"} />
                  </SelectTrigger>
                  <SelectContent>
                    {items.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        {loadingItems ? "Loading..." : "Tidak ada item tersedia"}
                      </div>
                    ) : (
                      items
                        .filter((item) => item?.id && item?.name)
                        .map((item, i) => (
                          <SelectItem key={`item-${item.id ?? i}`} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 4: Serial Number - disabled until Item selected */}
              <div className="flex flex-col gap-2">
                <Label>
                  Pilih Unit (Serial Number)
                  {loadingDetail && (
                    <span className="ml-2 text-xs text-gray-400">Loading...</span>
                  )}
                  {!loadingDetail && selectedItemId && originWarehouseId && (
                    <span className="ml-2 text-xs text-gray-400">
                      {availableDetailItems.filter((d) => !addedDetailIds.has(d.id)).length} unit tersedia
                    </span>
                  )}
                  {selectedCategoryId && !selectedItemId && (
                    <span className="ml-2 text-xs text-amber-500">Pilih Item dulu</span>
                  )}
                </Label>
                <Select
                  value={selectedDetailItemId}
                  onValueChange={setSelectedDetailItemId}
                  disabled={!selectedItemId || !originWarehouseId || loadingDetail}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={!selectedItemId ? "Pilih Item dulu" : "Pilih unit..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDetailItems.filter((d) => !addedDetailIds.has(d.id)).length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        {loadingDetail ? "Loading..." : "Tidak ada unit tersedia"}
                      </div>
                    ) : (
                      availableDetailItems
                        .filter((d) => !addedDetailIds.has(d.id))
                        .map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.serial_number} — {d.condition}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Remark</Label>
                <Input
                  placeholder="Masukkan keterangan..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Bertanggung Jawab</Label>
                <Select value={selectedUsersId} onValueChange={setSelectedUsersId}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih User" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        Tidak ada user
                      </div>
                    ) : (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-row py-4 space-x-6">
                <div className="flex flex-col gap-2">
                  <Label>Borrow Date</Label>
                  <Calendar
                    mode="single"
                    selected={borrowDate}
                    onSelect={setBorrowDate}
                    className="rounded-lg border dark:bg-black"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Return Date</Label>
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    className="rounded-lg border dark:bg-black"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedDetailItemId}
                className="bg-blue-800 text-white hover:bg-blue-900 disabled:opacity-50"
              >
                Add Item +
              </Button>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
              <div className="relative overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <Table className="w-full min-w-200 table-auto">
                    <TableHeader className="border border-gray-100 dark:border-white/5">
                      <TableRow>
                        {[
                          "No",
                          "Item ID",
                          "Item Name",
                          "Item SN Number",
                          "Item Subcategory",
                          "Item WH Asal",
                          "Item Condition",
                          "QTY",
                          "Item Remarks",
                          "Action",
                        ].map((header, i) => (
                          <TableCell
                            key={header}
                            isHeader
                            className={`border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200 ${
                              i === 0 ? "rounded-l-md border-r-0" : ""
                            } ${i === 9 ? "rounded-r-md" : ""}`}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <td colSpan={10} className="py-6 text-center text-gray-400">
                            No items selected
                          </td>
                        </TableRow>
                      ) : (
                        rows.map((row, index) => (
                          <TableRow key={row.detail_item_id}>
                            <TableCell className="border px-6 py-4">{index + 1}</TableCell>
                            <TableCell className="border px-4 py-4 text-xs">{row.item_id}</TableCell>
                            <TableCell className="border px-4 py-4">{row.item_name}</TableCell>
                            <TableCell className="border px-4 py-4 text-xs">{row.serial_number}</TableCell>
                            <TableCell className="border px-4 py-4">{row.subcategory}</TableCell>
                            <TableCell className="border px-4 py-4">{row.warehouse_name}</TableCell>
                            <TableCell className="border px-4 py-4">{row.condition}</TableCell>
                            <TableCell className="border px-4 py-4">1</TableCell>
                            <TableCell className="border px-4 py-4">{row.remarks || "-"}</TableCell>
                            <TableCell className="border px-4 py-4">
                              <Button
                                size="sm"
                                variant="destructive"
                                type="button"
                                onClick={() => handleRemoveRow(row.detail_item_id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 gap-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Close
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-800 text-white hover:bg-blue-900"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}