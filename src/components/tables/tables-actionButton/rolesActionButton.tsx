
import { Button } from "@/components/ui/button";
import { Pencil, Trash2,  } from "lucide-react";
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import Input from "@/components/form/input/InputField";
import { toast, Toaster } from "sonner";
import MultiSelect from "@/components/form/MultiSelect";



export default function ActionButtons() {

 const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const options = [
    { text: "Approver", value: "approver" },
    { text: "Admin", value: "admin" },
    { text: "Oprasional", value: "oprasional" },
  ];

 

  const kirimAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("selamat kamu sukses");
  };

    return (
      <div className="flex justify-center gap-4">
        {/* EDIT */}
        <Dialog>
          <form onSubmit={kirimAlert}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <button type="button">
                    <Pencil size={16} className="cursor-pointer" />
                  </button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <DialogContent className="w-full max-w-4xl p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl">Add Items</DialogTitle>
                <DialogDescription>
                  Tambahkan role untuk item yang dipilih
                </DialogDescription>
              </DialogHeader>

              <div className="">
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
                  <Label className="text-sm font-medium">Role</Label>
                  <MultiSelect options={options} onChange={setSelectedRoles} />
                  <p className="text-xs text-gray-500">
                    Bisa memilih lebih dari satu role
                  </p>
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
            </DialogContent>
          </form>
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
              <AlertDialogTitle>Yakin hapus role?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak bisa dibatalkan
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 text-white">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
        )};