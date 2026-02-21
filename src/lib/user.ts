import { api } from "./api";

export async function getUsers() {
  const json = await api("/api/users");
  return json.data;
}
