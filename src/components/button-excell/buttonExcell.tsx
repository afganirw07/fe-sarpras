"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Item {
  id: string;
  nama: string;
  po_number: string;
  kondisi: string;
  status: string;
  sn_number: string;
}

interface ExportExcelButtonProps {
  data: Item[];
  warehouseName?: string;
}

export default function ExportExcelButton({
  data,
  warehouseName,
}: ExportExcelButtonProps) {
  const handleGenerateExcel = () => {
    if (data.length === 0) {
      toast.error("Tidak ada data untuk di export");
      return;
    }

    const excelData = data.map((item, index) => ({
      No: index + 1,
      "Nama Item": item.nama,
      "PO Number": item.po_number,
      Kondisi: item.kondisi,
      Status: item.status,
      "SN Number": item.sn_number,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Item");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `Data_Warehouse_${warehouseName ?? "Export"}.xlsx`);

    toast.success("Excel berhasil di download");
  };

  return (
    <Button
      onClick={handleGenerateExcel}
      className="bg-linear-to-r gap-2 rounded-lg from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40"
    >
      <Download className="h-4 w-4" />
      Generate Excel
    </Button>
  );
}