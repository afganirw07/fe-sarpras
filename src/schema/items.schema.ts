import { z } from "zod"

export const itemSchema = z.object ({
    name: z.
        string()
        .min(1, "nama tidak boleh kosong")
        .regex(/^[a-zA-Z0-9\s]+$/, "Nama tidak boleh mengandung simbol")
        .max(20, "nama terlalu panjang, buat lebih singkat")
    ,
    code: z.
        string()
        .min(1, "kode tidak boleh kosong")
        .max(10, "Kode terlalu panjang, buat lebih singkat")
        .refine(
            (val) => val === val.toUpperCase(),
                {
                    message: "Seluruh Kode harus menggunakan huruf kapital"
                }
            )
        .regex(/^[a-zA-Z\s]+$/, "Kode tidak boleh mengandung simbol"),
    category: z
        .string()
        .min(1, "Kategori harus di isi"),
    subCategory: z
        .string()
        .min(1, "subKategori harus di isi"),
    unit: z
        .string()
        .min(1, "unit tidak boleh kosong")
        .regex(/^[a-zA-Z0-9]+$/, "unit tidak boleh mengandung simbol")
        .max(6, "Unit terlalu panjang, buat lebih singkat"),
    brand: z
        .string()
        .regex(/^[a-zA-Z0-9\s]+$/, "merek tidak boleh mengandung simbol")
        .min(1, "Merek harus di isi"), 

})

