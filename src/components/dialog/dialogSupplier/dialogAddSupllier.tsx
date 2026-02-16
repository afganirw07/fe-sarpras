"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Textarea } from "@/components/ui/textarea";
import { createSupplier } from "@/lib/supplier";
import { toast } from "sonner";
import { supplierSchema } from "@/schema/suplier.schema";
import { z } from "zod";

interface Props {
  onSuccess?: () => void;
}

interface SupplierError {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export default function DialogAddSupplier({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [errors, setErrors] = useState<SupplierError>({});

  // Handle dialog open/close
  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      setForm({
        name: "",
        email: "",
        phone_number: "",
        address: "",
      });
      // Reset errors
      setErrors({});
    }
  };

  // Handle input change dengan clear error
  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    
    const errorField = field === 'phone_number' ? 'phoneNumber' : field;
    setErrors(prev => ({ ...prev, [errorField]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    const validationData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phoneNumber: form.phone_number.trim(),
      address: form.address.trim(),
    };

    console.log("Validation data:", validationData);

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

        const firstError = Object.values(formattedErrors)[0];
        if (firstError) {
          toast.error(firstError);
        }
        
        return;
      }
    }

    setLoading(true);

    try {
      await createSupplier(form);
      toast.success("Supplier berhasil ditambahkan");

      // Reset form
      setForm({
        name: "",
        email: "",
        phone_number: "",
        address: "",
      });
      setErrors({});

      // Close dialog
      setIsOpen(false);

      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="font-quicksand text-md bg-blue-800 text-white hover:bg-blue-900"
          >
            + Add Supplier
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl p-6 dark:bg-black">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Supplier</DialogTitle>
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
                <div className={`${errors.name ? "border-red-500" : ""}`}>
                  <Input
                    defaultValue={form.name}
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
                <div className={`${errors.email ? "border-red-500" : ""}`}>
                  <Input
                    defaultValue={form.email}
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
                <div className={`${errors.phoneNumber ? "border-red-500" : ""}`}>
                  <Input
                    defaultValue={form.phone_number}
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
                <div className={`${errors.address ? "border-red-500" : ""}`}>
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
                <Button variant="outline" type="button" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-800 hover:bg-blue-900"
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