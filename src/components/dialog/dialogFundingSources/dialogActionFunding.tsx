"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { z } from "zod";
import {
  FundingSource,
  FundingSourcePayload,
  deleteFundingSource,
  getFundingSourceById,
  updateFundingSource,
} from "@/lib/funding-sources";
import { FundingSourceSchema } from "@/schema/funding-sources.schema";

// ─── Types ────────────────────────────────────────────────────────────────────

type EditPayload = Omit<FundingSourcePayload, "created_by">;

type FormErrors = Partial<Record<keyof EditPayload, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_PAYLOAD: EditPayload = {
  name: "",
  description: "",
  email: "",
  phone_number: "",
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

function IconButton({
  onClick,
  tooltip,
  children,
}: {
  onClick?: () => void;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={onClick}>
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  fundingSource: FundingSource;
  onSuccess?: () => void;
}

export default function ActionButtonsFundingSource({ fundingSource, onSuccess }: Props) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [payload, setPayload] = useState<EditPayload>(INITIAL_PAYLOAD);
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Fetch on edit open ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!isEditOpen) return;

    const fetchData = async () => {
      try {
        const data = await getFundingSourceById(fundingSource.id);
        setPayload({
          name: data.name ?? "",
          description: data.description ?? "",
          email: data.email ?? "",
          phone_number: data.phone_number ?? "",
        });
      } catch {
        toast.error("Gagal ambil data funding source");
      }
    };

    fetchData();
  }, [isEditOpen, fundingSource.id]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (open) setErrors({});
  };

  const handleChange = (field: keyof EditPayload, value: string) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
     console.log("1. form submitted", { payload, userId });

    if (!userId) {
      toast.error("Session tidak ditemukan, silakan login ulang");
      return;
    }

      console.log("2. about to validate", {
  name: payload.name.trim(),
  description: payload.description?.trim() || undefined,
});

    // Validate
    const result = FundingSourceSchema.safeParse({
      name: payload.name.trim(),
      description: payload.description?.trim() || undefined,
        email: payload.email?.trim() || undefined,         // tambah ini
  phone_number: payload.phone_number?.trim() || undefined, // tambah ini
    });
    console.log("3. validation result", result);

    if (!result.success) {
      const formattedErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        formattedErrors[field] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setLoading(true);
    try {
      await updateFundingSource(fundingSource.id, {
        name: payload.name.trim(),
        description: payload.description?.trim() || undefined,
        email: payload.email?.trim(),
        phone_number: payload.phone_number?.trim(),
        created_by: userId,
      });

      toast.success("Funding source berhasil diperbarui");
      setIsEditOpen(false);
      setErrors({});
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal update funding source");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteFundingSource(fundingSource.id);
      toast.success("Funding source berhasil dihapus");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal hapus funding source");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex justify-center gap-4">
      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <IconButton tooltip="Edit">
            <Pencil size={15} />
          </IconButton>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl p-8 dark:bg-black">
          <form onSubmit={handleUpdate}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Edit Funding Source</DialogTitle>
              <DialogDescription>Perbarui data funding source</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <FormField label="Nama Funding Source" required error={errors.name}>
                <Input
                  value={payload.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nama funding source (tanpa simbol)"
                  disabled={loading}
                  className={errors.name ? "border-red-500" : ""}
                />
              </FormField>

              <FormField label="Deskripsi" error={errors.description}>
                <Textarea
                  value={payload.description ?? ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Deskripsi (opsional)"
                  disabled={loading}
                  className={errors.description ? "border-red-500" : ""}
                  rows={3}
                />
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  value={payload.email ?? ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email (opsional)"
                  disabled={loading}
                />
              </FormField>

              <FormField label="Nomor Telepon">
                <Input
                  type="tel"
                  value={payload.phone_number ?? ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="Nomor telepon (opsional)"
                  disabled={loading}
                />
              </FormField>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
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

      {/* Delete Dialog */}
      <AlertDialog>
        <IconButton tooltip="Delete">
          <AlertDialogTrigger asChild>
            <span>
              <Trash2 size={15} />
            </span>
          </AlertDialogTrigger>
        </IconButton>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin hapus funding source?</AlertDialogTitle>
            <AlertDialogDescription>
              Funding source <strong>{fundingSource.name}</strong> akan dihapus. Data tidak bisa
              dikembalikan.
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
    </div>
  );
}