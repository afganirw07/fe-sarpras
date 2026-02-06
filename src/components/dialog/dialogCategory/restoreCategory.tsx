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
import { restoreDeletedCategory } from "@/lib/category";

export default function RestoreActionCategory({
  categoryId,
  onSuccess,
}: {
  categoryId: string;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [restoreId, setRestoreId] = useState<string | null>(null);

  async function handleRestore(e: React.MouseEvent) {
    e.preventDefault();

    if (!restoreId) {
      toast.error("Category ID tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      await restoreDeletedCategory(restoreId);

      toast.success("Kategori berhasil dipulihkan");
      setRestoreId(null);

      onSuccess?.();
    } catch (err: any) {
      console.error("Restore category error:", err);
      toast.error(err.message || "Gagal memulihkan kategori");
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
                onClick={() => setRestoreId(categoryId)}
                className="text-green-600 transition-colors hover:text-green-700"
              >
                <RefreshCcw size={16} />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="font-quicksand">
            Restore Kategori
          </TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-figtree">
              Pulihkan Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-quicksand">
              Kategori ini akan dipulihkan dan dapat digunakan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-quicksand"
              onClick={() => setRestoreId(null)}
            >
              Batal
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleRestore}
              disabled={loading}
              className="bg-green-600 font-quicksand text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Memulihkan..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
