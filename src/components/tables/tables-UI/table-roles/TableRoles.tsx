"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import Label from "@/components/form/Label";
import { toast, Toaster } from "sonner";

import MultiSelect from "@/components/form/MultiSelect";
import { useState } from "react";
import ActionKategoriButtons from "../../tables-actionButton/kategoriActionButton";

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

export default function TableRoles() {
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
    <div className="flex flex-col">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 md:max-w-6xl lg:max-w-6xl dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Data Role
          </h1>
          <div className="flex flex-col lg:items-center items-end gap-2 md:flex-row">
            <Dialog>
              <form onSubmit={kirimAlert}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="font-quicksand text-md text-White bg-blue-800 transition duration-300 hover:bg-blue-900"
                  >
                    + Add Role
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-full max-w-7xl p-8 dark:bg-black">
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
                            <SelectItem value="banana">
                              Ageng Subagja
                            </SelectItem>
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
                      <MultiSelect
                        options={options}
                        onChange={setSelectedRoles}
                      />
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

          <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="relative overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <Table className="w-full table-auto ">
                  <TableHeader className="border border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="min-w-[80px] border light:border-gray-100 px-6 py-3 text-start text-xs font-medium text-gray-200 bg-blue-800 rounded-l-md rounded-b-none border-r-0"
                      >
                        No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[220px] border light:border-gray-100 px-5 py-3 text-start text-xs font-medium text-gray-200 bg-blue-800"
                      >
                        Users
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[260px] border light:border-gray-100 px-5 py-3 text-start text-xs font-medium text-gray-200 bg-blue-800"
                      >
                        Role
                      </TableCell>
                      <TableCell
                        isHeader
                        className="min-w-[140px] border light:border-gray-100 px-5 py-3 text-center text-xs font-medium text-gray-200 bg-blue-800 rounded-r-md rounded-b-none"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-gray-100 dark:divide-white/[0.05]">
                    {tableData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-6 py-4 border light:border-gray-100">
                          <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {user.id}
                          </span>
                        </TableCell>
                        <TableCell className="border light:border-gray-100 px-4 py-8 text-sm text-gray-500 dark:text-white/90">
                          {user.id}
                        </TableCell>
                        <TableCell className="border light:border-gray-100 px-4 py-8 text-sm text-gray-500 dark:text-white/90">
                          {user.nama}
                        </TableCell>
                        <TableCell className="border light:border-gray-100 px-5  py-8 text-center">
                          <ActionKategoriButtons />
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
