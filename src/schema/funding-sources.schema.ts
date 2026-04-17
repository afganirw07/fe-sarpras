// @/schema/funding-source.schema.ts
import { z } from "zod";

export const FundingSourceSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tidak boleh kosong")
    .max(100, "Nama maksimal 100 karakter")
    .regex(/^[a-zA-Z0-9\s]+$/, "Nama tidak boleh mengandung simbol"),

  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .regex(/^[a-zA-Z0-9\s]*$/, "Deskripsi tidak boleh mengandung simbol")
    .optional(),

    email: z
    .string()
    .email("Format email tidak valid")
    .max(100, "Email maksimal 100 karakter"),

    phone_number: z
    .string()
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^[0-9+\s()-]+$/, "Nomor telepon hanya boleh mengandung angka, spasi, dan simbol +()-"),
});

export type FundingSourcePayload = z.infer<typeof FundingSourceSchema>;