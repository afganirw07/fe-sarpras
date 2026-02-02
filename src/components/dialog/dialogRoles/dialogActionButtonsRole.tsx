"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { toast } from "sonner";
import MultiSelect from "../../form/MultiSelect";
import {
  deleteEmployeeRole,
  getEmployees,
  Employee,
  addEmployeeRoles,
  getEmployeeRoles,
  EmployeeRole,
  updateEmployeeRole,
} from "@/lib/roles";
import { useRouter } from "next/navigation";

export default function ActionButtonsRoles({
  employeeId,
  roleId,
  onSuccess
}: {
  employeeId: string;
  roleId: string;
  onSuccess?: () => void;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [rows, setRows] = useState<EmployeeRole[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null); 
  const router = useRouter();

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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getEmployeeRoles();
        console.log(
          "DATA ROLES: =======================================",
          data,
        );
        setRows(data);
      } catch {
        toast.error("Gagal ambil data role");
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!selectedEmployeeId) return;
    const row = rows.find((r) => r.employee_id === selectedEmployeeId);

    setSelectedRoles(row?.roles || []);
  }, [selectedEmployeeId, rows]);

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

async function handleDelete(e: React.MouseEvent) {
  e.preventDefault();
  
  try {
    if (!deleteId) {
      toast.error("Role ID tidak ditemukan");
      return;
    }
    
    console.log("Deleting role ID:", deleteId);
    await deleteEmployeeRole(deleteId);
    setRows((prevRows) => prevRows.filter((r) => r.id !== deleteId));
    toast.success("Role berhasil dihapus");   
    setDeleteId(null);
    
    await onSuccess?.();
    
  } catch (err: any) {
    console.error("Delete error:", err);
    toast.error(err.message || "Gagal hapus role");
  }
}

  interface RoleOption {
  text: string;
  value: string;
}

  const options: RoleOption[] = [
    { text: "Approver", value: "approver" },
    { text: "Admin", value: "admin" },
    { text: "Oprasional", value: "operator" },
  ];

  return (
    <div className="flex justify-center gap-4">
      {/* EDIT */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            onClick={() => {
              setSelectedEmployeeId(employeeId);
              const row = rows.find((r) => r.employee_id === employeeId);
              console.log("ROW EDIT: ", row);
              setSelectedRoles(row?.roles || []);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Pencil size={16} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-4xl p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl">Edit Role</DialogTitle>
            <DialogDescription>
              Update role untuk pengguna yang dipilih
            </DialogDescription>
          </DialogHeader>

          <form
          
            onSubmit={async (e) => {
              e.preventDefault();
              if (selectedRoles.length === 0) {
                toast.error("Pilih minimal satu role");
                return;
              }
              try {
                await updateEmployeeRole({
                  employee_id: selectedEmployeeId,
                  roleId: roleId,
                  role: selectedRoles,
                });
                toast.success("Role berhasil diperbarui");
              } catch (err: any) {
                toast.error(err.message || "Gagal update role");
              }
              await onSuccess?.()
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Nama Pengguna</Label>
                <Input
                  value={
                    employees.find((emp) => emp.id === selectedEmployeeId)
                      ?.full_name || ""
                  }
                  readOnly
                  className="h-11 w-full bg-gray-100 text-gray-700 dark:text-white"
                />
              </div>

              {/* Edit Role */}
              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <MultiSelect
                  options={options}
                  defaultSelected={selectedRoles}
                  onChange={(values: string[]) => setSelectedRoles(values)}
                />
                <p className="text-xs text-gray-500">
                  Bisa memilih lebih dari satu role
                </p>
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
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button 
                type="button"
                onClick={() => setDeleteId(roleId)} // UBAH dari employeeId jadi roleId
              >
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

            <AlertDialogAction asChild>
              <button
                className="rounded bg-red-600 px-4 hover:bg-red-700 py-2 text-white"
                onClick={handleDelete}
              >
                Delete  
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
