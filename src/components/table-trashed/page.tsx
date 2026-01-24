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
import { Search, ArchiveRestore  } from "lucide-react";
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

export default function TableTrashed() {
  function ActionButtons() {
    return (
      <div className="flex justify-center gap-4">
        {/* DELETE */}
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button type="button">
                  <ArchiveRestore size={16}/>
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Restore</TooltipContent>
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
        </div>
        <div className="mt-12">
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
