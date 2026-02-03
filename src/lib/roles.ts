import { api } from "./api";

export interface Employee {
  id: string;
  full_name: string;
  role: string[];
  isRoleDeleted: boolean;
}

export interface EmployeeRole {
  full_name: string;
  id: string;
  employee_id: string;
  roles: string[];
  created_at: string; 
  updated_at: string;
  deleted_at: string | null;
  employee: RoleEmployee;
}

export interface Roles {
  id: string;
  employeeId : string;
  roles: string[]
  employee: RoleEmployee
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

}

interface RoleEmployee {
  full_name: string;
  phone_number: string;
}

export async function getEmployeeRoles() {
  const json = await api("/api/roles");
  return json.data;
}

export async function getEmployees(): Promise<Employee[]> {
  const json = await api("/api/employees");
  return json.data.map((item: any) => ({
    id: item.id,
    full_name: item.full_name,
    role: Array.isArray(item.role?.roles)
      ? item.role.roles
      : Array.isArray(item.role)
      ? item.role
      : [],
      isRoleDeleted: !!item.role?.deleted_at,
  }));
  return mapped;
}

export async function addEmployeeRoles(payload: {
  employeeId: string;
  role: string[];
}) {
  return api("/api/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response;
}

export async function updateEmployeeRole(payload: {
  roleId: string;
  employee_id: string;
  role: string[];
}) {
  if (!payload.roleId) throw new Error("Role ID is required");

  return api(`/api/roles/${payload.roleId}`, {
    method: "PUT",
    body: JSON.stringify({
      employee_id: payload.employee_id,
      role: payload.role,
    }),
  });

  return response;
}

export async function deleteEmployeeRole(roleId: string) {
  if (!roleId) {
    const error = new Error("Role ID is required");
    throw error;
  }

  try {
    const response = await api(`/api/roles/${roleId}`, {
      method: "DELETE",
    });

    
    if (response.data?.deleted_at) {
    } else {
    }

    return response;
  } catch (error: any) {
    console.error("[deleteEmployeeRole] Failed:", error.message);
    console.error("[deleteEmployeeRole] Error details:", error);
    throw error;
  }
}

export async function getDeletedRole(): Promise<EmployeeRole[]> {
  const json = await api("/api/roles-deleted");
  return json.data;
}

export async function restoreDeletedRole(roleId: string): Promise<EmployeeRole> {
  if (!roleId) throw new Error("Role ID is required");

  console.log("API Call - Deleting role ID:", roleId);

  return api(`/api/roles/${roleId}`, {
    method: "DELETE",
  });

  return response.data;
}