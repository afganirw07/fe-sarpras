import TableItems from "@/components/tables/tables-UI/table-items/page";
import DetailItem from "@/components/detail-item/page"
import DialogAddItems from "@/components/dialog/dialogItems/dialogAddItems";
import { Item } from "@/lib/items";
import { Package, Layers, TrendingUp } from "lucide-react";

export default function ItemPage () {

       const tableData: Item[] = [
      {
        id: "13131313",
        code: "ITM001",
        name: "Laptop",
        brand: "Dell",
        subCategory: "OS-4220",
        price: 120000,
        category: "Elektronik",
        unit: 25,
      },
      {
        id: "31414424",
        code: "ITM002",
        name: "Monitor",
        brand: "LG",
        subCategory: "OS-422",
        price: 120000,
        category: "Elektronik",
        unit: 40,
      },
      {
        id: "151132163",
        code: "ITM003",
        name: "PC",
        brand: "Logitech",
        subCategory: "OS-422",
        price: 120000,
        category: "Aksesoris",
        unit: 15,
      },
      {
        id: "13414669",
        code: "ITM004",
        name: "PC",
        brand: "Logitech",
        subCategory: "OS-422",
        price: 120000,
        category: "Aksesoris",
        unit: 30,
      },
      {
        id: "1313456613",
        code: "ITM005",
        name: "PC",
        brand: "HP",
        subCategory: "OS-422",
        price: 120000,
        category: "Elektronik",
        unit: 12,
      },
    ];


  const totalItems = tableData.length;
  const totalStock = tableData.reduce((acc, item) => acc + item.unit, 0);

    return(
        <>
        <div className="  flex flex-col min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 md:p-8 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
                {/* Header Card */}
        <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                  Data Item
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola inventori dan stok barang
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <DialogAddItems/>
            </div>
          </div>
        </div>
             {/* Stats Cards */}
        <div className="w-full mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalItems}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalStock}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(tableData.map((item) => item.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
        <TableItems/>
        </div>
        </>
    );
}