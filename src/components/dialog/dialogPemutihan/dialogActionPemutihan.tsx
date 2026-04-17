"use client";

import { useState } from "react";
import { SquareArrowOutUpRight, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Purging } from "@/lib/purging";
import Link from "next/link";
import DialogEditPemutihan from "./dialogEditPemutihan";

export default function ActionButtonsPemutihan({
  detailItem,
  checked,
  onCheckedChange,
  showCheckbox = true,
  onSuccess,
}: {
  detailItem: Purging;
  checked?: boolean;
  onCheckedChange?: (id: string, checked: boolean) => void;
  showCheckbox?: boolean;
  onSuccess?: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">

      {showCheckbox && (
        <input
          type="checkbox"
          checked={checked ?? false}
          onChange={(e) => onCheckedChange?.(detailItem.id, e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-primary"
        />
      )}

      {/* EDIT */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
          >
            <Pencil size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

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

      {/* Dialog Edit */}
      <DialogEditPemutihan
        purging={detailItem}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onSuccess}
      />
    </div>
  );
}