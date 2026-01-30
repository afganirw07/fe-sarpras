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
  SelectGroup,
  SelectLabel,
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
import MultiSelect from "../form/MultiSelect";
import { useState } from "react";
import { useEffect } from "react";
import { getEmployees } from "@/lib/roles";
import { Employee } from "@/lib/roles";
import { addEmployeeRoles } from "@/lib/roles";
import { useMemo } from "react";
import { getEmployeeRoles, EmployeeRole } from "@/lib/roles";
import { useRouter } from "next/navigation";

export default function DialogAddRoles({onSuccess}: {onSuccess?: () => void}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [rows, setRows] = useState<EmployeeRole[]>([]);
  console.log(selectedRoles);

  const employeeWithRoleIds = new Set(rows.map((r) => r.employeeId));

  // employee yang boleh ditambahkan role
  const employeesWithoutRole = employees.filter(
    (emp) => !employeeWithRoleIds.has(emp.id),
  );
  const [search, setSearch] = useState("");

  console.log(selectedRoles);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch {
        toast.error("Gagal ambil employee");
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const keyword = search.toLowerCase();
    return employeesWithoutRole.filter((emp) =>
      emp.full_name.toLowerCase().includes(keyword),
    );
  }, [employeesWithoutRole, search]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getEmployeeRoles();
        setRows(data);
      } catch {
        toast.error("Gagal ambil data role");
      }
    };

    fetchRoles();
  }, []);

  const kirimAlert = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      toast.error("Pilih employee dulu");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error("Pilih minimal satu role");
      return;
    }

    console.log(
      "PAYLOAD SEND:=======================================================",
      {
        employeeId: selectedEmployeeId,
        role: selectedRoles,
      },
    );
    try {
      await addEmployeeRoles({
        employeeId: selectedEmployeeId,
        role: selectedRoles,
      });
      toast.success("Role berhasil ditambahkan");
      setSelectedEmployeeId("");
      setSelectedRoles([]);
      await onSuccess?.()
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah role");
    }
  };
  const options = [
    { text: "Approver", value: "approver" },
    { text: "Admin", value: "admin" },
    { text: "Oprasional", value: "operator" },
  ];

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row lg:items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="font-quicksand text-md bg-blue-800 text-white hover:bg-blue-900"
          >
            + Add Role
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-4xl p-8">
          <form onSubmit={kirimAlert}>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Add Roles</DialogTitle>
              <DialogDescription>
                Tambahkan role untuk user yang dipilih
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Nama User</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih pengguna" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="max-h-64 w-[var(--radix-select-trigger-width)] overflow-y-auto"
                  >
                    <div className="px-2 pb-2">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          placeholder="Cari user..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full rounded-lg border px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    {filteredEmployees.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        User tidak ditemukan
                      </div>
                    )}

                    {filteredEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <MultiSelect
                  options={options}
                  defaultSelected={selectedRoles}
                  onChange={(values: string[]) => {
                    setSelectedRoles(values);
                  }}
                />
              </div>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline">
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
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
