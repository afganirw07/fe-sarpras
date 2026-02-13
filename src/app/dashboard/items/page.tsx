"use client"

import { useState, useEffect } from "react";
import TableItems from "@/components/tables/tables-UI/table-items/page";
import DialogAddItems from "@/components/dialog/dialogItems/dialogAddItems";
import { getItems, Item } from "@/lib/items";
import { Package, Layers, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getItems();
      console.log('Response:', response);

      if (response?.data && Array.isArray(response.data)) {
        setItems(response.data);
      } else if (Array.isArray(response)) {
        setItems(response);
      } else {
        console.warn('Invalid response format:', response);
        setItems([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Gagal ambil data items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Hitung total items
  const totalItems = items.length;

  // Hitung total stock
  const totalStock = items.reduce((acc, item) => acc + (item.stock || 0), 0);

  // Hitung jumlah categories unik
  const totalCategories = new Set(items.map((item) => item.category)).size;

  return (
    <>
        {/* Header Card */}
      <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-xs mx-auto">
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

        
        {/* Table */}
        <TableItems/>
         </div>
    </>
  );
}