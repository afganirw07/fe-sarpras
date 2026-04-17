"use client";

import { Button } from "../../ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ItemMigration } from "@/lib/migration";
import DialogEditMigration from "./dialogeditMigration";

export default function ActionButtonsMigration({
  mutasi,
  showCheckbox,
  checked,
  onCheckedChange,
  onSuccess, 
}: {
  mutasi: ItemMigration;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheckedChange?: (id: string, checked: boolean) => void;
  onSuccess?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Checkbox — hanya tampil jika showCheckbox true */}
      {showCheckbox && (
        <input
          type="checkbox"
          checked={checked ?? false}
          onChange={(e) => onCheckedChange?.(mutasi.id, e.target.checked)}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 accent-blue-600 focus:ring-blue-500"
        />
      )}
  <DialogEditMigration migrationId={mutasi.id} onSuccess={onSuccess} />
      {/* Tombol Detail */}
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