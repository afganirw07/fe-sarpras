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
import { getCategories, Category } from "@/lib/category";
import { getSuppliers, Supplier } from "@/lib/supplier";
import { getRooms, Room } from "@/lib/warehouse";
import { getItems, Item } from "@/lib/items";
import {
  createTransactionIn,
  InType,
  TransactionStatus,
  ItemConditions,
  ItemStatus,
} from "@/lib/transaction";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { tansactionInSchema } from "@/schema/transaction_jn.schema"; 

interface TransactionItemRow {
  item_id: string;
  item_name: string;
  price: number;
  qty_request: number;
  qty_receive: number;
  condition: ItemConditions;
  procurement_year: number;
}

// ✅ Tipe untuk form errors dari Zod
interface FormErrors {
  poNumber?: string;
  warehouse?: string;
  supplier?: string;
  categori?: string;
  detailTransaction?: string;
  items?: string;
}

export default function DialogTransactionIn({ onSuccess }: { onSuccess?: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Room[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [poNumber, setPoNumber] = useState("");
  const [detailTransaction, setDetailTransaction] = useState(""); // ✅ tambah state
  const { data: session } = useSession();
  const userId: any = session?.user?.id;
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const [rows, setRows] = useState<TransactionItemRow[]>([]);

  // ✅ State untuk errors
  const [errors, setErrors] = useState<FormErrors>({});

  const filteredItems = selectedCategoryId
    ? items.filter((item) => item.category_id === selectedCategoryId)
    : [];

  const fetchAll = async () => {
    try {
      const [catRes, supRes, roomRes, itemRes] = await Promise.all([
        getCategories(),
        getSuppliers(),
        getRooms(),
        getItems(),
      ]);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
      setWarehouses(roomRes.data);
      setItems(itemRes.data);
    } catch (error) {
      console.error("Fetch dialog data error:", error);
    }
  };

  const handleaddItem = () => {
    if (!selectedItemId || !selectedWarehouseId) return;

    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    const isExist = rows.some((r) => r.item_id === item.id);
    if (isExist) return;

    setRows((prev) => [
      ...prev,
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price ?? 0,
        qty_request: 1,
        qty_receive: 1,
        condition: ItemConditions.GOOD,
        procurement_year: new Date().getFullYear(),
      },
    ]);

    setSelectedItemId("");

    // ✅ Clear error items saat item ditambahkan
    setErrors((prev) => ({ ...prev, items: undefined }));
  };

  // ✅ Helper: clear error saat field diubah
  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    // ✅ Reset errors sebelum validasi
    setErrors({});

    // ✅ Siapkan data untuk validasi Zod
    const validationData = {
      poNumber: poNumber ? Number(poNumber) : 0,
      warehouse: selectedWarehouseId,
      supplier: selectedSupplierId,
      categori: selectedCategoryId,
      detailTransaction: detailTransaction,
      items: rows.length > 0 ? "filled" : "", // cek apakah ada item
    };

    // ✅ Validasi dengan Zod
    try {
      tansactionInSchema.parse(validationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          formattedErrors[field] = err.message;
        });
        setErrors(formattedErrors);
        toast.error("Harap lengkapi semua field yang diperlukan");
        return;
      }
    }

    // ✅ Lanjut submit jika validasi lolos
    const inType = rows.every((row) => row.price === 0)
      ? InType.DONATION
      : InType.BUY;

    const payload = {
      user_id: userId,
      supplier_id: selectedSupplierId,
      po_number: poNumber,
      transaction_date: new Date(transactionDate),
      status: TransactionStatus.DRAFT,
      in_type: inType,
      transaction_details: rows.map((row) => ({
        item_id: row.item_id,
        room_id: selectedWarehouseId,
        quantity: row.qty_receive,
        price: inType === InType.DONATION ? null : row.price,
        condition: row.condition,
        procurement_month: new Date().getMonth() + 1,
        procurement_year: row.procurement_year,
      })),
      detail_items: rows.flatMap((row) =>
        Array.from({ length: row.qty_receive }).map((_, i) => ({
          item_id: row.item_id,
          room_id: selectedWarehouseId,
          serial_number: `${row.item_id}-${Date.now()}-${i}`,
          condition: row.condition,
          status: ItemStatus.AVAILABLE,
          created_by: userId,
        }))
      ),
    };

    try {
      const result = await createTransactionIn(payload);
      console.log("===============================", result);
      toast.success("Transaction berhasil dibuat");
      await onSuccess?.();
      // ✅ Reset semua state
      setRows([]);
      setPoNumber("");
      setDetailTransaction("");
      setSelectedSupplierId("");
      setSelectedWarehouseId("");
      setSelectedCategoryId("");
      setSelectedItemId("");
      setErrors({});
    } catch (error) {
      console.error("Create transaction error:", error);
      toast.error("Gagal membuat transaksi");
    }
  };

  return (
    <div className="flex justify-end">
      <Toaster richColors />
      <Dialog onOpenChange={(open) => open && fetchAll()}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-blue-800 text-white hover:bg-blue-900">
            + Add Transaction In
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] w-full max-w-6xl overflow-y-auto p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold">
                Add Transaction In
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* PO Number */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>PO Number</Label>
                  {errors.poNumber && (
                    <p className="text-xs text-red-500">{errors.poNumber}</p>
                  )}
                </div>
                <Input
                  placeholder="PO Number"
                  value={poNumber}
                  onChange={(e) => {
                    setPoNumber(e.target.value);
                    clearError("poNumber");
                  }}
                  type="number"
                  className={`no-spinner ${errors.poNumber ? "border-red-500" : ""}`}
                />
              </div>

              {/* Detail Transaction */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Detail Transaction</Label>
                  {errors.detailTransaction && (
                    <p className="text-xs text-red-500">{errors.detailTransaction}</p>
                  )}
                </div>
                <Input
                  placeholder="Detail Transaction"
                  value={detailTransaction}
                  onChange={(e) => {
                    setDetailTransaction(e.target.value);
                    clearError("detailTransaction");
                  }}
                  className={errors.detailTransaction ? "border-red-500" : ""}
                />
              </div>

              {/* Warehouses */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Warehouses</Label>
                  {errors.warehouse && (
                    <p className="text-xs text-red-500">{errors.warehouse}</p>
                  )}
                </div>
                <Select
                  value={selectedWarehouseId}
                  onValueChange={(v) => {
                    setSelectedWarehouseId(v);
                    clearError("warehouse");
                  }}
                >
                  <SelectTrigger className={`h-11 w-full ${errors.warehouse ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Suppliers */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Suppliers</Label>
                  {errors.supplier && (
                    <p className="text-xs text-red-500">{errors.supplier}</p>
                  )}
                </div>
                <Select
                  value={selectedSupplierId}
                  onValueChange={(v) => {
                    setSelectedSupplierId(v);
                    clearError("supplier");
                  }}
                >
                  <SelectTrigger className={`h-11 ${errors.supplier ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kategori */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Kategori</Label>
                  {errors.categori && (
                    <p className="text-xs text-red-500">{errors.categori}</p>
                  )}
                </div>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(v) => {
                    setSelectedCategoryId(v);
                    setSelectedItemId("");
                    clearError("categori");
                  }}
                >
                  <SelectTrigger className={`h-11 ${errors.categori ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Items</Label>
                  {errors.items && (
                    <p className="text-xs text-red-500">{errors.items}</p>
                  )}
                </div>
                <Select
                  value={selectedItemId}
                  onValueChange={setSelectedItemId}
                  disabled={!selectedCategoryId}
                >
                  <SelectTrigger className={`h-11 ${errors.items ? "border-red-500" : ""}`}>
                    <SelectValue
                      placeholder={
                        selectedCategoryId ? "Pilih Item" : "Pilih Kategori dulu"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredItems.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Tidak ada item
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={handleaddItem}
                disabled={!selectedItemId}
                className="h-11 bg-blue-800 text-white hover:bg-blue-900"
              >
                Add Item
              </Button>
            </div>

            {/* ✅ Error global jika rows kosong */}
            {errors.items && rows.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                * Tambahkan minimal satu item ke tabel
              </p>
            )}

            {/* Table */}
            <div className="dark:bg-white/3 mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/5">
              <div className="relative overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <Table className="min-w-200 w-full table-auto">
                    <TableHeader className="border border-gray-100 dark:border-white/5">
                      <TableRow>
                        <TableCell isHeader className="min-w-7.5 rounded-l-md border border-r-0 bg-blue-800 px-6 py-3 text-xs font-medium text-gray-200">No</TableCell>
                        <TableCell isHeader className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">Item ID</TableCell>
                        <TableCell isHeader className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">Item Name</TableCell>
                        <TableCell isHeader className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">Item Price</TableCell>
                        <TableCell isHeader className="min-w-55 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">QTY Request</TableCell>
                        <TableCell isHeader className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">QTY Receive</TableCell>
                        <TableCell isHeader className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">Item condition</TableCell>
                        <TableCell isHeader className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">Tahun Pengadaan</TableCell>
                        <TableCell isHeader className="min-w-7.5 rounded-r-md border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200">Action</TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <td colSpan={9} className="border px-6 py-6 text-center text-sm text-gray-500">
                            Belum ada item
                          </td>
                        </TableRow>
                      ) : (
                        rows.map((row, index) => (
                          <TableRow key={row.item_id}>
                            <TableCell className="border px-4 py-3">{index + 1}</TableCell>
                            <TableCell className="border px-4 py-3">{row.item_id}</TableCell>
                            <TableCell className="border px-4 py-3">{row.item_name}</TableCell>
                            <TableCell className="border px-4 py-3">
                              <Input type="number" value={row.price} onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, price: Number(e.target.value) } : r))} />
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Input type="number" min={1} value={row.qty_request} onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, qty_request: Number(e.target.value) } : r))} />
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Input type="number" min={0} value={row.qty_receive} onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, qty_receive: Number(e.target.value) } : r))} />
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Select value={row.condition} onValueChange={(v: ItemConditions) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, condition: v } : r))}>
                                <SelectTrigger className="h-9"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={ItemConditions.GOOD}>Baik</SelectItem>
                                  <SelectItem value={ItemConditions.FAIR}>Cukup</SelectItem>
                                  <SelectItem value={ItemConditions.POOR}>Rusak</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Input type="number" value={row.procurement_year} onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, procurement_year: Number(e.target.value) } : r))} />
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Button size="icon" variant="destructive" onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}>
                                <Trash2 />
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
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button type="submit" className="bg-blue-800 text-white hover:bg-blue-900">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}