import { z } from "zod"

export const WareHouseSchema = z.object({
    code: z
    .string()
    .min(1, "kode suplier harus di isi")
    .regex(/^[a-zA-Z0-9]+$/, "kode tidak boleh mengandung simbol")
    .refine(
            (val) => val === val.toUpperCase(),
                {
                    message: "Seluruh Kode harus menggunakan huruf kapital",
                }
    ),
    type: z
    .string()
    .min(1, "tipe suplier harus di isi"),

    name: z
    .string()
    .min(1, "kode suplier harus di isi")
    .regex(/^[a-zA-Z0-9\s]+$/, "kode tidak boleh mengandung simbol")

})