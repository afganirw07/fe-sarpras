import { z } from "zod"

export const supplierSchema = z.object({
    name: z
        .string()
        .min(1, "Nama suplier harus di isi")
        .regex(/^[a-zA-Z0-9\s]+$/, "nama tidak boleh mengandung simbol"),
    email: z
        .string().email("Format email tidak valid"),
    phoneNumber: z
        .string()
        .min(1, "Nomor telepon suplier harus di isi")
        .max(16, "nomor telepon maximal 16 digit"),
    address: z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, "nama tidak boleh mengandung simbol")
        .min(1, "Alamat harus di isi")

    
})