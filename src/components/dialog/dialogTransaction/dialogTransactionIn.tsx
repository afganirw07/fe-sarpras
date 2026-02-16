"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
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
import Label from "../../form/Label";
import { Input } from "../../ui/input";
import { getCategories, Category } from "@/lib/category";
import { getSuppliers, Supplier } from "@/lib/supplier";
import { getRooms, Room } from "@/lib/warehouse";
import { getItems, Item } from "@/lib/items";
import {createTransactionIn,InType,TransactionStatus, ItemConditions, ItemStatus} from "@/lib/transaction"

import { useState } from "react";

interface TransactionItemRow {
  item_id: string;
  item_name: string;
  price: number;
  qty_request: number;
  qty_receive: number;
  condition: string;
  procurement_year: number;
}

export default function DialogTransactionIn() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Room[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [poNumber, setPoNumber] = useState("")
  const userId = "USER_ID_LOGIN"
  const [transactionDate, setTransactionDate] = useState(
  new Date().toISOString().split("T")[0]
)

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const [rows, setRows] = useState<TransactionItemRow[]>([]);

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
  if (!selectedItemId || !selectedWarehouseId) return

  const item = items.find((i) => i.id === selectedItemId)
  if (!item) return

  const isExist = rows.some((r) => r.item_id === item.id)
  if (isExist) return

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
  ])

  setSelectedItemId("")
}


const handleSubmit = async () => {
  if (!selectedSupplierId || !selectedWarehouseId || rows.length === 0) {
    alert("Data belum lengkap")
    return
  }

  try {
    const payload = {
      user_id: userId,
      supplier_id: selectedSupplierId,
      po_number: poNumber,
      transaction_date: new Date(transactionDate),
      status: TransactionStatus.DRAFT ,
      in_type: InType.PURCHASE,

      transaction_details: rows.map((row) => ({
        item_id: row.item_id,
        room_id: selectedWarehouseId,
        quantity: row.qty_receive,
        price: row.price,
        condition: ItemConditions,
        procurement_month: new Date().getMonth() + 1,
        procurement_year: row.procurement_year,
      })),

     detail_items: rows.flatMap((row) =>
  Array.from({ length: row.qty_receive }).map((_, i) => ({
    item_id: row.item_id,
    room_id: selectedWarehouseId,
    serial_number: `SN-${row.item_id}-${Date.now()}-${i}`,
    condition:
      row.condition === "GOOD"
        ? ItemConditions.GOOD
        : ItemConditions.DAMAGED,
    status: ItemStatus.AVAILABLE,
  }))
),

    }

    await createTransactionIn(payload)

    alert("Transaction berhasil dibuat")
    setRows([])
    setPoNumber("")
    setSelectedSupplierId("")
    setSelectedWarehouseId("")
    setSelectedCategoryId("")
    setSelectedItemId("")
  } catch (error) {
    console.error("Create transaction error:===========================================", error)

    alert("Gagal membuat transaksi")
  }
}


  return (
    <div className="flex justify-end">
     <Dialog onOpenChange={(open) => open && fetchAll()}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-blue-800 text-white hover:bg-blue-900"
          >
            + Add Transaction In
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] w-full max-w-6xl overflow-y-auto p-8">
          <form
  onSubmit={(e) => {
    e.preventDefault()
    handleSubmit()
  }}
>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold">
                Add Transaction In
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>PO Number</Label>
              <Input
  placeholder="PO Number"
  value={poNumber}
  onChange={(e) => setPoNumber(e.target.value)}
/>

              </div>

              <div className="flex flex-col gap-2">
                <Label>Detail Transaction</Label>
                <Input placeholder="Detail Transaction" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Warehouses</Label>
              <Select
  value={selectedWarehouseId}
  onValueChange={setSelectedWarehouseId}
>
  <SelectTrigger className="h-11 w-full">
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

              <div className="flex flex-col gap-2">
                <Label>Suppliers</Label>
                <Select
                  value={selectedSupplierId}
                  onValueChange={setSelectedSupplierId}
                >
                  <SelectTrigger className="h-11">
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

              <div className="flex flex-col gap-2">
                <Label>Kategori</Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(v) => {
                    setSelectedCategoryId(v);
                    setSelectedItemId(""); // reset item saat ganti kategori
                  }}
                >
                  <SelectTrigger className="h-11">
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

              <div className="flex flex-col gap-2">
                <Label>items</Label>
                <Select
                  value={selectedItemId}
                  onValueChange={setSelectedItemId}
                  disabled={!selectedCategoryId}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue
                      placeholder={
                        selectedCategoryId
                          ? "Pilih Item"
                          : "Pilih Kategori dulu"
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

            <div className="dark:bg-white/3 mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/5">
              <div className="relative overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <Table className="min-w-200 w-full table-auto">
                    <TableHeader className="border border-gray-100 dark:border-white/5">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="min-w-7.5 rounded-l-md border border-r-0 bg-blue-800 px-6 py-3 text-xs font-medium text-gray-200"
                        >
                          No
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Item ID
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Item Name
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Item Price
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-55 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          QTY Request
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          QTY Receive
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Item condition
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Tahun Pengadaan
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 rounded-r-md border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                   <TableBody>
  {rows.length === 0 ? (
    <TableRow>
      <td
        colSpan={9}
        className="border px-6 py-6 text-center text-sm text-gray-500"
      >
        Belum ada item
      </td>
    </TableRow>
  ) : (
    rows.map((row, index) => (
      <TableRow key={row.item_id}>
        <TableCell className="border px-4 py-3">
          {index + 1}
        </TableCell>

        <TableCell className="border px-4 py-3">
          {row.item_id}
        </TableCell>

        <TableCell className="border px-4 py-3">
          {row.item_name}
        </TableCell>

        <TableCell className="border px-4 py-3">
          <Input
            type="number"
            value={row.price}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((r, i) =>
                  i === index
                    ? { ...r, price: Number(e.target.value) }
                    : r
                )
              )
            }
          />
        </TableCell>

        <TableCell className="border px-4 py-3">
          <Input
            type="number"
            min={1}
            value={row.qty_request}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((r, i) =>
                  i === index
                    ? { ...r, qty_request: Number(e.target.value) }
                    : r
                )
              )
            }
          />
        </TableCell>

        <TableCell className="border px-4 py-3">
          <Input
            type="number"
            min={0}
            value={row.qty_receive}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((r, i) =>
                  i === index
                    ? { ...r, qty_receive: Number(e.target.value) }
                    : r
                )
              )
            }
          />
        </TableCell>

        <TableCell className="border px-4 py-3">
          <Select
            value={row.condition}
            onValueChange={(v: "GOOD" | "DAMAGED") =>
              setRows((prev) =>
                prev.map((r, i) =>
                  i === index ? { ...r, condition: v } : r
                )
              )
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue
                placeholder="Pilih"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GOOD">Baik</SelectItem>
              <SelectItem value="DAMAGED">Rusak</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>

        <TableCell className="border px-4 py-3">
         <Input
  type="number"
  value={row.procurement_year}
  onChange={(e) =>
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, procurement_year: Number(e.target.value) }
          : r
      )
    )
  }
/>

        </TableCell>

        {/* ACTION */}
        <TableCell className="border px-4 py-3">
          <Button
            size="icon"
            variant="destructive"
            onClick={() =>
              setRows((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
          >
            🗑
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
             <Button
  type="submit"
  className="bg-blue-800 text-white hover:bg-blue-900"
>
  Save
</Button>

            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
