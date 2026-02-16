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
import { z } from "zod";
import { supplierSchema } from "@/schema/suplier.schema";
import {
  Supplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/supplier";

interface Props {
  supplier: Supplier;
  onSuccess?: () => void;
}

interface SupplierError {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export default function ActionButtonsSupplier({
  supplier,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: supplier.name,
    email: supplier.email,
    phone_number: supplier.phone_number,
    address: supplier.address,
  });
  const [errors, setErrors] = useState<SupplierError>({});

  // Handle dialog open/close
  const handleDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    
    if (open) {
      // Reset form dengan data supplier saat dialog dibuka
      setForm({
        name: supplier.name,
        email: supplier.email,
        phone_number: supplier.phone_number,
        address: supplier.address,
      });
      // Reset errors
      setErrors({});
    }
  };

  // Handle input change dengan clear error
  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    
    // Clear error untuk field yang sedang diubah
    const errorField = field === 'phone_number' ? 'phoneNumber' : field;
    setErrors(prev => ({ ...prev, [errorField]: undefined }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Prepare validation data
    const validationData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phoneNumber: form.phone_number.trim(),
      address: form.address.trim(),
    };

    console.log("Validation data:", validationData);

    // Validate with Zod
    try {
      supplierSchema.parse(validationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: SupplierError = {};
        
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof SupplierError;
          formattedErrors[field] = err.message;
        });
        
        console.log("Validation errors:", formattedErrors);
        setErrors(formattedErrors);
        
        // Show first error in toast
        const firstError = Object.values(formattedErrors)[0];
        if (firstError) {
          toast.error(firstError);
        }
        
        return;
      }
    }

    setLoading(true);

    try {
      await updateSupplier(supplier.id, form);
      toast.success("Supplier berhasil diupdate");
      setIsEditOpen(false);
      setErrors({});
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
      <Dialog open={isEditOpen} onOpenChange={handleDialogChange}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button type="button">
                <Pencil size={15} />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <DialogContent className="max-w-xl p-6 dark:bg-black">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Update Supplier</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 mt-4">
              {/* Nama */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Nama *</Label>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className={`${errors.name ? 'border-red-500' : ''}`}>
                  <Input
                    value={form.name}
                    placeholder="Nama Lengkap"
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Email *</Label>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className={`${errors.email ? 'border-red-500' : ''}`}>
                  <Input
                    value={form.email}
                    placeholder="Email"
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Phone */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Phone *</Label>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
                <div className={`${errors.phoneNumber ? 'border-red-500' : ''}`}>
                  <Input
                    value={form.phone_number}
                    placeholder="Nomor Telepon"
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Address *</Label>
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                  )}
                </div>
                <div className={`${errors.address ? 'border-red-500' : ''}`}>
                  <Textarea
                    value={form.address}
                    placeholder="Alamat Lengkap"
                    className="min-h-30"
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline"  disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={loading}
                className="bg-blue-800 hover:bg-blue-900"
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
                <Trash2 size={15} />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin hapus supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              Supplier <strong>{supplier.name}</strong> akan dihapus.
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? "Menghapus..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SHOW */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/dashboard/supplier/show/${supplier.id}`}>
            <SquareArrowOutUpRight size={15} />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}