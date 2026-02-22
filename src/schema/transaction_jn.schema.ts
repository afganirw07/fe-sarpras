import { z } from "zod"

export const tansactionInSchema = z.object({
    poNumber : z
    .number()
    .min(1, "po number wajib di isi")
    ,
    warehouse : z
    .string()
    .min(1, "pilih warehouse terlebih dahulu")
    ,
    categori : z 
    .string()
    .min(1, "pilih kategori terlebih dahulu")
    ,
    detailTransaction : z
    .string()
    .min(1, "detail transaksi wajib di isi")
    ,
    supplier : z 
    .string()
    .min(1, "pilih kategori terlebih dahulu")
    ,
    items : z 
    .string()
    .min(1, "pilih item terlebih dahulu")
    ,

})