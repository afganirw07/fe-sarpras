"use client";

import React, { useState } from "react";
import { Trash2, SquareArrowOutUpRight } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { hardDeleteDetailItem, DetailItem } from "@/lib/items";
import Link from "next/link";


export default function ActionButtonsPemutihan({
  detailItem,
  onSuccess,
}: {
  detailItem: DetailItem;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  
  // Handle Delete
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Deleting item ID:", detailItem.id);
      await hardDeleteDetailItem(detailItem.id);
      toast.success("Item berhasil dihapus");
      await onSuccess?.();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Gagal hapus item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* DELETE */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button type="button">
                <Trash2 size={14} color="red" />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin hapus item?</AlertDialogTitle>
            <AlertDialogDescription>
              Item <strong>{detailItem.serial_number}</strong> akan dihapus secara permanen.
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

            <AlertDialogAction asChild>
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Menghapus..." : "Delete"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SHOW */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">
            <Link href={`/dashboard/pemutihan/show/${detailItem.id}`}>
              <SquareArrowOutUpRight size={14} />
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}