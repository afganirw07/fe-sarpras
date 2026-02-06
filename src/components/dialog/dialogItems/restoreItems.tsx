"use client";

import React, { useState } from "react";
import { RefreshCcw } from "lucide-react";
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
import { restoreDeleteItems } from "@/lib/items";

export default function RestoreActionItems({
  itemId,
  onSuccess,
}: {
  itemId: string;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [restoreId, setRestoreId] = useState<string | null>(null);

  async function handleRestore(e: React.MouseEvent) {
    e.preventDefault();

    try {
      if (!restoreId) {
        toast.error("Item ID tidak ditemukan");
        return;
      }

      console.log("Restoring item ID:", restoreId);
      setLoading(true);
      await restoreDeleteItems(restoreId);
      toast.success("Item berhasil dipulihkan");
      setRestoreId(null);

      await onSuccess?.();
    } catch (err: any) {
      console.error("Restore error:", err);
      toast.error(err.message || "Gagal memulihkan item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                onClick={() => setRestoreId(itemId)}
                className="text-green-600 hover:text-green-700 transition-colors"
              >
                <RefreshCcw size={16} />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="font-quicksand">Restore</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-figtree">Pulihkan Item?</AlertDialogTitle>
            <AlertDialogDescription className="font-quicksand">
              Item ini akan dipulihkan dan dapat digunakan kembali dalam inventori.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="font-quicksand" onClick={() => setRestoreId(null)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-green-600 font-quicksand text-white hover:bg-green-700 disabled:opacity-50"
              onClick={handleRestore}
              disabled={loading}
            >
              {loading ? "Memulihkan..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}