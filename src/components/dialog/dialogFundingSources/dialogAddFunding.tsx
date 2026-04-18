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
import Label from "../../form/Label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createFundingSource } from "@/lib/funding-sources";
import { toast } from "sonner";
import { email, z } from "zod";
import { FundingSourceSchema } from "@/schema/funding-sources.schema";
import { useSession } from "next-auth/react";

// Update FormData & initialForm
interface FormData {
  name: string;
  description: string;
  email: string;
  phone_number: string;
}

const initialForm: FormData = {
  name: "",
  description: "",
  email: "",
  phone_number: "",
};

// Update interface error
interface FundingSourceError {
  name?: string;
  description?: string;
  email?: string;
  phone_number?: string;
}

export default function DialogAddFundingSource({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<FundingSourceError>({});

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
      FundingSourceSchema.parse({
        name: form.name.trim(),
        description: form.description.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FundingSourceError = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof FundingSourceError;
          formattedErrors[field] = err.message;
        });
        setErrors(formattedErrors);
        return;
      }
    }

    setLoading(true);
    try {
      await createFundingSource({
        description: form.description.trim(),
        name: form.name.trim(),
        created_by: userId,
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
      });

      toast.success("Funding source berhasil ditambahkan");
      setForm(initialForm);
      setErrors({});
      setIsOpen(false);
      await onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Gagal menambahkan funding source");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row lg:items-center">
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button className="font-quicksand text-md bg-blue-800 text-white hover:bg-blue-900">
            + Add Sumber Dana
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl p-8 dark:bg-black">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Add Funding Source</DialogTitle>
              <DialogDescription>Tambahkan data funding source baru</DialogDescription>
            </DialogHeader>

            {/* Nama Funding Source */}
<div className="flex flex-col gap-2">
  <div className="flex gap-2 items-center">
    <Label className="text-sm font-medium">Nama Funding Source *</Label>
    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
  </div>
  <Input
    value={form.name}
    onChange={(e) => handleInputChange("name", e.target.value)}
    placeholder="Nama funding source"
    disabled={loading}
    className={errors.name ? "border-red-500" : ""}
  />
</div>

{/* Deskripsi */}
<div className="flex flex-col gap-2">
  <div className="flex gap-2 items-center">
    <Label className="text-sm font-medium">Deskripsi</Label>
    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
  </div>
  <Input
    value={form.description}
    onChange={(e) => handleInputChange("description", e.target.value)}
    placeholder="Deskripsi (opsional)"
    disabled={loading}
    className={errors.description ? "border-red-500" : ""}
  />
</div>
{/* // Tambah setelah field Deskripsi */}
{/* Email */}
<div className="flex flex-col gap-2">
  <div className="flex gap-2 items-center">
    <Label className="text-sm font-medium">Email</Label>
    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
  </div>
  <Input
    type="email"
    value={form.email}
    onChange={(e) => handleInputChange("email", e.target.value)}
    placeholder="Email funding source (opsional)"
    disabled={loading}
    className={errors.email ? "border-red-500" : ""}
  />
</div>

{/* Nomor Telepon */}
<div className="flex flex-col gap-2">
  <div className="flex gap-2 items-center">
    <Label className="text-sm font-medium">Nomor Telepon</Label>
    {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
  </div>
  <Input
    type="tel"
    value={form.phone_number}
    onChange={(e) => handleInputChange("phone_number", e.target.value)}
    placeholder="Nomor telepon (opsional)"
    disabled={loading}
    className={errors.phone_number ? "border-red-500" : ""}
  />
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