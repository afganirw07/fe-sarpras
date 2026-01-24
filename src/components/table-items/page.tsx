"use client";

import React, { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Search, Pencil, Trash2, SquareArrowOutUpRight } from "lucide-react";
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
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "../ui/label";
import Input from "../form/input/InputField";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import TextArea from "../form/input/TextArea";

interface User {
  id: number;
  nama: string;
  role: string[];
}

const tableData: User[] = [
  {
    id: 1,
    nama: "Afgan Irwansyah",
    role: ["Back End", "Unit Testing", "System Analyst"],
  },
  {
    id: 2,
    nama: "Ahsan Rohsikan",
    role: ["Front End"],
  },
  {
    id: 3,
    nama: "Zefanya Prasetiyo",
    role: ["Front End"],
  },
];

export default function TableItems() {
  function ActionButtons() {
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

          <DialogContent className="sm:max-w-[425px] dark:bg-black">
            <DialogHeader>
              <DialogTitle>Update Roles</DialogTitle>
              <DialogDescription>Update role user</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <Input disabled />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-blue-500 text-white">Save changes</Button>
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

  const kirimAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("selamat kamu sukses");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Data Items
          </h1>
          <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
            <Dialog>
              <form onSubmit={kirimAlert}>
                <DialogTrigger asChild>
                  <Button size={"lg"} className="font-quicksand text-md">
                    + Add item
                  </Button>
                </DialogTrigger>

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
                      <TextArea className="h-full min-h-[180px]" />
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
            <Button size={"lg"}><Link href={"/dashboard/items/trashed"}>Trashed</Link></Button>
          </div>
        </div>
        <div className="mt-20">
          <div className="flex w-full items-end justify-end gap-3 md:w-auto">
            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search item"
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 md:w-72 dark:bg-transparent"
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="relative overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <Table className="w-full table-auto">
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="min-w-[60px] px-6 py-3 text-start text-xs font-medium text-gray-500"
                      >
                        No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[120px] px-5 py-3 text-start text-xs font-medium text-gray-500"
                      >
                        Kode
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[180px] px-5 py-3 text-start text-xs font-medium text-gray-500"
                      >
                        Nama
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[100px] px-5 py-3 text-center text-xs font-medium text-gray-500"
                      >
                        Merek
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[130px] px-5 py-3 text-center text-xs font-medium text-gray-500"
                      >
                        Harga
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[130px] px-5 py-3 text-center text-xs font-medium text-gray-500"
                      >
                        Kategori
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[160px] px-5 py-3 text-center text-xs font-medium text-gray-500"
                      >
                        Os Balance
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[160px] px-5 py-3 text-center text-xs font-medium text-gray-500"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-gray-100 dark:divide-white/[0.05]">
                    {tableData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {user.id}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.id}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-center">
                          <ActionButtons />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
