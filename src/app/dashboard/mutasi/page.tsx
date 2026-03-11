"use client";

import { useMemo, useState, useEffect } from "react";
import TableMutasi from "@/components/tables/tables-UI/table-mutasi/page";
import { getMigrations, ItemMigration } from "@/lib/migration";
import { getRooms, Room } from "@/lib/warehouse";
import { toast } from "sonner";
import {
  ArrowRightLeft,
  BarChart3,
  Search,
  Building2,
} from "lucide-react";
import DialogAddMigration from "@/components/dialog/dialogMigration/dialogaddmigration";

export default function Mutasi() {
  const [migrations, setMigrations] = useState<ItemMigration[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // const fetchAllData = async () => {
  //   try {
  //     const [migRes, roomRes] = await Promise.all([
  //       getMigrations(1, 1000), // fetch semua untuk stat
  //       getRooms(),
  //     ]);
  //     setMigrations(migRes.data ?? []);
  //     setRooms(roomRes.data ?? []);
  //   } catch {
  //     toast.error("Gagal ambil data mutasi");
  //   }
  // };

useEffect(() => {
  const load = async () => {
    try {
      const [migRes, roomRes] = await Promise.all([
        getMigrations(1, 1000),
        getRooms(),
      ]);
      setMigrations(migRes.data ?? []);
      setRooms(roomRes.data ?? []);
    } catch {
      toast.error("Gagal ambil data mutasi");
    }
  };
  load();
}, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const roomMap = useMemo(
    () =>
      rooms.reduce(
        (acc, r) => { acc[r.id] = r.name; return acc; },
        {} as Record<string, string>
      ),
    [rooms]
  );

  const filteredCount = useMemo(() => {
    if (!search) return migrations.length;
    const kw = search.toLowerCase();
    return migrations.filter(
      (m) =>
        m.notes?.toLowerCase().includes(kw) ||
        m.id.toLowerCase().includes(kw) ||
        roomMap[m.from_room_id]?.toLowerCase().includes(kw) ||
        roomMap[m.to_room_id]?.toLowerCase().includes(kw)
    ).length;
  }, [migrations, search, roomMap]);

  const uniqueFromRooms = useMemo(
    () => new Set(migrations.map((m) => m.from_room_id)).size,
    [migrations]
  );

  
  const uniqueToRooms = useMemo(
    () => new Set(migrations.map((m) => m.to_room_id)).size,
    [migrations]
  );

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">

      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <ArrowRightLeft className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Manajemen Mutasi
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola perpindahan item antar ruangan
              </p>
            </div>
          </div>
          <DialogAddMigration onSuccess={handleRefresh} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Total Mutasi
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {migrations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
              <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Dari WH
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uniqueFromRooms}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <ArrowRightLeft className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Ke WH
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uniqueToRooms}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
              <Search className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                Hasil Cari
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredCount}
              </p>
            </div>
          </div>
        </div>

      </div>

      <TableMutasi
        key={refreshKey}
        search={search}
        onSearchChange={setSearch}
      />

    </div>
  );
}