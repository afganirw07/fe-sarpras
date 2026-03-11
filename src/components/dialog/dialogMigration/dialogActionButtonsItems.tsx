"use client";

import { Button } from "../../ui/button";
import { Pencil, Trash2, SquareArrowOutUpRight } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ItemMigration } from "@/lib/migration";

export default function ActionButtonsMigration({
  mutasi,
}: {
  mutasi: ItemMigration;
}) {

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">
            <Link href={`/dashboard/mutasi/detail/${mutasi.id}`}>
              <SquareArrowOutUpRight size={14} />
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}