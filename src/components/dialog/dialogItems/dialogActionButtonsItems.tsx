"use client";

import React, { useState } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { toast } from "sonner";
import { deleteItem, updateItem, Item } from "@/lib/items";
import Link from "next/link";

export default function ActionButtonsItems({
  item,
  onSuccess,
}: {
  item: Item;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Item>(item);

  // Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await updateItem(item.id, formData);
      toast.success("Item berhasil diperbarui");
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

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock"  || name === "unit" 
        ? Number(value) 
        : value,
    }));
  };

  return (
    <div className="flex justify-center gap-4">
      {/* EDIT */}
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Pencil size={16} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-4xl p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl">Edit Item</DialogTitle>
            <DialogDescription>
              Update informasi item yang dipilih
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-4">
              {/* Kode */}
              <div className="flex flex-col gap-2">
                <Label>Kode</Label>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>

              {/* Nama */}
              <div className="flex flex-col gap-2">
                <Label>Nama</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>

              {/* Merek */}
              <div className="flex flex-col gap-2">
                <Label>Merek</Label>
                <Input
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>

              {/* Kategori */}
              <div className="flex flex-col gap-2">
                <Label>Kategori</Label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>

              {/* Sub Kategori */}
              <div className="flex flex-col gap-2">
                <Label>Sub Kategori</Label>
                <Input
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>

              {/* Stok */}
              <div className="flex flex-col gap-2">
                <Label>Stok</Label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>

              {/* Harga
              <div className="flex flex-col gap-2">
                <Label>Harga</Label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div> */}

              {/* Unit */}
              <div className="flex flex-col gap-2">
                <Label>Unit</Label>
                <Input
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="bg-blue-800 px-6 text-white hover:bg-blue-900"
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
                <Trash2 size={16} color="red" />
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
              <SquareArrowOutUpRight size={16} />
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}