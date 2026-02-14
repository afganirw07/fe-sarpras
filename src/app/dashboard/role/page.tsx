"use client";
import { Search,  Users, Shield } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { getEmployees } from "@/lib/roles";
import { Employee } from "@/lib/roles";
import {
  getEmployeeRoles,
  EmployeeRole,
} from "@/lib/roles";
import DialogAddRoles from "@/components/dialog/dialogRoles/dialogAddRole";

import ButtonTrashed from "@/components/ui/button/trashedButton";
import TableRoles from "@/components/tables/tables-UI/table-roles/TableRoles";

export default function RolePage () {

  const [refreshKey, setRefreshKey] = useState(0)
    
    const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
    
      // Role color mapping
      const getRoleColor = (role: string) => {
        const roleLower = role.toLowerCase();
        if (roleLower.includes("admin")) return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-500";
        if (roleLower.includes("approver")) return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500";
        if (roleLower.includes("operator")) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-500";
        return "bg-blue-100 text-blue-700 border-blue-200";
      };
    return(
        <>
         <div className="w-full lg:max-w-7xl md:max-w-5xl max-w-xs mx-auto">
       <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                  Manajemen Role
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola hak akses pengguna
                </p>
              </div>
            </div>
            <div className="flex gap-2">
            <DialogAddRoles onSuccess={handleRefresh}/>
            <ButtonTrashed
            route="role"/>
            </div>
          </div>
        </div>
        <TableRoles key={refreshKey}/>
        </div>
        </>
    );
}