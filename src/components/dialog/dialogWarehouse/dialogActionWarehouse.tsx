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
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";

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
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<RoomPayload>({
    code: "",
    name: "",
    type: TypeRoom.GUDANG,
  });

  useEffect(() => {
    if (!open || !room) return;

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
  }, [open, room]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateRoom(room.id, payload);
      toast.success("Warehouse berhasil diperbarui");
      await onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal update warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoom(room.id);
      toast.success("Warehouse berhasil dihapus");
      await onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal hapus warehouse");
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <button>
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

        <DialogContent className="w-full max-w-3xl p-8 dark:bg-black">
          <form onSubmit={handleUpdate}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Edit Warehouse</DialogTitle>
              <DialogDescription>Perbarui data warehouse</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Kode Warehouse</Label>
                <Input
                  value={payload.code}
                  onChange={(e) =>
                    setPayload({ ...payload, code: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Warehouse Type</Label>
                <Select
                  value={payload.type}
                  onValueChange={(val) =>
                    setPayload({ ...payload, type: val as TypeRoom })
                  }
                >
                  <SelectTrigger className="h-11">
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

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label>Nama Warehouse</Label>
                <Input
                  value={payload.name}
                  onChange={(e) =>
                    setPayload({ ...payload, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-800 text-white hover:bg-blue-900"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
            <AlertDialogTitle>Yakin hapus warehouse?</AlertDialogTitle>
            <AlertDialogDescription>
              Data tidak bisa dikembalikan
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">
            <Link href={`/dashboard/warehouse/show/${room.id}`}>
              <SquareArrowOutUpRight size={16} />
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}
