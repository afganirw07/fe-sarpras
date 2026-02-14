import { z } from "zod";

export const userSchema = z.object({
  userName: z
    .string()
    .min(1, "Username tidak boleh kosong")
    .min(6, "Username minimal 6 karakter")
    .regex(/^[a-zA-Z0-9]+$/, "nama tidak boleh mengandung simbol"),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong")
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung angka")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung simbol"),
});