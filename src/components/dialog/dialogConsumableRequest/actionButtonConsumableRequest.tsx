"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquareCheckBig } from "lucide-react";
import { updateConsumableRequest, ConsumableRequest } from "@/lib/consumable-request";

interface ActionButtonConsumableProps {
  request: ConsumableRequest;
  onSuccess: () => void;
}

export default function ActionButtonConsumable({
  request,
  onSuccess,
}: ActionButtonConsumableProps) {
  const [loading, setLoading] = useState(false);

 
  const isPending = request.request_status === "Pending";

  const handleApprove = async () => {
    if (!isPending) return;

    setLoading(true);
    try {
      // Update request_status dari "pending" → "approved"
      await updateConsumableRequest(request.id, {
        request_status: "Disetujui",
      });
      toast.success("Permintaan berhasil di setujui");
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Gagal mengupdate status");
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
            disabled={loading || !isPending}
            title={!isPending ? "Request sudah diproses" : "Approve request"}
            className="rounded-lg border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20 text-[clamp(1px,0.7rem,10px)] disabled:opacity-30"
          >
            <SquareCheckBig size={14} className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isPending ? "Approve" : "Sudah diproses"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}