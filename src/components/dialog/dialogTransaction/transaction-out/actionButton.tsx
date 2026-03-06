"use client";

import { Button } from "../../../ui/button";
import { useState } from "react";
import { updateLoanRequest, LoanStatus, LoanRequest } from "@/lib/loan-request";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquareCheckBig, Undo2 } from "lucide-react";




interface ActionButtonLoanProps {
  loanRequest: LoanRequest;
  onSuccess: () => void;
}

export default function ActionButtonLoan({ loanRequest, onSuccess }: ActionButtonLoanProps) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(loanRequest.status);

  const basePayload = {
    user_id: loanRequest.user_id,
    item_id: loanRequest.item_id,
    borrow_date: typeof loanRequest.borrow_date === "string"
      ? loanRequest.borrow_date
      : new Date(loanRequest.borrow_date).toISOString(),
    return_date: loanRequest.return_date
      ? typeof loanRequest.return_date === "string"
        ? loanRequest.return_date
        : new Date(loanRequest.return_date).toISOString()
      : undefined,
    description: loanRequest.description ?? undefined,
  };

  const handleApprove = async () => {
    if (currentStatus !== LoanStatus.PENDING) return;
    setLoading(true);
    try {
      const updated = await updateLoanRequest(loanRequest.id, {
        ...basePayload,
        status: LoanStatus.APPROVED,
      });
      setCurrentStatus(updated.status);
      toast.success("Status berhasil diupdate ke Approved");
      await onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupdate status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={handleApprove}
            disabled={loading || currentStatus !== LoanStatus.PENDING}
            className="rounded-lg border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 text-[clamp(1px,0.7rem,10px)] disabled:opacity-30"
          >
            <SquareCheckBig size={14} className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Approve</TooltipContent>
      </Tooltip>
    </div>
  );
}