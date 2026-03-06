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
import { useSession } from "next-auth/react";

interface WarehouseError {
  code?: string;
  type?: string;
  name?: string;
}

interface FormData {
  code: string;
  name: string;
  type: TypeRoom | "";
}

const initialForm: FormData = {
  code: "",
  name: "",
  type: "",
};

export default function DialogAddWarehouse({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<WarehouseError>({});

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setForm(initialForm);
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const userId = session?.user?.id;
    if (!userId) {
      toast.error("Session tidak ditemukan, silakan login ulang");
      return;
    }

    try {
      WareHouseSchema.parse({
        code: form.code.trim(),
        type: form.type,
        name: form.name.trim(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: WarehouseError = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof WarehouseError;
          formattedErrors[field] = err.message;
        });
        setErrors(formattedErrors);
        return;
      }
    }

    setLoading(true);
    try {
      await createRoom({
        code: form.code.trim(),
        name: form.name.trim(),
        type: form.type as TypeRoom,
        created_by: userId
      });

      toast.success("Warehouse berhasil ditambahkan");
      setForm(initialForm);
      setErrors({});
      setIsOpen(false);
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
              <DialogDescription>Tambahkan data warehouse baru</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Kode Warehouse */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">Kode Warehouse *</Label>
                  {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                </div>
                <Input
                  value={form.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="Kode (HURUF BESAR, tanpa simbol)"
                  disabled={loading}
                  className={errors.code ? "border-red-500" : ""}
                />
              </div>

              {/* Warehouse Type */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">Warehouse Type *</Label>
                  {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                </div>
                <Select
                  value={form.type}
                  onValueChange={(val) => handleInputChange("type", val)}
                  disabled={loading}
                >
                  <SelectTrigger className={`h-11 ${errors.type ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
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
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <Input
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nama warehouse (tanpa simbol)"
                  disabled={loading}
                  className={errors.name ? "border-red-500" : ""}
                />
              </div>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="px-6" disabled={loading}>
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