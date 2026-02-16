
import {z} from "zod"

export const categorySchema = z.object({
    categoryName: z
        .string()
        .min(1, "Nama kategori harus di isi")
        .regex(/^[a-zA-Z0-9\s]+$/, "nama kategori tidak boleh mengandung simbol"),
    categoryCode: z
            .string()
            .min(1, "Kode wajib diisi")
            .regex(
             /^[A-Z0-9-]+$/,
            "Kode hanya boleh huruf besar, angka, dan tanda strip (-)"
            ),
    SubcategoryName : z
        .string()
        .min(1, "Nama subkategori harus di isi")
        .regex(/^[a-zA-Z0-9\s]+$/, "nama kategori tidak boleh mengandung simbol"),
    SubCategoryCode : z
        .string()
        .min(1, "kode subkategori harus di isi")
        .regex(/^[a-zA-Z0-9\s]+$/, "nama kategori tidak boleh mengandung simbol"),
            

    
})