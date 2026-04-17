"use client";

import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { DetailItem } from "@/lib/items";

interface Props {
  items: DetailItem[];
  itemName?: string;
}

export default function ButtonQrSmallItem({ items, itemName }: Props) {
  const downloadPdfQr = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const boxWidth  = 90;
    const boxHeight = 100;
    const qrSize    = 30;
    const startX    = 15;
    const startY    = 15;
    const gapX      = 10;
    const gapY      = 10;

    items.forEach((item, i) => {
      const position = i % 4;

      if (i !== 0 && position === 0) {
        pdf.addPage();
      }

      const col = position % 2;
      const row = Math.floor(position / 2);

      const x = startX + col * (boxWidth + gapX);
      const y = startY + row * (boxHeight + gapY);

      // Border putus-putus
      pdf.setLineDashPattern([3, 3], 0);
      pdf.setDrawColor(180, 180, 180);
      pdf.rect(x, y, boxWidth, boxHeight);
      pdf.setLineDashPattern([], 0);

      // Nama item
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        (itemName ?? item.item?.name ?? "ITEM").toUpperCase(),
        x + boxWidth / 2,
        y + 10,
        { align: "center", maxWidth: boxWidth - 6 }
      );

      // Serial number
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.text(item.serial_number, x + boxWidth / 2, y + 18, {
        align: "center",
      });

      // Ambil canvas QR dari DOM
      const canvas = document.getElementById(
        `qr-item-${item.id}`
      ) as HTMLCanvasElement | null;

      if (!canvas) return;

      const img = canvas.toDataURL("image/png");
      pdf.addImage(img, "PNG", x + (boxWidth - qrSize) / 2, y + 22, qrSize, qrSize);

      // Info bawah QR
      const infoY = y + 22 + qrSize + 6;
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);

      pdf.text(`Warehouse : ${item.room?.name ?? "-"}`, x + 4, infoY);
      pdf.text(`Kondisi   : ${item.condition ?? "-"}`, x + 4, infoY + 5);
      pdf.text(`Status    : ${item.status ?? "-"}`, x + 4, infoY + 10);
    });

    const filename = `QR-${(itemName ?? "item").replace(/\s+/g, "-")}.pdf`;
    pdf.save(filename);
  };

  return (
    <>
      {/* Hidden QR canvas — sama persis kayak pattern warehouse */}
      <div className="hidden">
        {items.map((item) => (
          <QRCodeCanvas
            key={item.id}
            id={`qr-item-${item.id}`}
            value={item.serial_number}
            size={300}
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400"
        onClick={downloadPdfQr}
        disabled={!items || items.length === 0}
      >
        <QrCode className="mr-2 h-4 w-4" />
        Generate Small Labels
      </Button>
    </>
  );
}