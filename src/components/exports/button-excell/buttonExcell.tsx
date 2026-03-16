"use client";

import * as XLSX from "xlsx-js-style";
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

    const headerStyle = {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" },
        sz: 12,
      },
      fill: {
        fgColor: { rgb: "059669" },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: {
        top:    { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left:   { style: "thin", color: { rgb: "CCCCCC" } },
        right:  { style: "thin", color: { rgb: "CCCCCC" } },
      },
      
    };

    const headers = Object.keys(exportData[0]);

    headers.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = headerStyle;
      }
    });

    const colWidths = headers.map((key) => ({
      wch: Math.max(
        key.length,
        ...exportData.map((row) =>
          row[key] ? row[key].toString().length : 10
        )
      ) + 6,
    }));
    worksheet["!cols"] = colWidths;

    worksheet["!rows"] = [{ hpt: 30 }]; 

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