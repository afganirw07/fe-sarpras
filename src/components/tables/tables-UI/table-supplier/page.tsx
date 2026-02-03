"use client";

import React, { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";

import { Search, Pencil, Trash2, SquareArrowOutUpRight } from "lucide-react";
import { toast, Toaster } from "sonner";
import ActionButtonsSupplier from "@/components/dialog/dialogSupplier/dialogactionSupplier";
import DialogAddSupplier from "@/components/dialog/dialogSupplier/dialogAddSupllier";

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
        <DialogAddSupplier/>
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
                    {tableData.length === 0 ? (
                      <TableRow>
                        <td
                          colSpan={6}
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
                          <TableCell className="light:border-gray-100 border px-5  py-4 text-center">
                            <ActionButtonsSupplier/>
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
