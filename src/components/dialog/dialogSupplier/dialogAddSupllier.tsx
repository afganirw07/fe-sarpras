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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSupplier } from "@/lib/supplier";
import { toast } from "sonner";

interface Props {
  onSuccess?: () => void;
}

export default function DialogAddSupplier({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.address) {
      toast.error("Nama dan alamat wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await createSupplier(form);
      toast.success("Supplier berhasil ditambahkan");

      // reset form
      setForm({
        name: "",
        email: "",
        phone_number: "",
        address: "",
      });

      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="font-quicksand text-md bg-blue-800 text-white hover:bg-blue-900"
          >
            + Add Supplier
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl p-6 dark:bg-black">
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nama</Label>
              <Input
                value={form.name}
                placeholder="Nama Lengkap"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={form.email}
                placeholder="Email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input
                value={form.phone_number}
                placeholder="Nomor Telepon"
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Address</Label>
              <Textarea
                value={form.address}
                placeholder="Alamat Lengkap"
                className="min-h-30"
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
            <DialogClose asChild>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-800 hover:bg-blue-900"
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
