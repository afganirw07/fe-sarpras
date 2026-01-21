"use client"

import React, { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Search, Pencil, Trash2 } from "lucide-react";
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
import { toast, Toaster } from "sonner"

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
    e.preventDefault()
    toast.success("selamat kamu sukses")
  }

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 md:max-w-6xl lg:max-w-7xl dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
            Data Roles
          </h1>

          <div className="flex w-full gap-3 md:w-auto">
            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari user atau role..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/20 md:w-72 dark:bg-transparent"
              />
            </div>
            <Dialog>
              <form onSubmit={kirimAlert}>
                <DialogTrigger asChild>
                  <Button type="button" className="bg-blue-500 transition duration-300 hover:bg-blue-600 text-white">
                    + Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] dark:bg-black">
                  <DialogHeader>
                    <DialogTitle>Add Roles</DialogTitle>
                    <DialogDescription>
                      Add role to system here. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">Name</Label>
                      <Input id="name-1" name="name" className="dark:bg-black"/>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Role</Label>
                      <Select>
                        <SelectTrigger className="w-full dark:bg-black">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">hhh</SelectItem>
                          <SelectItem value="dark">xixix</SelectItem>
                          <SelectItem value="system">jaja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                        onClick={() => toast.success("kamu berhasil")}
                      className="bg-blue-500 transition duration-300 hover:bg-blue-600 dark:text-white"
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>

        <div className="mt-20 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                      className="min-w-[180px] px-5 py-3 text-start text-xs font-medium text-gray-500"
                    >
                      Users
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-[260px] px-5 py-3 text-start text-xs font-medium text-gray-500"
                    >
                      Role
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
                      <TableCell className="px-6 py-12">
                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {user.id}
                        </span>
                      </TableCell>

                      <TableCell className="px-4 py-12 text-sm text-gray-500 dark:text-white/90">
                        {user.nama}
                      </TableCell>

                      <TableCell className="px-4 py-12">
                        <div className="flex flex-wrap gap-2">
                          {user.role.map((role) => {
                            return (
                              <span
                                key={role}
                                className={`rounded-full px-3 py-1 text-xs font-medium bg-blue-500 dark:bg-gray-600 text-white `}
                              >
                                {role}
                              </span>
                            );
                          })}
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-12">
                        <div className="flex justify-center gap-3 md:gap-4">
                          <Dialog>
                            <form>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DialogTrigger asChild>
                                    <button type="button">
                                      <Pencil
                                        size={16}
                                        className="cursor-pointer"
                                      />
                                    </button>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit</p>
                                </TooltipContent>
                              </Tooltip>

                              <DialogContent className="sm:max-w-[425px] bg-black">
                                <DialogHeader>
                                  <DialogTitle>Update Roles</DialogTitle>
                                  <DialogDescription>
                                    Update role to system here. Click save when
                                    you&apos;re done.
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                  <div className="grid gap-3">
                                    <Label>Name</Label>
                                    <Input className="dark:bg-black" />
                                  </div>

                                  <div className="grid gap-3">
                                    <Label>Role</Label>
                                    <Select>
                                      <SelectTrigger className="w-full dark:bg-black">
                                        <SelectValue placeholder="Role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="light">
                                          hhh
                                        </SelectItem>
                                        <SelectItem value="dark">
                                          xixix
                                        </SelectItem>
                                        <SelectItem value="system">
                                          jaja
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                                    Save changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </form>
                          </Dialog>

                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <button type="button">
                                    <Trash2
                                      size={16}
                                      className="cursor-pointer text-red-700"
                                    />
                                  </button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>

                            <AlertDialogContent className="bg-black">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-700 hover:bg-red-800 text-white">
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
  );
}