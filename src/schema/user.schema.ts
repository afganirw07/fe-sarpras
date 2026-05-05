import { z } from "zod";

export const userSchema = z.object({
  userName: z
    .string()
    .min(1, "Username tidak boleh kosong")
    .min(6, "Username minimal 6 karakter"),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong")
    .min(8, "Password minimal 8 karakter")
});