"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw } from "lucide-react";
import { getCategories, getSubcategories, Category, Subcategory } from "@/lib/category";

export type ConditionFilter = "Poor" | "Fair" | "Good" | "";
export type PeriodFilter = 3 | 6 | 12 | null;

export interface FilterState {
  condition: ConditionFilter;
  period: PeriodFilter;
  subCategoryId: string;
}

interface DialogFilterItemsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: FilterState;
  onApply: (filter: FilterState) => void;
}

const CONDITIONS: { value: ConditionFilter; label: string; color: string }[] = [
  { value: "Poor", label: "Poor (Rusak)", color: "border-red-300 bg-red-50 text-red-700 data-[active=true]:bg-red-600 data-[active=true]:text-white data-[active=true]:border-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:data-[active=true]:bg-red-600 dark:data-[active=true]:text-white" },
  { value: "Fair", label: "Fair (Cukup)", color: "border-amber-300 bg-amber-50 text-amber-700 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 dark:data-[active=true]:bg-amber-500 dark:data-[active=true]:text-white" },
  { value: "Good", label: "Good (Baik)", color: "border-green-300 bg-green-50 text-green-700 data-[active=true]:bg-green-600 data-[active=true]:text-white data-[active=true]:border-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:data-[active=true]:bg-green-600 dark:data-[active=true]:text-white" },
];

const PERIODS: { value: PeriodFilter; label: string }[] = [
  { value: 3,  label: "3 Bulan Terakhir" },
  { value: 6,  label: "6 Bulan Terakhir" },
  { value: 12, label: "12 Bulan Terakhir" },
];

export default function DialogFilterItems({
  open,
  onOpenChange,
  filter,
  onApply,
}: DialogFilterItemsProps) {
  const [local, setLocal] = React.useState<FilterState>(filter);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [subcategories, setSubcategories] = React.useState<Subcategory[]>([]);
  const [loadingCat, setLoadingCat] = React.useState(false);

  // Sync state lokal saat dialog dibuka
  React.useEffect(() => {
    if (open) setLocal(filter);
  }, [open, filter]);

  // Fetch kategori & subkategori saat dialog dibuka
  React.useEffect(() => {
    if (!open) return;
    setLoadingCat(true);
    Promise.all([
      getCategories(1, 1000),
      getSubcategories(1, 1000),
    ])
      .then(([catRes, subRes]) => {
        setCategories(catRes.data ?? []);
        setSubcategories(subRes.data ?? []);
      })
      .finally(() => setLoadingCat(false));
  }, [open]);

  const handleReset = () => setLocal({ condition: "", period: null, subCategoryId: "" });

  const handleApply = () => {
    onApply(local);
    onOpenChange(false);
  };

  const activeCount =
    (local.condition ? 1 : 0) +
    (local.period ? 1 : 0) +
    (local.subCategoryId ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md dark:bg-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
              <Filter size={15} className="text-white" />
            </div>
            Filter Item
            {activeCount > 0 && (
              <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {activeCount} aktif
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-6">

          {/* ── Sub Kategori ── */}
          <div className="grid gap-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Sub Kategori
            </Label>
            {/* ✅ FIX 1: value fallback ke "_all" agar Radix tidak kehilangan controlled state */}
            <Select
              value={local.subCategoryId || "_all"}
              onValueChange={(v) =>
                setLocal((prev) => ({ ...prev, subCategoryId: v === "_all" ? "" : v }))
              }
              disabled={loadingCat}
            >
              <SelectTrigger className="h-10 w-full">
                {/* ✅ FIX 2: hapus children, cukup placeholder */}
                <SelectValue placeholder={loadingCat ? "Memuat..." : "Semua Sub Kategori"} />
              </SelectTrigger>
              {/* ✅ FIX 3: ganti SelectGroup/SelectLabel → div biasa (sama seperti DialogTransactionIn) */}
              <SelectContent>
                <div className="max-h-60 overflow-y-auto">
                  <SelectItem value="_all">Semua Sub Kategori</SelectItem>
                  {categories.map((cat) => {
                    const subs = subcategories.filter(
                      (s) => String(s.category_id) === String(cat.id)
                    );
                    if (subs.length === 0) return null;
                    return (
                      <div key={cat.id}>
                        <div className="select-none bg-gray-50 dark:bg-black px-2 py-1.5 text-xs font-semibold text-gray-400">
                          {cat.name}
                        </div>
                        {subs.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* ── Kondisi ── */}
          <div className="grid gap-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Kondisi Item
            </Label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  data-active={local.condition === c.value}
                  onClick={() =>
                    setLocal((prev) => ({
                      ...prev,
                      condition: prev.condition === c.value ? "" : c.value,
                    }))
                  }
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${c.color}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Periode ── */}
          <div className="grid gap-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Periode Waktu{" "}
              <span className="normal-case font-normal text-gray-400">(berdasarkan updated_at)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <button
                  key={String(p.value)}
                  type="button"
                  data-active={local.period === p.value}
                  onClick={() =>
                    setLocal((prev) => ({
                      ...prev,
                      period: prev.period === p.value ? null : p.value,
                    }))
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 transition-all data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600 data-[active=true]:text-white dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:data-[active=true]:border-blue-600 dark:data-[active=true]:bg-blue-600 dark:data-[active=true]:text-white"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleReset}
            className="gap-1.5 text-gray-600 dark:text-gray-300"
          >
            <RotateCcw size={14} />
            Reset
          </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleApply}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Filter size={14} />
            Terapkan Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}