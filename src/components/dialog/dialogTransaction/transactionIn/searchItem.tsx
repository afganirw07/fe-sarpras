"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover" // sesuaikan path

export function ItemSelect({
  filteredItems,
  selectedItemId,
  setSelectedItemId,
  selectedSubcategoryId,
  errors,
}: {
  filteredItems: { id: string; name: string }[]
  selectedItemId: string
  setSelectedItemId: (id: string) => void
  selectedSubcategoryId: string
  errors: { items?: string }
}) {
  const [search, setSearch] = useState("")

  const displayed = filteredItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedName = filteredItems.find((i) => i.id === selectedItemId)?.name

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label>Items</Label>
        {errors.items && (
          <p className="text-xs text-red-500">{errors.items}</p>
        )}
      </div>

      <PopoverRoot>
        {/* Trigger */}
        <PopoverTrigger
          className={cn(
            "h-11 w-full max-w-xl justify-between",
            !selectedItemId && "text-muted-foreground",
            errors.items && "border-red-500",
            !selectedSubcategoryId && "opacity-50 pointer-events-none"
          )}
        >
          <span className="flex-1 text-left truncate">
            {selectedName
              ? selectedName
              : selectedSubcategoryId
              ? "Pilih Item"
              : "Pilih Kategori dulu"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        {/* Dropdown */}
        <PopoverContent className="w-full max-w-xl top-12 left-0 h-auto">
          {/* Search input */}
          <div className="border-b border-zinc-950/10 dark:border-zinc-50/10 px-3 py-2">
            <input
              autoFocus
              placeholder="Cari item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto py-1">
            {displayed.length === 0 ? (
              <div className="px-4 py-2 text-sm text-zinc-400">
                Tidak ada item
              </div>
            ) : (
              displayed.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id)
                    setSearch("")
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-600"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      selectedItemId === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  )
}