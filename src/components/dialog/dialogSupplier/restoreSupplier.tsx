"use client";

import { useState } from "react";
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
import { restoreDeletedSupplier } from "@/lib/supplier";

interface Props {
  supplierId: string;
  onSuccess?: () => void;
}

export default function RestoreActionSupplier({
  supplierId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRestore(e: React.MouseEvent) {
    e.preventDefault();

    if (!supplierId) {
      toast.error("Supplier ID tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      await restoreDeletedSupplier(supplierId);

      toast.success("Supplier berhasil dipulihkan");
      onSuccess?.();
    } catch (err: any) {
      console.error("Restore supplier error:", err);
      toast.error(err.message || "Gagal memulihkan supplier");
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
                className="text-green-600 transition-colors hover:text-green-700"
              >
                <RefreshCcw size={16} />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="font-quicksand">
            Restore Supplier
          </TooltipContent>
        </Tooltip>

        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-figtree">
              Pulihkan Supplier?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-quicksand">
              Supplier ini akan dipulihkan dan dapat digunakan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="font-quicksand">
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
