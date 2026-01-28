"use client";

import { Button } from "../ui/button";
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
import Label from "../form/Label";

export default function DialogAddWarehouse() {
  return (
    <div className="flex flex-col items-end gap-2 md:flex-row lg:items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="font-quicksand text-md bg-blue-800 text-white hover:bg-blue-900"
          >
            + Add Warehouse
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl p-8 dark:bg-black">
          <form>
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
                <Label className="text-sm font-medium">Kode Item</Label>
                <Select>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Daftar Pengguna</SelectLabel>
                      <SelectItem value="apple">
                        Hajid al Akthar SMK Taruna Bhakti
                      </SelectItem>
                      <SelectItem value="banana">Ageng Subagja</SelectItem>
                      <SelectItem value="blueberry">
                        Joy Widi Wibowo
                      </SelectItem>
                      <SelectItem value="grapes">
                        Hafidzh Nurrohman
                      </SelectItem>
                      <SelectItem value="pineapple">
                        Ian Rachmadani
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Warehouse Type
                </Label>
                <Select>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kelas">Kelas</SelectItem>
                    <SelectItem value="gudang">Gudang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="text-sm font-medium">Instansi</Label>
                <Select>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih instansi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tb001">
                      TB001 | SMP Taruna Bhakti
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                className="bg-blue-800 px-6 text-white hover:bg-blue-900"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
