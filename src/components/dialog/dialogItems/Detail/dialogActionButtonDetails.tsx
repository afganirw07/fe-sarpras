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
import { deleteDetailItems, DetailItem } from "@/lib/items";
import Link from "next/link";

export default function ActionButtonsDetailItems({
  item,
  onSuccess,
}: {
  item: DetailItem;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await deleteDetailItems(item.id);
      toast.success("Detail item berhasil dihapus");
      await onSuccess?.();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Gagal hapus detail item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">

     
      {/* DELETE */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button
                type="button"
              >
                 <Trash2 size={16} color="red" />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-quicksand">
              Yakin hapus detail item?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-quicksand">
              Serial number{" "}
              <strong className="text-gray-800 dark:text-white">
                {item.serial_number}
              </strong>{" "}
              akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              className="font-quicksand"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="font-quicksand rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
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
          <Link
            href={`/dashboard/items/detail/${item.id}`}
          >
           <SquareArrowOutUpRight size={16} />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>


    </div>
  );
}