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

import { Label } from "@/components/ui/label";
import Input from "@/components/form/input/InputField";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea"; 
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import {Pencil, Trash2, SquareArrowOutUpRight} from "lucide-react"


export default function ActionItemsButtons() {
    return (
      <div className="flex justify-center gap-4">
        {/* EDIT */}
        <Dialog>
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

          <DialogContent className="max-w-4xl p-6">
            <DialogHeader>
              <DialogTitle>Add Items</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="grid gap-2">
                <Label>Kode Item</Label>
                <Input placeholder="Kode Item" />
              </div>

              <div className="grid gap-2">
                <Label>Nama Item</Label>
                <Input placeholder="Nama Item" />
              </div>

              <div className="grid gap-2">
                <Label>Kategori</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Kategori A</SelectItem>
                    <SelectItem value="b">Kategori B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Merek</Label>
                <Input placeholder="Merek Item" />
              </div>

              <div className="grid gap-2">
                <Label>Sub Kategori</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Sub A</SelectItem>
                    <SelectItem value="b">Sub B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Harga Item</Label>
                <Input type="number" defaultValue={0} />
              </div>

              <div className="grid gap-2">
                <Label>Satuan</Label>
                <Input placeholder="Satuan" />
              </div>

              <div className="row-span-2 grid gap-2">
                <Label>Spesifikasi</Label>
                <Textarea className="h-full min-h-45" />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="border border-gray-100 bg-blue-800 transition duration-300 hover:bg-blue-900">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
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
              <AlertDialogTitle>Yakin hapus Item ?</AlertDialogTitle>
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
              <Link href={"/dashboard/items/show"}>
                <SquareArrowOutUpRight size={16} />
              </Link>
            </button>
          </TooltipTrigger>
          <TooltipContent>Show</TooltipContent>
        </Tooltip>
      </div>
    );
  }