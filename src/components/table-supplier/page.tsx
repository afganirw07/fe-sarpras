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
import { Textarea } from "../ui/textarea";

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

export default function TableSupplier() {
  function ActionButtons() {
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
                    className="min-h-[120px]"
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

  const kirimAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("selamat kamu sukses");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Data Supplier
          </h1>
          <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
            <Dialog>
              <form onSubmit={kirimAlert}>
                <DialogTrigger asChild>
                  <Button
                    size={"lg"}
                    className="font-quicksand text-md bg-blue-800 text-white transition duration-300 hover:bg-blue-900"
                  >
                    + Add Supplier
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-xl p-6">
                  <DialogHeader>
                    <DialogTitle>Add Contact</DialogTitle>
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
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-blue-800 hover:bg-blue-900">
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
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
                <Table className="w-full table-auto ">
                  <TableHeader className="border border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-[80px] rounded-b-none rounded-l-md border border-r-0 bg-blue-800 px-6 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-[80px] border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Supplier
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-[80px] border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Contact
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-[160px] border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Address
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-[80px] border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        School
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-[140px] rounded-b-none rounded-r-md border bg-blue-800 px-5 py-3 text-center text-xs font-medium text-gray-200"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-gray-100 dark:divide-white/[0.05]">
                    {tableData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="light:border-gray-100 border px-6 py-4">
                          <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {user.id}
                          </span>
                        </TableCell>
                        <TableCell className="light:border-gray-100 border px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.id}
                        </TableCell>
                        <TableCell className="light:border-gray-100 border px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="light:border-gray-100 border px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="light:border-gray-100 border px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="light:border-gray-100 border px-5  py-4 text-center">
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
