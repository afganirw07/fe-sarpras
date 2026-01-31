
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import { Label } from "@/components/ui/label";
import Input from "@/components/form/input/InputField";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import {toast, Toaster} from "react-hot-toast";

export default function ActionKategoriButtons() {

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
            <DialogContent className="max-w-xl p-6">
              <DialogHeader>
                <DialogTitle>Update Supplier</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label>Nama</Label>
                  <Input placeholder="Nama Lengkap" />
                </div>

                <div className="grid gap-2">
                  <Label>Contact</Label>
                  <Input placeholder="Nomor Telepon / Email" />
                </div>

                <div className="grid gap-2">
                  <Label>Address</Label>
                  <Textarea
                    placeholder="Alamat Lengkap"
                    className="min-h-40"
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="bg-blue-800 hover:bg-blue-900">Save</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        {/* DELETE */}
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
              <AlertDialogTitle>Yakin hapus supplier?</AlertDialogTitle>
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

        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">
              <Link href={"/dashboard/items/show/id"}>
                <SquareArrowOutUpRight size={16} />
              </Link>
            </button>
          </TooltipTrigger>
          <TooltipContent>Show</TooltipContent>
        </Tooltip>
      </div>
    );
  }