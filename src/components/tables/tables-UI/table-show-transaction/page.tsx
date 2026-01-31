"use client";

import React, { ReactElement } from "react";
import {Table,TableBody,TableCell,TableHeader,TableRow,} from "../../../ui/table";
import { Button } from "../../../ui/button";
import { Search, SquareArrowOutUpRight, Focus, QrCode } from "lucide-react";
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,DialogClose,DialogFooter,} from "@/components/ui/dialog";
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog";
import {Tooltip,TooltipContent,TooltipTrigger,} from "@/components/ui/tooltip";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import TextArea from "../../../form/input/TextArea";

interface User {
  id: number;
  nama: string;
  role: string[];
}

const tableData: User[] = [
//   {
//     id: 1,
//     nama: "Afgan Irwansyah",
//     role: ["Back End", "Unit Testing", "System Analyst"],
//   },
//   {
//     id: 2,
//     nama: "Ahsan Rohsikan",
//     role: ["Front End"],
//   },
//   {
//     id: 3,
//     nama: "Zefanya Prasetiyo",
//     role: ["Front End"],
//   },
];

export default function ShowTransaction() {
  function ActionButtons() {
    return (
      <div className="flex justify-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">
              <Link href={"/dashboard/items/detail"}>
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
      <div className="w-full max-w-sm rounded-xl border p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-6">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Detail Transaction | IN
          </h1>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Created By :</Label>
              <Input value="someone" readOnly />
            </div>

            <div className="grid gap-2">
              <Label>Instansi : :</Label>
              <Input value="SMK TARUNA BHAKTI" readOnly />
            </div>

            <div className="grid gap-2">
              <Label>User :</Label>
              <Input value="PEOPLE" readOnly />
            </div>

            <div className="grid gap-2">
              <Label>Status :</Label>
              <Input value="shintanuria17" readOnly />
            </div>
            <div className="grid gap-2">
              <Label>PO Number :</Label>
              <Input value="shintanuria17" readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Warehouse :</Label>
              <Input value="shintanuria17" readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Supplier :</Label>
              <Input value="shintanuria17" readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Date :</Label>
              <Input value="shintanuria17" readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Detail :</Label>
              <Input value="shintanuria17" readOnly />
            </div>
            
          </div>
        </div>
        <div className="mt-12">
          <div className="flex w-full flex-col gap-3 md:w-auto">
            <div className="flex items-center justify-between">
            <h1 className="font-quicksand text-2xl font-semibold">Data Item</h1>
              <p className="font-figtree text-base text-xs font-semibold lg:text-lg">
                Total Item : 0 item
              </p>
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="relative w-full max-w-xs md:w-72">
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
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="relative overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <Table className="w-full table-fixed">
                  <TableHeader className="border border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="w-[60px] rounded-l-md border border-r-0 bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200"
                      >
                        Item ID
                      </TableCell>

                      <TableCell
                        isHeader
                        className="w-[360px] border bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200"
                      >
                        Item Name
                      </TableCell>

                      <TableCell
                        isHeader
                        className="w-[160px] border bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200"
                      >
                        Item Price
                      </TableCell>

                      <TableCell
                        isHeader
                        className="w-[120px] border bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200"
                      >
                        QTY request
                      </TableCell>

                      <TableCell
                        isHeader
                        className="w-[120px] border bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200"
                      >
                         QTY receive
                      </TableCell>

                      <TableCell
                        isHeader
                        className="w-[130px] border bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200"
                      >
                        Tahun Pengadaan
                      </TableCell>
                      <TableCell
                        isHeader
                        className="w-[130px] border bg-blue-800 px-4 py-3 text-xs font-medium text-gray-200"
                      >
                        Tahun Pengadaan
                      </TableCell>
                      <TableCell
                        isHeader
                        className="w-[100px] rounded-r-md border bg-blue-800 px-4 py-3 text-center text-xs font-medium text-gray-200"
                      >
                        Item Condition
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {tableData.length === 0 ? (
                     <TableRow>
                            <td
                              colSpan={8}
                              className="border px-6 py-6 text-center text-sm text-gray-500"
                            >
                              Tidak ada Kategori
                            </td>
                          </TableRow> ) : (
                    tableData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="border px-4 py-4 text-sm">
                          {user.id}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm ">
                          {user.nama}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm">
                          {user.nama}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm">
                          {user.nama}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm">
                          {user.nama}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm">
                          {user.nama}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-sm">
                          {user.nama}
                        </TableCell>

                        <TableCell className="border px-4 py-4 text-center">
                       {user.nama}
                        </TableCell>
                      </TableRow>
                    ))
                )}
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
