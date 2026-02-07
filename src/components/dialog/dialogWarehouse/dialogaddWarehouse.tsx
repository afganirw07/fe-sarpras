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
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import Label from "../../form/Label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createRoom, TypeRoom } from "@/lib/warehouse";
import { toast } from "sonner";

export default function DialogAddWarehouse({ onSuccess}:{onSuccess?: () => void;}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<TypeRoom | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !name || !type) {
      toast.error("Semua field wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await createRoom({
        code,
        name,
        type,
      });
      toast.success("Warehouse berhasil ditambahkan");
      await onSuccess?.();
      setCode("");
      setName("");
      setType("");
    } catch (error: any) {
      toast.error(error?.message || "Gagal menambahkan warehouse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row lg:items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="font-quicksand text-md bg-blue-800 text-white hover:bg-blue-900"
          >
            + Add Warehouse
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl p-8 dark:bg-black">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">
                Add Warehouse
              </DialogTitle>
              <DialogDescription>
                Tambahkan data warehouse
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Kode Warehouse</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Warehouse Type
                </Label>
                <Select
                  value={type}
                  onValueChange={(val) => setType(val as TypeRoom)}
                >
                  <SelectTrigger className="h-11">
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
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="text-sm font-medium">Nama Warehouse</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" className="px-6">
                  Cancel
                </Button>
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
    </div>
  );
}
