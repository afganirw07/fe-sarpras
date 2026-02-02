"use client";

import React, { ReactElement } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../../ui/label";
import { toast, Toaster } from "sonner";
import MultiSelect from "../../form/MultiSelect";
import { useState } from "react";
import { useEffect } from "react";
import { getEmployees } from "@/lib/roles";
import { Employee } from "@/lib/roles";
import { addEmployeeRoles } from "@/lib/roles";
import { useMemo } from "react";
import { getEmployeeRoles, EmployeeRole } from "@/lib/roles";

export default function DialogAddRoles({onSuccess}: {onSuccess?: () => void}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [rows, setRows] = useState<EmployeeRole[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const employeeWithRoleIds = new Set(rows.map((r) => r.employee_id));

  const employeesWithoutRole = employees.filter(
    (emp) => !employeeWithRoleIds.has(emp.id),
  );  

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

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      setSelectedEmployeeId("");
      setSelectedRoles([]);
      setSearch("");
    }
  };

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


    console.log(" Payload:", {
      employeeId: selectedEmployeeId,
      role: selectedRoles,
    });

    try {
      setLoading(true);
      
      await addEmployeeRoles({
        employeeId: selectedEmployeeId,
        role: selectedRoles,
      });

      toast.success("Role berhasil ditambahkan");
      
      setSelectedEmployeeId("");
      setSelectedRoles([]);
      setSearch("");
      
      setIsOpen(false);
      
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err: any) {
      console.error("[DialogAddRoles] Failed:", err.message);
      toast.error(err.message || "Gagal menambah role");
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { text: "Approver", value: "approver" },
    { text: "Admin", value: "admin" },
    { text: "Operasional", value: "operator" },
  ];

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row lg:items-center">
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
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
              <DialogTitle className="text-xl">Tambah Role</DialogTitle>
              <DialogDescription>
                Tambahkan role untuk user yang dipilih
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Nama User</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={(value) => {
                    console.log("[DialogAddRoles] Employee selected:", value);
                    setSelectedEmployeeId(value);
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih pengguna" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="max-h-64 w-(--radix-select-trigger-width) overflow-y-auto"
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
                      <SelectItem 
                      key={emp.id} 
                      value={emp.id}
                      disabled = {emp.isRoleDeleted}
                      className={emp.isRoleDeleted ? "opacity-50 cursor-not-allowed" : ""}
                      >                      
                       {emp.full_name}
                       {emp.isRoleDeleted && (
                         <span className="ml-2 text-xs text-red-500">Role dihapus, pulihkan terlebih dahulu</span>
                       )}
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
                    console.log("[DialogAddRoles] Roles changed:", values);
                    setSelectedRoles(values);
                  }}
                />
                <p className="text-xs text-gray-500">
                  Bisa memilih lebih dari satu role
                </p>
              </div>
            </div>

            <DialogFooter className="mt-10 flex justify-end gap-3">
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-800 px-6 text-white hover:bg-blue-900 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}