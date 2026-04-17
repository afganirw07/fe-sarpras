"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FundingSource,
  getFundingSourceById,
  updateFundingSource,
  deleteFundingSource,
  FundingSourcePayload,
} from "@/lib/funding-sources";
import { z } from "zod";
import { FundingSourceSchema } from "@/schema/funding-sources.schema";
import { useSession } from "next-auth/react";

interface FundingSourceError {
  name?: string;
  description?: string;
}

export default function ActionButtonsFundingSource({
  fundingSource,
  onSuccess,
}: {
  fundingSource: FundingSource;
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [payload, setPayload] = useState<Omit<FundingSourcePayload, "created_by">>({
    name: "",
    description: "",
    email:"",
    phone_number:""
  });
  const [errors, setErrors] = useState<FundingSourceError>({});

  // ── Fetch data saat dialog edit dibuka ─────────────────
  useEffect(() => {
    if (!isEditOpen || !fundingSource) return;

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
  }, [isEditOpen, fundingSource]);

  // ── Dialog open/close ───────────────────────────────────
  const handleDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (open) setErrors({});
  };

  // ── Input change ────────────────────────────────────────
  const handleInputChange = (
    field: keyof Omit<FundingSourcePayload, "created_by">,
    value: string
  ) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Update ──────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      FundingSourceSchema.parse({
        name: payload.name.trim(),
        description: payload.description?.trim() || undefined,
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
      await updateFundingSource(fundingSource.id, {
        name: payload.name.trim(),
        description: payload.description?.trim() || undefined,
        email: payload.email.trim(),
        phone_number: payload.phone_number.trim(),
        created_by: userId,
      });

      toast.success("Funding source berhasil diperbarui");
      setIsEditOpen(false);
      setErrors({});
      await onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal update funding source");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteFundingSource(fundingSource.id);
      toast.success("Funding source berhasil dihapus");
      await onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal hapus funding source");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      {/* ── EDIT ─────────────────────────────────────────── */}
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
              <DialogTitle className="text-xl">Edit Funding Source</DialogTitle>
              <DialogDescription>Perbarui data funding source</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              {/* Nama */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Nama Funding Source *</Label>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <Input
                  value={payload.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nama funding source (tanpa simbol)"
                  disabled={loading}
                  className={errors.name ? "border-red-500" : ""}
                />
              </div>

              {/* Deskripsi */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Deskripsi</Label>
                  {errors.description && (
                    <p className="text-xs text-red-500">{errors.description}</p>
                  )}
                </div>
                <Textarea
                  value={payload.description ?? ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Deskripsi (opsional)"
                  disabled={loading}
                  className={errors.description ? "border-red-500" : ""}
                  rows={3}
                />
              </div>
            </div>

       
{/* Email */}
<div className="flex flex-col gap-2">
  <div className="flex gap-2 items-center">
    <Label>Email</Label>
  </div>
  <Input
    type="email"
    value={payload.email ?? ""}
    onChange={(e) => handleInputChange("email", e.target.value)}
    placeholder="Email (opsional)"
    disabled={loading}
  />
</div>

{/* Nomor Telepon */}
<div className="flex flex-col gap-2">
  <div className="flex gap-2 items-center">
    <Label>Nomor Telepon</Label>
  </div>
  <Input
    type="tel"
    value={payload.phone_number ?? ""}
    onChange={(e) => handleInputChange("phone_number", e.target.value)}
    placeholder="Nomor telepon (opsional)"
    disabled={loading}
  />
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

      {/* ── DELETE ───────────────────────────────────────── */}
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
            <AlertDialogTitle>Yakin hapus funding source?</AlertDialogTitle>
            <AlertDialogDescription>
              Funding source <strong>{fundingSource.name}</strong> akan dihapus.
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
    </div>
  );
}