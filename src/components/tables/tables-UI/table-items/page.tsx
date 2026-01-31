"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
import { Search } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "../../../ui/label";
import Input from "../../../form/input/InputField";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Textarea } from "../../../ui/textarea";
import ActionItemsButtons from "../../tables-actionButton/itemActionButton";

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
  {
    id: 3,
    nama: "Zefanya Prasetiyo",
    role: ["Front End"],
  },
  {
    id: 3,
    nama: "Zefanya Prasetiyo",
    role: ["Front End"],
  },
  {
    id: 3,
    nama: "Zefanya Prasetiyo",
    role: ["Front End"],
  },
  {
    id: 3,
    nama: "Zefanya Prasetiyo",
    role: ["Front End"],
  },
];

export default function TableItems() {
  
  const kirimAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("selamat kamu sukses");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-sm rounded-xl border  border-gray-200 bg-white p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/5 dark:bg-white/3">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Data Item
          </h1>
          <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
            <Dialog>
              <form onSubmit={kirimAlert}>
                <DialogTrigger asChild>
                  <Button
                    size={"lg"}
                    className="font-quicksand text-md bg-blue-800 text-white transition duration-300 hover:bg-blue-900"
                  >
                    + Add item
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl p-6">
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
                    <Button className="border border-gray-100 bg-blue-800 hover:bg-blue-900">
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
            <Button
              size={"lg"}
              className="text-White bg-red-800 transition duration-300 hover:bg-red-900"
            >
              <Link href={"/dashboard/items/trashed"}>Trashed</Link>
            </Button>
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
                        No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-20 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Kode
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-20 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Nama
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-40 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Merek
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-20 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Harga
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-30 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Kategori
                      </TableCell>
                      <TableCell
                        isHeader
                        className="light:border-gray-100 min-w-40 border bg-blue-800 px-5 py-3 text-start text-xs font-medium text-gray-200"
                      >
                        Os Balance
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
                          <TableCell className="light:border-gray-100 border px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                            {user.nama}
                          </TableCell>
                          <TableCell className="light:border-gray-100 border px-4 py-4 text-sm text-gray-500 dark:text-white/90">
                            {user.nama}
                          </TableCell>
                          <TableCell className="light:border-gray-100 border px-5  py-4 text-center">
                            <ActionItemsButtons />
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
