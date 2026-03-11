"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExportExcelProps {
  data: any[];
  fileName?: string;
  sheetName?: string;
  columns?: {
    key: string;
    label: string;
  }[];
}

export default function ExportExcel({
  data,
  fileName = "export",
  sheetName = "Sheet1",
  columns,
}: ExportExcelProps) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("Tidak ada data untuk di export");
      return;
    }

    let exportData: any[];

    // kalau ada custom column
    if (columns && columns.length > 0) {
      exportData = data.map((row, index) => {
        const obj: any = { No: index + 1 };

        columns.forEach((col) => {
          obj[col.label] = row[col.key];
        });

        return obj;
      });
    } else {
      exportData = data;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // auto column width
    const colWidths = Object.keys(exportData[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...exportData.map((row) =>
          row[key] ? row[key].toString().length : 10
        )
      ),
    }));

    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `${fileName}.xlsx`);

    toast.success("Excel berhasil di download");
  };

  return (
    <Button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
    >
      <Download className="h-4 w-4" />
      Export Excel
    </Button>
  );
}