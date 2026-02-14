"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { getEmployees } from "@/lib/roles";
import { Employee } from "@/lib/roles";
import {
  getEmployeeRoles,
  EmployeeRole,
} from "@/lib/roles";
import ActionButtonsRoles from "@/components/dialog/dialogRoles/dialogActionButtonsRole";
import { toast } from "sonner";

export default function TableRoles() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<EmployeeRole[]>([]);
  const [search, setSearch] = useState("");

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const employeeMap = useMemo(() => {
    return employees.reduce<Record<string, string>>((acc, emp) => {
      acc[emp.id] = emp.full_name;
      return acc;
    }, {});
  }, [employees]);

  const filteredRows = useMemo(() => {
    const keyword = search.toLowerCase();

    return rows.filter((row) => {
      const employeeName = employeeMap[row.employeeId] ?? "";
      const rolesText = row.roles.join(" ");

      return (
        employeeName.toLowerCase().includes(keyword) ||
        rolesText.toLowerCase().includes(keyword)
      );
    });
  }, [rows, employeeMap, search]);
  
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeRoles();
      setRows(data);
    } catch {
      toast.error("Gagal ambil data role");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Role color mapping
  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("admin")) return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-500";
    if (roleLower.includes("approver")) return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500";
    if (roleLower.includes("operator")) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-500";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    //  responsive container
        <div className="w-full lg:max-w-7xl md:max-w-4xl max-w-xs">
        <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
          {/* Search Bar */}
          <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
            <div className="relative w-full md:w-80">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari berdasarkan nama atau role..."
                value={search}
                onChange={handleSearch}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                    <TableCell
                      isHeader
                      className="w-20 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Nama Pengguna
                    </TableCell>
                    <TableCell
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Role & Akses
                    </TableCell>
                    <TableCell
                      isHeader
                      className="w-32 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      Aksi
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading && (
                    <TableRow>
                      <td colSpan={4} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                        </div>
                      </td>
                    </TableRow>
                  )}

                  {!loading && filteredRows.length === 0 && (
                    <TableRow>
                      <td colSpan={4} className="py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Data tidak ditemukan
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Coba kata kunci pencarian lain
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  )}

                  {!loading &&
                    filteredRows.map((row, index) => (
                      <TableRow 
                        key={row.id}
                        className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                      >
                        <TableCell className="px-6 py-4">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                            {index + 1}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
                              {(employeeMap[row.employeeId] ?? "-").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {employeeMap[row.employeeId] ?? "-"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {row.employeeId.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex flex-row gap-2">
                            {row.roles.map((role, i) => (
                              <span
                                key={i}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${getRoleColor(role)}`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <ActionButtonsRoles
                            employeeId={row.employeeId}
                            roleId={row.id}
                            onSuccess={fetchRoles}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
  );
}