"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
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
import Label from "../../../form/Label";
import { Input } from "../../../ui/input";
import {
  getCategories,
  Category,
  getSubcategories,
  Subcategory,
} from "@/lib/category";
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
import { getMyEmployeeId } from "@/lib/roles";
import ImportExcel, { ParsedImportData } from "@/components/buttonExcel/importExcel";

interface TransactionItemRow {
  item_id: string;
  item_name: string;
  price: number;
  qty: number;
  condition: ItemConditions;
  procurement_year: number;
}

interface FormErrors {
  poNumber?: string;
  warehouse?: string;
  supplier?: string;
  categori?: string;
  detailTransaction?: string;
  items?: string;
}

export default function DialogTransactionIn({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Room[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [poNumber, setPoNumber] = useState("");
  const [detailTransaction, setDetailTransaction] = useState("");
  const { data: session } = useSession();
  const userId: any = session?.user?.id;
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [subCategoryCode, setSubCategoryCode] = useState<string>("");
  const [rows, setRows] = useState<TransactionItemRow[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [itemSearch, setItemSearch] = useState("");

  // ── Filter items berdasarkan subkategori & search ──────────────────────────
  const filteredItems = selectedSubcategoryId
    ? items.filter(
        (item) =>
          item.subcategory_id === selectedSubcategoryId &&
          item.name.toLowerCase().includes(itemSearch.toLowerCase()),
      )
    : [];

  const fetchAll = async () => {
    try {
      const [catRes, subCatRes, supRes, roomRes, itemRes] = await Promise.all([
        getCategories(1, 1000),
        getSubcategories(1, 1000),
        getSuppliers(),
        getRooms(),
        getItems(),
      ]);
      setCategories(catRes.data);
      setSubcategories(subCatRes.data);
      setSuppliers(supRes.data);
      setWarehouses(roomRes.data);
      setItems(itemRes.data);
    } catch (error) {
      console.error("Fetch dialog data error:", error);
    }
  };

  const handleaddItem = () => {
    // ── Kategori wajib hanya saat mau tambah item baru ──
    if (!selectedSubcategoryId) {
      setErrors((prev) => ({ ...prev, categori: "Pilih kategori dulu sebelum menambah item" }));
      toast.error("Pilih kategori dulu sebelum menambah item");
      return;
    }

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
        // qty_request: 1,
        qty: 1,
        condition: ItemConditions.GOOD,
        procurement_year: new Date().getFullYear(),
      },
    ]);

    setSelectedItemId("");
    setErrors((prev) => ({ ...prev, items: undefined }));
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const priceMap = items.reduce((acc, item) => {
  acc[item.id] = item.price ?? 0;
  return acc;
}, {} as { [key: string]: number });

  const handleSubmit = async () => {
    setErrors({});

    // ── Validasi manual: kategori boleh kosong asal rows sudah ada ──────────
    const newErrors: FormErrors = {};

    if (!poNumber) newErrors.poNumber = "PO Number wajib diisi";
    if (!selectedWarehouseId) newErrors.warehouse = "Warehouse wajib dipilih";
    if (!selectedSupplierId) newErrors.supplier = "Supplier wajib dipilih";
    if (!detailTransaction) newErrors.detailTransaction = "Detail transaksi wajib diisi";

    // Kategori hanya wajib kalau rows KOSONG
    // Kalau rows sudah ada item → kategori boleh tidak dipilih
    if (rows.length === 0 && !selectedSubcategoryId) {
      newErrors.categori = "Pilih kategori atau tambahkan item terlebih dahulu";
    }

    if (rows.length === 0) {
      newErrors.items = "Tambahkan minimal satu item";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Harap lengkapi semua field yang diperlukan");
      return;
    }

    const employeeId = await getMyEmployeeId(userId);

    const inType = rows.every((row) => row.price === 0)
      ? InType.DONATION
      : InType.BUY;

    let counter = 1;
    const dateStr = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}`;

    const payload = {
      user_id: userId,
      supplier_id: selectedSupplierId,
      po_number: poNumber,
      transaction_date: new Date(transactionDate),
      status: TransactionStatus.DRAFT,
      returned_by: employeeId,
      in_type: inType,
      transaction_details: rows.map((row) => ({
        created_by: userId,
        item_id: row.item_id,
        room_id: selectedWarehouseId,
        quantity: row.qty,
        price: inType === InType.DONATION ? null : row.price,
        condition: row.condition,
        procurement_month: new Date().getMonth() + 1,
        procurement_year: row.procurement_year,
      })),
      detail_items: rows.flatMap((row) =>
        Array.from({ length: row.qty }).map(() => ({
          item_id: row.item_id,
          room_id: selectedWarehouseId,
          serial_number: `${subCategoryCode}-${poNumber}-${dateStr}-${counter++}`,
          condition: row.condition,
          status: ItemStatus.AVAILABLE,
          created_by: userId,
        })),
      ),
    };


    try {
      const result = await createTransactionIn(payload as any);
      console.log("===============================", result);
      toast.success("Transaction berhasil dibuat");
      await onSuccess?.();
      setRows([]);
      setPoNumber("");
      setDetailTransaction("");
      setSelectedSupplierId("");
      setSelectedWarehouseId("");
      setSelectedItemId("");
      setSelectedSubcategoryId("");
      setSubCategoryCode("");
      setErrors({});
    } catch (error) {
      console.error("Create transaction error:", error);
      toast.error("Gagal membuat transaksi");
    }
  };

  const handleImport = (data: ParsedImportData) => {
    if (data.poNumber) setPoNumber(data.poNumber);
    if (data.warehouse) setSelectedWarehouseId(data.warehouse);
    if (data.supplier) setSelectedSupplierId(data.supplier);
    if (data.subKategori) {
      setSelectedSubcategoryId(data.subKategori);
      const sub = subcategories.find((s) => s.id === data.subKategori);
      setSubCategoryCode(sub?.code ?? "");
    }
    setRows(data.rows);
  };

  return (
    <div className="flex justify-end">
      <Dialog onOpenChange={(open) => open && fetchAll()}>
        <DialogTrigger asChild>
          <Button size="lg" className="bg-blue-800 text-white hover:bg-blue-900">
            + Add Transaction In
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] w-full max-w-6xl overflow-y-auto p-8 dark:bg-black">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
                  {errors.poNumber && <p className="text-xs text-red-500">{errors.poNumber}</p>}
                </div>
                <Input
                  placeholder="PO Number"
                  value={poNumber}
                  onChange={(e) => { setPoNumber(e.target.value); clearError("poNumber"); }}
                  className={`no-spinner ${errors.poNumber ? "border-red-500" : ""}`}
                />
              </div>

              {/* Detail Transaction */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Detail Transaction</Label>
                  {errors.detailTransaction && <p className="text-xs text-red-500">{errors.detailTransaction}</p>}
                </div>
                <Input
                  placeholder="Detail Transaction"
                  value={detailTransaction}
                  onChange={(e) => { setDetailTransaction(e.target.value); clearError("detailTransaction"); }}
                  className={errors.detailTransaction ? "border-red-500" : ""}
                />
              </div>

              {/* Warehouses */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Warehouses</Label>
                  {errors.warehouse && <p className="text-xs text-red-500">{errors.warehouse}</p>}
                </div>
                <Select
                  value={selectedWarehouseId}
                  onValueChange={(v) => { setSelectedWarehouseId(v); clearError("warehouse"); }}
                >
                  <SelectTrigger className={`h-11 w-full ${errors.warehouse ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Suppliers */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Suppliers</Label>
                  {errors.supplier && <p className="text-xs text-red-500">{errors.supplier}</p>}
                </div>
                <Select
                  value={selectedSupplierId}
                  onValueChange={(v) => { setSelectedSupplierId(v); clearError("supplier"); }}
                >
                  <SelectTrigger className={`h-11 w-full max-w-xl ${errors.supplier ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kategori — opsional kalau rows sudah ada */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>
                    Kategori
                    {rows.length > 0 && (
                      <span className="ml-1 text-xs text-gray-400">(opsional)</span>
                    )}
                  </Label>
                  {errors.categori && <p className="text-xs text-red-500">{errors.categori}</p>}
                </div>
                <Select
                  value={selectedSubcategoryId}
                  onValueChange={(v) => {
                    setSelectedSubcategoryId(v);
                    setSelectedItemId("");
                    clearError("categori");
                    const subcategory = subcategories.find((c) => c.id === v);
                    setSubCategoryCode(subcategory?.code ?? "");
                  }}
                >
                  <SelectTrigger className={`h-11 w-full max-w-xl ${errors.categori ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-60 overflow-y-auto">
                      {categories.map((cat) => {
                        const subs = subcategories.filter((s) => s.category_id === cat.id);
                        if (subs.length === 0) return null;
                        return (
                          <div key={cat.id}>
                            <div className="select-none bg-gray-50 dark:bg-black px-2 py-1.5 text-xs font-semibold text-gray-400">
                              {cat.name}
                            </div>
                            {subs.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id} className="w-full max-w-xl p-2">
                                {sub.name}
                              </SelectItem>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label>Items</Label>
                  {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
                </div>
                <Select
                  value={selectedItemId}
                  onValueChange={(v) => { setSelectedItemId(v); setItemSearch(""); }}
                  disabled={!selectedSubcategoryId}
                >
                  <SelectTrigger className={`h-11 w-full max-w-xl ${errors.items ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={selectedSubcategoryId ? "Pilih Item" : "Pilih Kategori dulu"} />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                    <div className="sticky top-0 z-10 bg-white dark:bg-black p-2">
                      <input
                        className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                        placeholder="Cari item..."
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {filteredItems.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Tidak ada item</div>
                      ) : (
                        filteredItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={handleaddItem}
                disabled={!selectedItemId}
                className="h-11 bg-blue-800 text-white hover:bg-blue-900 max-w-xs"
              >
                Add Item
              </Button>
              <ImportExcel
                items={items}
                subcategories={subcategories}
                warehouses={warehouses}
                suppliers={suppliers}
                price={priceMap}
                onImport={handleImport}
              />
            </div>

            {errors.items && rows.length === 0 && (
              <p className="mt-2 text-sm text-red-500">* Tambahkan minimal satu item ke tabel</p>
            )}

            {/* Table */}
            <div className="dark:bg-white/3 mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/5">
              <div className="relative overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <Table className="min-w-200 w-full table-auto">
                    <TableHeader className="border border-gray-100 dark:border-white/5">
                      <TableRow>
                        {["No", "Item ID", "Item Name", "Item Price", "QTY", "Item Condition", "Tahun Pengadaan", "Action"].map((h, i) => (
                          <TableCell
                            key={i}
                            isHeader
                            className={`min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200 ${i === 0 ? "rounded-l-md border-r-0" : ""} ${i === 8 ? "rounded-r-md" : ""}`}
                          >
                            {h}
                          </TableCell>
                        ))}
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
                              <Input
                                type="number"
                                value={row.price}
                                onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, price: Number(e.target.value) } : r))}
                              />
                            </TableCell>
                            {/* <TableCell className="border px-4 py-3">
                              <Input
                                type="number"
                                min={1}
                                value={row.qty_request}
                                onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, qty_request: Number(e.target.value) } : r))}
                              />
                            </TableCell> */}
                            <TableCell className="border px-4 py-3">
                              <Input
                                type="number"
                                min={0}
                                value={row.qty}
                                onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, qty: Number(e.target.value) } : r))}
                              />
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Select
                                value={row.condition}
                                onValueChange={(v: ItemConditions) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, condition: v } : r))}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={ItemConditions.GOOD}>Baik</SelectItem>
                                  <SelectItem value={ItemConditions.FAIR}>Cukup</SelectItem>
                                  <SelectItem value={ItemConditions.POOR}>Rusak</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Input
                                type="number"
                                value={row.procurement_year}
                                onChange={(e) => setRows((prev) => prev.map((r, i) => i === index ? { ...r, procurement_year: Number(e.target.value) } : r))}
                              />
                            </TableCell>
                            <TableCell className="border px-4 py-3">
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                              >
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