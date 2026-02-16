"use client";

import React, { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
import { Search, SquareArrowOutUpRight } from "lucide-react";
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
import { Label } from "../../../ui/label";
import Input from "../../../form/input/InputField";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import TextArea from "../../../form/input/TextArea";
import { table } from "console";
import DialogTransactionIn from "../../../dialog/dialogTransaction/dialogTransactionIn";
import DialogTransactionOut from "../../../dialog/dialogTransaction/dialogTransactionOut";
import DialogTransactionReturn from "../../../dialog/dialogTransaction/dialog.transactionReturn";

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
];

export default function TableTrancsactionOut() {
  function ActionButtons() {
    return (
      <div className="flex justify-center gap-4">
        {/* DELETE */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">
              <Link href={"/dashboard/transaction/show"}>
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
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/5] dark:bg-white/3">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="font-figtree text-md font-semibold text-gray-800 lg:text-2xl dark:text-white">
              Data Transaksi
            </h1>

            <div className="flex flex-wrap gap-2 sm:flex-row sm:items-center">
              <DialogTransactionIn />
              <DialogTransactionOut />
              <DialogTransactionReturn />
            </div>
          </div>
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

          <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="relative overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <Table className="w-full table-auto ">
                  <TableHeader className="border border-gray-100 dark:border-white/5">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-20 rounded-b-none rounded-l-md border border-r-0 bg-blue-800 px-6 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        ID
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-20 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        User
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-20 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-40 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Warehouse
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-20 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-30 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-35 rounded-b-none rounded-r-md border bg-blue-800 px-5 py-3 text-center text-xs font-medium text-gray-200"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-gray-100 dark:divide-white/5">
                    {tableData.length === 0 ? (
                      <TableRow>
                        <td
                          colSpan={7}
                          className="border px-6 py-6 text-center text-sm text-gray-500"
                        >
                          Tidak ada Kategori
                        </td>
                      </TableRow>
                    ) : (
                      tableData.map((user) => (
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
                          <TableCell className="light:border-gray-100 border px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                            {user.nama}
                          </TableCell>
                          <TableCell className="light:border-gray-100 border px-5  py-4 text-center">
                            <ActionButtons />
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
