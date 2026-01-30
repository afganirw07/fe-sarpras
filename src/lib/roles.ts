import { api } from "./api";

export interface Employee {
  id: string;
  full_name: string;
  role: string[];
}

export interface EmployeeRole {
  full_name: string;
  id: string;
  employee_id: string;
  employeeId: string;
  roles: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export async function getEmployeeRoles() {
  const json = await api("/roles");
  return json.data;
}

export async function getEmployees(): Promise<Employee[]> {
  const json = await api("/employees");
  return json.data.map((item: any) => ({
    id: item.id,
    full_name: item.full_name,
    role: Array.isArray(item.role?.roles)
      ? item.role.roles
      : Array.isArray(item.role)
      ? item.role
      : [],
  }));
}

export async function addEmployeeRoles(payload: {
  employeeId: string;
  role: string[];
}) {
  return api("/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });

}

export async function updateEmployeeRole(payload: {
  roleId: string;
  employee_id: string;
  role: string[];
}) {
  if (!payload.roleId) throw new Error("Role ID is required");

  return api(`/roles/${payload.roleId}`, {
    method: "PUT",
    body: JSON.stringify({
      employee_id: payload.employee_id,
      role: payload.role,
    }),
  });
}



export async function deleteEmployeeRole(roleId: string) {
  if (!roleId) throw new Error("Role ID is required");

  console.log("API Call - Deleting role ID:", roleId);

  return api(`/roles/${roleId}`, {
    method: "DELETE",
  });
}




