"use client";

import { Button } from "../../../ui/button";
import { useState } from "react";
import {
  updateTransaction,
  Transaction,
  TransactionStatus,
} from "@/lib/transaction";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquareCheckBig } from "lucide-react";

interface ActionButtonProps {
  transaction: Transaction;
  onSuccess: () => void
}

export default function ActionButtonIn({ transaction, onSuccess }: ActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TransactionStatus>(
    transaction.status,
  );

  const handleUpdateStatus = async () => {
    if (currentStatus !== TransactionStatus.DRAFT) return;

    setLoading(true);
    try {
      const updated = await updateTransaction(transaction.id, {
        user_id: transaction.user_id,
        supplier_id: transaction.supplier_id,
        po_number: transaction.po_number,
        transaction_date: transaction.transaction_date,
        status: TransactionStatus.RECEIVED,
      });
      console.log(
        "===================================================",
        updated,
      );
      await onSuccess?.()
      setCurrentStatus(updated.status);
    } catch (error) {
      toast.success("Status transaksi berhasil diupdate ke RECEIVED");
      console.error("Update transaction status error:", error);
      toast.error("Gagal mengupdate status transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={handleUpdateStatus}
          disabled={loading || currentStatus === TransactionStatus.RECEIVED}
          className="rounded-lg border-gray-200 hover:border-sky-500 hover:bg-sky-50 hover:text-green-700 dark:border-white/10 dark:hover:border-green-500 dark:hover:bg-green-900/20 text-[clamp(1px,0.7rem,10px)]"
        >
          <SquareCheckBig size={14} className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Konfirmasi</TooltipContent>
    </Tooltip>
  );
}
