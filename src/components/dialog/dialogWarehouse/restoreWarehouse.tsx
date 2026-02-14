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
import { restoreDeletedRoom } from "@/lib/warehouse";

interface Props {
  roomId: string;
  onSuccess?: () => void;
}

export default function RestoreActionWarehouse({
  roomId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRestore(e: React.MouseEvent) {
    e.preventDefault();

    if (!roomId) {
      toast.error("Warehouse ID tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      await restoreDeletedRoom(roomId);

      toast.success("Warehouse berhasil dipulihkan");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal memulihkan warehouse");
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
            Restore Warehouse
          </TooltipContent>
        </Tooltip>

        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-figtree">
              Pulihkan Warehouse?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-quicksand">
              Warehouse ini akan dipulihkan dan dapat digunakan kembali.
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
