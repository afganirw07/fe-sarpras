"use client";

import { SquareArrowOutUpRight } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { purgingDetail } from "@/lib/purging";
import Link from "next/link";

export default function ActionButtonsPemutihan({
  detailItem,
  checked,
  onCheckedChange,
}: {
  detailItem: purgingDetail;
  checked?: boolean;
  onCheckedChange?: (id: string, checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {/* CHECKBOX */}
      <input
        type="checkbox"
        checked={checked ?? false}
        onChange={(e) => onCheckedChange?.(detailItem.id, e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-primary"
      />

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