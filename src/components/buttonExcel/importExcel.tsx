"use client";
import * as XLSX from "xlsx-js-style";
import { Button } from "../ui/button";
import { useRef } from "react";
import { toast } from "sonner";
import { ItemConditions } from "@/lib/transaction";

// ── Types ──────────────────────────────────────────────────────────────────
interface TransactionItemRow {
  item_id: string;
  item_name: string;
  price: number;
  qty: number;
  condition: ItemConditions;
  procurement_year: number;
  serial_number?: string; 
  warehouse_id?: string;
}

interface ImportedExcelRow {
  No?: number;
  Warehouse?: string;
  supplier?: string;
  price?: string | number;
  Kategori?: string;
  sub_kategori?: string;
  nama_item?: string;
  Qty?: number;
  sumber_dana?: string; 
  serial_number?: string; 

}

export interface ParsedImportData {
  poNumber: string;
  warehouse: string;
  supplier: string;
  subKategori: string;
  rows: TransactionItemRow[];
}

interface ImportExcelProps {
  items: { id: string; name: string; price?: number; subcategory_id: string }[];
  subcategories: { id: string; name: string; code?: string; category_id: string }[];
  warehouses: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
  price: { [itemId: string]: number };
  onImport: (data: ParsedImportData) => void;
}

export default function ImportExcel({
  items,
  subcategories,
  warehouses,
  suppliers,
  price,
  onImport,
}: ImportExcelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalize = (val: any) =>
    val?.toString().trim().toLowerCase() ?? "";

  const findMatch = <T extends { name: string }>(
    list: T[],
    keyword?: string
  ) => {
    const key = normalize(keyword);
    return list.find(
      (i) =>
        normalize(i.name).includes(key) ||
        key.includes(normalize(i.name))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData: ImportedExcelRow[] = XLSX.utils.sheet_to_json(
          worksheet,
          {
            header: [
              "No",
              "Warehouse",
              "supplier",
              "Kategori",
              "sub_kategori",
              "nama_item",
              "price",
              "Qty",
              "sumber_dana",
              "serial_number", // ✅ kolom ke-9
            ],
            range: 1,
            defval: "",
          }
        );

        const dataRows = jsonData.filter(
          (row) =>
            row.No !== "No" &&
            row.No !== undefined &&
            row.No !== "" &&
            !isNaN(Number(row.No))
        );

        if (!dataRows.length) {
          toast.error("Tidak ada data ditemukan di file Excel");
          return;
        }

        const firstRow = dataRows[0];

        // ── Match master data ──────────────────────────────────────────────
        const matchedWarehouse   = findMatch(warehouses, firstRow.Warehouse);
        const matchedSupplier    = findMatch(suppliers, firstRow.supplier);
        const matchedSubcategory = findMatch(subcategories, firstRow.sub_kategori);

        const importedRows: TransactionItemRow[] = [];
        const unmatchedItems: string[] = [];

for (const row of dataRows) {
  const itemName = row.nama_item?.toString().trim();
  if (!itemName) continue;

  const matchedItem = items.find(
    (i) =>
      normalize(i.name).includes(normalize(itemName)) ||
      normalize(itemName).includes(normalize(i.name))
  );

  if (!matchedItem) {
    unmatchedItems.push(itemName);
    continue;
  }

  const qty = Number(row.Qty) || 1;
  const priceExcel = Number(row.price);
  const finalPrice = !isNaN(priceExcel)
    ? priceExcel
    : price[matchedItem.id] ?? matchedItem.price ?? 0;

  const serialFromExcel = row.serial_number?.toString().trim() || undefined;

  const rowWarehouse = findMatch(warehouses, row.Warehouse);

  const existingIndex = importedRows.findIndex(
    (r) =>
      r.item_id === matchedItem.id &&
      r.warehouse_id === (rowWarehouse?.id ?? "") &&
      r.serial_number === serialFromExcel
  );

  if (existingIndex !== -1) {
    // Benar-benar duplikat → gabung qty
    importedRows[existingIndex].qty += qty;
  } else {
    // Beda warehouse atau beda serial → row baru
    importedRows.push({
      item_id: matchedItem.id,
      item_name: matchedItem.name,
      price: finalPrice,
      qty,
      condition: ItemConditions.GOOD,
      procurement_year: new Date().getFullYear(),
      serial_number: serialFromExcel,
      warehouse_id: rowWarehouse?.id ?? "",  
    });
  }
}
        // ── Validasi ───────────────────────────────────────────────────────
        if (unmatchedItems.length) {
          toast.warning(`Item tidak ditemukan: ${unmatchedItems.join(", ")}`);
        }

        if (!importedRows.length) {
          toast.error("Tidak ada item valid untuk diimport");
          return;
        }

        if (importedRows.some((r) => r.price < 0)) {
          toast.error("Price tidak boleh negatif");
          return;
        }

        const hasZero    = importedRows.some((r) => r.price === 0);
        const hasNonZero = importedRows.some((r) => r.price > 0);

        if (hasZero && hasNonZero) {
          toast.error("Tidak boleh mix donation & pembelian");
          return;
        }

        if (hasZero) {
          toast.info("Semua item dianggap DONATION");
        }

        // ── Final ──────────────────────────────────────────────────────────
        const parsedData: ParsedImportData = {
          poNumber:    "",
          warehouse:   matchedWarehouse?.id   ?? "",
          supplier:    matchedSupplier?.id    ?? "",
          subKategori: matchedSubcategory?.id ?? "",
          rows:        importedRows,
        };

        if (!matchedWarehouse)
          toast.warning(`Warehouse "${firstRow.Warehouse}" tidak ditemukan`);
        if (!matchedSupplier)
          toast.warning(`Supplier "${firstRow.supplier}" tidak ditemukan`);
        if (!matchedSubcategory)
          toast.warning(`Sub-kategori "${firstRow.sub_kategori}" tidak ditemukan`);

        onImport(parsedData);
        toast.success(`Import ${importedRows.length} item berhasil`);
      } catch (err) {
        console.error(err);
        toast.error("Format Excel tidak valid");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="h-11 bg-green-800 text-white hover:bg-green-900 max-w-xs"
      >
        Import Template Excel
      </Button>
    </>
  );
}