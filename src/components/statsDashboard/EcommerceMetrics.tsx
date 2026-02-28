"use client";

import React, { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon } from "@/icons";
import { getRooms } from "@/lib/warehouse";
import { getItems } from "@/lib/items";

export const StatsTotal = () => {
  const [totalWarehouse, setTotalWarehouse] = useState<number | null>(null);
  const [totalStock, setTotalStock]         = useState<number | null>(null);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roomsRes, itemsRes] = await Promise.all([
          getRooms(1, 1),    
          getItems(1, 1),    
        ]);

        setTotalWarehouse(roomsRes?.pagination?.total ?? 0);
        setTotalStock(itemsRes?.pagination?.total ?? 0);
      } catch (err) {
        console.error("EcommerceMetrics fetch error:", err);
        setTotalWarehouse(0);
        setTotalStock(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">

      {/* Total Warehouse */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Warehouse
            </span>
            {loading ? (
              <div className="mt-2 h-8 w-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            ) : (
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {totalWarehouse?.toLocaleString("id-ID")}
              </h4>
            )}
          </div>
        </div>
      </div>

      {/* Total Stok Barang */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Jenis Barang
            </span>
            {loading ? (
              <div className="mt-2 h-8 w-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            ) : (
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {totalStock?.toLocaleString("id-ID")}
              </h4>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};