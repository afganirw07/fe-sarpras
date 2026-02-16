"use client";

import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getRoomById,
  updateRoom,
  deleteRoom,
  RoomPayload,
  TypeRoom,
} from "@/lib/warehouse";
import Link from "next/link";
import { z } from "zod";
import { WareHouseSchema } from "@/schema/warehouse.schema";

interface WarehouseError {
  code?: string;
  type?: string;
  name?: string;
}

export default function ActionButtonsWarehouse({
  room,
  onSuccess,
}: {
  room: {
    id: string;
    code: string;
    name: string;
    type: string;
  };
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [payload, setPayload] = useState<RoomPayload>({
    code: "",
    name: "",
    type: TypeRoom.GUDANG,
  });
  const [errors, setErrors] = useState<WarehouseError>({});

  useEffect(() => {
    if (!isEditOpen || !room) return;

    const fetchRoom = async () => {
      try {
        const data = await getRoomById(room.id);
        setPayload({
          code: data.code ?? "",
          name: data.name ?? "",
          type: data.type as TypeRoom,
        });
      } catch {
        toast.error("Gagal ambil data warehouse");
      }
    };

    fetchRoom();
  }, [isEditOpen, room]);

  // Handle dialog open/close
  const handleDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    
    if (open) {
      // Reset errors saat dialog dibuka
      setErrors({});
    }
  };

  // Handle input change dengan clear error
  const handleInputChange = (field: keyof RoomPayload, value: string) => {
    setPayload({ ...payload, [field]: value });
    
    // Clear error untuk field yang sedang diubah
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Prepare validation data
    const validationData = {
      code: payload.code.trim(),
      type: payload.type,
      name: payload.name.trim(),
    };

    console.log("Validation data:", validationData);

    // Validate with Zod
    try {
      WareHouseSchema.parse(validationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: WarehouseError = {};
        
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof WarehouseError;
          formattedErrors[field] = err.message;
        });
        
        console.log("Validation errors:", formattedErrors);
        setErrors(formattedErrors);
        
        // Show first error in toast
        const firstError = Object.values(formattedErrors)[0];
        if (firstError) {
        }
        
        return;
      }
    }

    setLoading(true);

    try {
      await updateRoom(room.id, {
        code: payload.code.trim(),
        name: payload.name.trim(),
        type: payload.type,
      });
      
      toast.success("Warehouse berhasil diperbarui");
      setIsEditOpen(false);
      setErrors({});
      await onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal update warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteRoom(room.id);
      toast.success("Warehouse berhasil dihapus");
      await onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal hapus warehouse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      {/* EDIT */}
      <Dialog open={isEditOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <button>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Pencil size={15} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl p-8 dark:bg-black">
          <form onSubmit={handleUpdate}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Edit Warehouse</DialogTitle>
              <DialogDescription>Perbarui data warehouse</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Kode Warehouse */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Kode Warehouse *</Label>
                  {errors.code && (
                    <p className="text-xs text-red-500">{errors.code}</p>
                  )}
                </div>
                <div className={`${errors.code ? 'border-red-500' : ''}`}>
                  <Input
                    value={payload.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Kode (HURUF BESAR, tanpa simbol)"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Warehouse Type */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Warehouse Type *</Label>
                  {errors.type && (
                    <p className="text-xs text-red-500">{errors.type}</p>
                  )}
                </div>
                <Select
                  value={payload.type}
                  onValueChange={(val) => handleInputChange('type', val)}
                  disabled={loading}
                >
                  <SelectTrigger className={`h-11 ${errors.type ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih tipe warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TypeRoom).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nama Warehouse */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex gap-2 items-center">
                  <Label>Nama Warehouse *</Label>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className={`${errors.name ? 'border-red-500' : ''}`}>
                  <Input
                    value={payload.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nama warehouse (tanpa simbol)"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-800 text-white hover:bg-blue-900"
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
            <AlertDialogTitle>Yakin hapus warehouse?</AlertDialogTitle>
            <AlertDialogDescription>
              Warehouse <strong>{room.name}</strong> akan dihapus.
              Data tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
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
            <Link href={`/dashboard/warehouse/show/${room.id}`}>
              <SquareArrowOutUpRight size={15} />
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}