"use client";

import React, { useState } from "react";
import { Pencil, Trash2, SquareArrowOutUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import Label from "@/components/form/Label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { toast } from "sonner";

import {
  Supplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/supplier";

interface Props {
  supplier: Supplier;
  onSuccess?: () => void;
}

export default function ActionButtonsSupplier({
  supplier,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: supplier.name,
    email: supplier.email,
    phone_number: supplier.phone_number,
    address: supplier.address,
  });

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateSupplier(supplier.id, form);
      toast.success("Supplier berhasil diupdate");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal update supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteSupplier(supplier.id);
      toast.success("Supplier berhasil dihapus");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal hapus supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      {/* EDIT */}
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button type="button">
                <Pencil size={16} />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <DialogContent className="max-w-xl p-6">
          <DialogHeader>
            <DialogTitle>Update Supplier</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nama</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Email / Phone</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
            
            <div className="grid gap-2">
                  <Label>Phone</Label>
              <Input
                value={form.phone_number}
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Textarea
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-blue-800 hover:bg-blue-900"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button type="button">
                <Trash2 size={16} />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin hapus supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/dashboard/supplier/show/${supplier.id}`}>
            <SquareArrowOutUpRight size={16} />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}
