"use client";

import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

interface Warehouse {
  id: string;
  name: string;
  type: string;
}

export default function ButtonQrWarehouse({
  warehouses,
}: {
  warehouses: Warehouse[];
}) {
  const downloadPdfQr = (warehouses: Warehouse[]) => {
    const pdf = new jsPDF("p", "mm", "a4");

    const boxWidth = 90;
    const boxHeight = 100;
    const qrSize = 60;

    const startX = 15;
    const startY = 15;
    const gapX = 10;
    const gapY = 10;

    warehouses.forEach((w, i) => {
      const pageIndex = Math.floor(i / 4);
      const position = i % 4;

      if (i !== 0 && position === 0) {
        pdf.addPage();
      }

      const col = position % 2;
      const row = Math.floor(position / 2);

      const x = startX + col * (boxWidth + gapX);
      const y = startY + row * (boxHeight + gapY);

      pdf.setLineDashPattern([3, 3], 0);
      pdf.rect(x, y, boxWidth, boxHeight);

      pdf.setLineDashPattern([], 0);
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text(w.name.toUpperCase(), x + boxWidth / 2, y + 12, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.text(w.type.toUpperCase(), x + boxWidth / 2, y + 22, {
        align: "center",
      });

      const canvas = document.getElementById(
        `qr-${w.id}`
      ) as HTMLCanvasElement | null;

      if (!canvas) return;

      const img = canvas.toDataURL("image/png");

      pdf.addImage(
        img,
        "PNG",
        x + (boxWidth - qrSize) / 2,
        y + 30,
        qrSize,
        qrSize
      );
    });

    pdf.save("QR-Warehouse-All.pdf");
  };

  return (
    <Button
      className="bg-blue-700 text-white"
      onClick={() => downloadPdfQr(warehouses)}
    >
      Generate QR All (PDF)
    </Button>
  );
}
