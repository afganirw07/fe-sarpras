import { z } from "zod"

export const supplierSchema = z.object({
    name: z
        .string()
        .min(1, "Nama suplier harus di isi")
        .regex(/^[a-zA-Z0-9\s]+$/, "nama tidak boleh mengandung simbol"),
    address: z
        .string()
        .regex(/^[a-zA-Z0-9\s]+$/, "nama tidak boleh mengandung simbol")
        .min(1, "Alamat harus di isi")

    
})