"use client";
import * as XLSX from "xlsx-js-style";
import { Button } from "../ui/button";
import { useRef } from "react";
import { toast } from "sonner";
import { ItemConditions } from "@/lib/transaction";

interface TransactionItemRow {
  item_id: string;
  item_name: string;
  price: number;
  qty_request: number;
  qty_receive: number;
  condition: ItemConditions;
  procurement_year: number;
}

interface ImportedExcelRow {
  No?: number;
  Po_Number?: string | number;
  Warehouse?: string;
  supplier?: string;
  Kategori?: string;
  sub_kategori?: string;
  nama_item?: string;
  Qty?: number;
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
  onImport: (data: ParsedImportData) => void;
}

export default function ImportExcel({
  items,
  subcategories,
  warehouses,
  suppliers,
  onImport,
}: ImportExcelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizeStr = (str: string) =>
    str?.toString().trim().toLowerCase() ?? "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse with header row at row index 1 (0-based), skip title row
        const jsonData: ImportedExcelRow[] = XLSX.utils.sheet_to_json(
          worksheet,
          {
            header: [
              "No",
              "Po_Number",
              "Warehouse",
              "supplier",
              "Kategori",
              "sub_kategori",
              "nama_item",
              "Qty",
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

        if (dataRows.length === 0) {
          toast.error("Tidak ada data ditemukan di file Excel");
          return;
        }

        // Use data from first row for form-level fields
        const firstRow = dataRows[0];

        // Match warehouse by name (case-insensitive)
        const matchedWarehouse = warehouses.find((w) =>
          normalizeStr(w.name).includes(normalizeStr(firstRow.Warehouse ?? ""))
          || normalizeStr(firstRow.Warehouse ?? "").includes(normalizeStr(w.name))
        );

        // Match supplier by name (case-insensitive)
        const matchedSupplier = suppliers.find((s) =>
          normalizeStr(s.name).includes(normalizeStr(firstRow.supplier ?? ""))
          || normalizeStr(firstRow.supplier ?? "").includes(normalizeStr(s.name))
        );

        // Match subcategory by name (case-insensitive)  
        const matchedSubcategory = subcategories.find((s) =>
          normalizeStr(s.name).includes(normalizeStr(firstRow.sub_kategori ?? ""))
          || normalizeStr(firstRow.sub_kategori ?? "").includes(normalizeStr(s.name))
        );

        // Build item rows from all Excel rows
        const importedRows: TransactionItemRow[] = [];
        const unmatchedItems: string[] = [];

        for (const excelRow of dataRows) {
          const itemName = excelRow.nama_item?.toString().trim() ?? "";
          if (!itemName) continue;

          // Match item by name (case-insensitive)
          const matchedItem = items.find(
            (i) =>
              normalizeStr(i.name).includes(normalizeStr(itemName)) ||
              normalizeStr(itemName).includes(normalizeStr(i.name))
          );

          if (!matchedItem) {
            unmatchedItems.push(itemName);
            continue;
          }

          // Prevent duplicate items
          const alreadyAdded = importedRows.some(
            (r) => r.item_id === matchedItem.id
          );
          if (alreadyAdded) continue;

          const qty = Number(excelRow.Qty) || 1;

          importedRows.push({
            item_id: matchedItem.id,
            item_name: matchedItem.name,
            price: matchedItem.price ?? 0,
            qty_request: qty,
            qty_receive: qty,
            condition: ItemConditions.GOOD,
            procurement_year: new Date().getFullYear(),
          });
        }

        if (unmatchedItems.length > 0) {
          toast.warning(
            `Item tidak ditemukan di sistem: ${unmatchedItems.join(", ")}`
          );
        }

        if (importedRows.length === 0) {
          toast.error("Tidak ada item yang berhasil dicocokkan dengan data sistem");
          return;
        }

        const parsedData: ParsedImportData = {
          poNumber: firstRow.Po_Number?.toString() ?? "",
          warehouse: matchedWarehouse?.id ?? "",
          supplier: matchedSupplier?.id ?? "",
          subKategori: matchedSubcategory?.id ?? "",
          rows: importedRows,
        };

        if (!matchedWarehouse) toast.warning(`Warehouse "${firstRow.Warehouse}" tidak ditemukan`);
        if (!matchedSupplier) toast.warning(`Supplier "${firstRow.supplier}" tidak ditemukan`);
        if (!matchedSubcategory) toast.warning(`Sub-kategori "${firstRow.sub_kategori}" tidak ditemukan`);

        onImport(parsedData);
        toast.success(`Berhasil import ${importedRows.length} item dari Excel`);
      } catch (err) {
        console.error("Import Excel error:", err);
        toast.error("Gagal membaca file Excel. Pastikan format file sesuai template.");
      } finally {
        // Reset input so the same file can be re-imported if needed
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
        className="h-11 bg-green-800 text-white hover:bg-green-900"
      >
        Import Template Excel
      </Button>
    </>
  );
}