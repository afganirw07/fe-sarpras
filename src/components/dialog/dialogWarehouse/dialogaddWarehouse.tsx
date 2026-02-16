"use client";

import { Button } from "../../ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Label from "../../form/Label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createRoom, TypeRoom } from "@/lib/warehouse";
import { toast } from "sonner";
import { z } from "zod";
import { WareHouseSchema } from "@/schema/warehouse.schema";

interface WarehouseError {
  code?: string;
  type?: string;
  name?: string;
}

export default function DialogAddWarehouse({ 
  onSuccess 
}: {
  onSuccess?: () => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<TypeRoom | "">("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<WarehouseError>({});

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      setCode("");
      setName("");
      setType("");
      setErrors({});
    }
  };

  const handleInputChange = (field: 'code' | 'name' | 'type', value: string) => {
    if (field === 'code') setCode(value);
    else if (field === 'name') setName(value);
    else if (field === 'type') setType(value as TypeRoom);
    
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    const validationData = {
      code: code.trim(),
      type: type,
      name: name.trim(),
    };

    console.log("Validation data:", validationData);

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
        
        const firstError = Object.values(formattedErrors)[0];
        if (firstError) {
        }
        
        return;
      }
    }

    setLoading(true);

    try {
      await createRoom({
        code: code.trim(),
        name: name.trim(),
        type: type as TypeRoom,
      });
      
      toast.success("Warehouse berhasil ditambahkan");
      
      // Reset form
      setCode("");
      setName("");
      setType("");
      setErrors({});
      
      // Close dialog
      setIsOpen(false);
      
      // Trigger parent refresh
      await onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Gagal menambahkan warehouse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row lg:items-center">
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button className="font-quicksand text-md bg-blue-800 text-white hover:bg-blue-900">
            + Add Warehouse
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl p-8 dark:bg-black">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Add Warehouse</DialogTitle>
              <DialogDescription>
                Tambahkan data warehouse baru
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Kode Warehouse */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">Kode Warehouse *</Label>
                  {errors.code && (
                    <p className="text-xs text-red-500">{errors.code}</p>
                  )}
                </div>
                <div className={`${errors.code ? 'border-red-500' : ''}`}>
                  <Input
                    value={code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Kode (HURUF BESAR, tanpa simbol)"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Warehouse Type */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">Warehouse Type *</Label>
                  {errors.type && (
                    <p className="text-xs text-red-500">{errors.type}</p>
                  )}
                </div>
                <Select
                  value={type}
                  onValueChange={(val) => handleInputChange('type', val)}
                  disabled={loading}
                >
                  <SelectTrigger className={`h-11 ${errors.type ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent className="max-w-md w-full">
                    {Object.values(TypeRoom).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nama Warehouse */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">Nama Warehouse *</Label>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className={`${errors.name ? 'border-red-500' : ''}`}>
                  <Input
                    value={name}
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
                  className="px-6"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-800 text-white hover:bg-blue-900 px-6"
              >
                {loading ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}