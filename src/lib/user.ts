import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUsers() {
  const json = await api("/api/users");
  return json.data;
}
