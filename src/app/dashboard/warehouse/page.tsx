"use client"

import TableWarehouse from "@/components/tables/tables-UI/table-warehouse/page"
import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Pencil, 
  Trash2, 
  SquareArrowOutUpRight, 
  Warehouse, 
  Building2, 
  Tag, 
  QrCode,
  Archive
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { getRooms, Room } from "@/lib/warehouse";
import ButtonQrWarehouse from "@/components/button-qr/buttonQrWarehouse";
import { QRCodeCanvas } from "qrcode.react";
import ButtonTrashed from "@/components/ui/button/trashedButton";
import DialogAddWarehouse from "@/components/dialog/dialogWarehouse/dialogaddWarehouse";

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await getRooms();
      setWarehouses(res.data);
    } catch (error: any) {
      toast.error(error?.message || "Gagal mengambil data warehouse");
      console.log("==============================================", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredWarehouses = useMemo(() => {
    const keyword = search.toLowerCase();
    
    return warehouses.filter((warehouse) => {
      return (
        warehouse.code.toLowerCase().includes(keyword) ||
        warehouse.type.toLowerCase().includes(keyword) ||
        warehouse.name.toLowerCase().includes(keyword)
      );
    });
  }, [warehouses, search]);
    return (
        <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-xs mx-auto">
        <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex lg:flex-row flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
                <Warehouse className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                  Manajemen Warehouse
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola data warehouse dan ruangan
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {warehouses.map((w) => (
                <QRCodeCanvas
                  key={w.id}
                  id={`qr-${w.id}`}
                  value={`${window.location.origin}/warehouse/${w.id}`}
                  size={150}
                  className="hidden"
                />
              ))}
              <ButtonQrWarehouse warehouses={warehouses} />
              <DialogAddWarehouse onSuccess={fetchWarehouses} />
              <ButtonTrashed route="/warehouse" />
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Warehouse className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Warehouse</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {warehouses.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-blue-900/30">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Aktif</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {warehouses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900/30">
                <Tag className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kategori</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(warehouses.map(w => w.type)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900/30">
                <Search className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hasil Pencarian</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredWarehouses.length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <TableWarehouse/>
        </div>
    )
}