"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../ui/button";
import { Pencil, Trash2, SquareArrowOutUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "../../ui/label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { toast } from "sonner";
import { deleteItem, updateItem, Item } from "@/lib/items";
import { getCategories, Category, Subcategory } from "@/lib/category";
import Link from "next/link";

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

interface ItemFormData {
  code: string;
  name: string;
  category_id: string;
  subcategory_id: string;
  brand: string;
  unit: string;
  // description: string;
  stock: number;
  type: string;
}

export default function ActionButtonsItems({
  item,
  onSuccess,
}: {
  item: Item;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [selectedCategorySubcategories, setSelectedCategorySubcategories] = useState<Subcategory[]>([]);
  
  const [formData, setFormData] = useState<ItemFormData>({
    code: item.code || "",
    name: item.name || "",
    category_id: item.category_id || "",
    subcategory_id: item.subcategory_id || "",
    brand: item.brand || "",
    unit: item.unit || "",
    // description: item.description || "",
    stock: item.stock || 0,
    type: item.type || "Loanable",
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories(1, 100);
      const categoriesData = response.data as CategoryWithSubcategories[];
      setCategories(categoriesData);

      if (formData.category_id) {
        const selectedCategory = categoriesData.find(
          (cat) => cat.id === formData.category_id
        );
        if (selectedCategory && selectedCategory.subcategories) {
          setSelectedCategorySubcategories(selectedCategory.subcategories);
        }
      }
    } catch (error) {
      toast.error("Gagal mengambil data kategori");
      console.error(error);
    }
  }, [formData.category_id]);

  useEffect(() => {
    if (isEditOpen) {
      fetchCategories();
    }
  }, [isEditOpen, fetchCategories]);

  // Handle dialog open/close
  const handleDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    
    if (open) {
      // Reset form dengan data item saat dialog dibuka
      setFormData({
        code: item.code || "",
        name: item.name || "",
        category_id: item.category_id || "",
        subcategory_id: item.subcategory_id || "",
        brand: item.brand || "",
        unit: item.unit || "",
        // description: item.description || "",
        stock: item.stock || 0,
        type: item.type || "Loanable",
      });
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof ItemFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
      subcategory_id: "", 
    }));

    const selectedCategory = categories.find((cat) => cat.id === value);
    if (selectedCategory && selectedCategory.subcategories) {
      setSelectedCategorySubcategories(selectedCategory.subcategories);
    } else {
      setSelectedCategorySubcategories([]);
    }
  };

  // Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validasi
      if (!formData.code || !formData.name || !formData.category_id) {
        toast.error("Mohon lengkapi data wajib: Kode, Nama, dan Kategori");
        return;
      }

      if (!formData.unit) {
        toast.error("Satuan wajib diisi");
        return;
      }

      const updateData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        brand: formData.brand?.trim() || null,
        unit: formData.unit.trim(),
        // description: formData.description?.trim() || null,
        stock: formData.stock,
        type: formData.type,
      };

      await updateItem(item.id, updateData as Item);
      toast.success("Item berhasil diperbarui");
      
      setIsEditOpen(false);
      await onSuccess?.();
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Gagal update item");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Deleting item ID:", item.id);
      await deleteItem(item.id);
      toast.success("Item berhasil dihapus");
      await onSuccess?.();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Gagal hapus item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* EDIT */}
      <Dialog open={isEditOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <button type="button">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Pencil size={14} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl p-6 dark:bg-black">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Update informasi item yang dipilih
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
              {/* Kode Item */}
              <div className="grid gap-2">
                <Label>Kode Item *</Label>
                <Input
                  placeholder="Kode Item"
                  defaultValue={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                />
              </div>

              {/* Nama Item */}
              <div className="grid gap-2">
                <Label>Nama Item *</Label>
                <Input
                  placeholder="Nama Item"
                  defaultValue={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              {/* Kategori */}
              <div className="grid gap-2">
                <Label>Kategori *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={handleCategoryChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        Kategori tidak ditemukan
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Merek */}
              <div className="grid gap-2">
                <Label>Merek</Label>
                <Input
                  placeholder="Merek Item"
                  defaultValue={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </div>

              {/* Sub Kategori */}
              <div className="grid gap-2">
                <Label>Sub Kategori</Label>
                <Select
                  value={formData.subcategory_id}
                  onValueChange={(value) =>
                    handleInputChange("subcategory_id", value)
                  }
                  disabled={
                    !formData.category_id ||
                    selectedCategorySubcategories.length === 0
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.category_id
                          ? "Pilih kategori terlebih dahulu"
                          : selectedCategorySubcategories.length === 0
                          ? "Tidak ada sub kategori"
                          : "Pilih Sub Kategori"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategorySubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deskripsi - Row Span 3 */}
              {/* <div className="row-span-3 grid gap-2">
                <Label>Deskripsi</Label>
                <TextArea
                  value={formData.description}
                  className="h-full min-h-45"
                  placeholder="Masukkan deskripsi item..."
                  onChange={(value) => handleInputChange("description", value)}
                />
              </div> */}

              {/* Satuan */}
              <div className="grid gap-2">
                <Label>Satuan *</Label>
                <Input
                  placeholder="Satuan (pcs, kg, unit, dll)"
                  defaultValue={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                />
              </div>

              {/* Stok */}
              <div className="grid gap-2">
                <Label>Stok</Label>
                <Input
                  type="number"
                  placeholder="0"
                  defaultValue={formData.stock}
                  onChange={(e) => handleInputChange("stock", Number(e.target.value))}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="border border-gray-100 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button type="button">
                <Trash2 size={14} color="red" />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin hapus item?</AlertDialogTitle>
            <AlertDialogDescription>
              Item <strong>{item.name}</strong> akan dihapus secara permanen.
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

            <AlertDialogAction asChild>
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Menghapus..." : "Delete"}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SHOW */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">
            <Link href={`/dashboard/items/show/${item.id}`}>
              <SquareArrowOutUpRight size={14} />
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}