"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  Search,
  ArrowRightLeft,
  FileX,
  FileText,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { getMigrations, deleteMigration, generateSuratMutasi, ItemMigration } from "@/lib/migration";
import { getRooms, Room } from "@/lib/warehouse";
import { getUsers } from "@/lib/user";
import Pagination from "../../Pagination";
import ActionButtonsMigration from "@/components/dialog/dialogMigration/dialogActionButtonsItems";

interface TableMutasiProps {
  search?: string;
  onSearchChange?: (value: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLetterStatusBadge(status: string | undefined) {
  switch (status) {
    case "done":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
    case "pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TableMutasi({
  search: externalSearch,
  onSearchChange,
}: TableMutasiProps) {
  const [migrations, setMigrations] = useState<ItemMigration[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const limit = 10;

  const search = externalSearch ?? internalSearch;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  useEffect(() => {
    getRooms().then((res) => setRooms(res.data ?? []));
    getUsers().then(setUsers);
  }, []);

  const fetchMigrations = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await getMigrations(page, limit);
      setMigrations(res.data ?? []);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.total);
    } catch {
      toast.error("Gagal mengambil data mutasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMigrations(currentPage);
  }, [currentPage]);

  const roomMap = useMemo(
    () =>
      rooms.reduce(
        (acc, r) => { acc[r.id] = r.name; return acc; },
        {} as Record<string, string>
      ),
    [rooms]
  );

  const userMap = useMemo(
    () =>
      users.reduce(
        (acc, u) => { acc[u.id] = u.username; return acc; },
        {} as Record<string, string>
      ),
    [users]
  );

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return migrations.filter(
      (m) =>
        m.notes?.toLowerCase().includes(kw) ||
        m.id.toLowerCase().includes(kw) ||
        roomMap[m.from_room_id]?.toLowerCase().includes(kw) ||
        roomMap[m.to_room_id]?.toLowerCase().includes(kw)
    );
  }, [migrations, search, roomMap]);

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleDelete = async (id: string) => {
    try {
      await deleteMigration(id);
      toast.success("Mutasi berhasil dihapus");
      fetchMigrations(currentPage);
    } catch {
      toast.error("Gagal menghapus mutasi");
    }
  };

  const handleChecked = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleGenerateSurat = async () => {
    if (selectedIds.size === 0) return;
    setGenerating(true);
    const ids = Array.from(selectedIds);
    let successCount = 0;
    let failCount = 0;

    for (const id of ids) {
      try {
        await generateSuratMutasi(id);
        successCount++;
        setMigrations((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, letter_status: "done" } : m
          )
        );
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } catch {
        failCount++;
        toast.error(`Gagal generate surat untuk ID: ${id}`);
      }
    }

    setGenerating(false);
    if (successCount > 0) toast.success(`${successCount} surat berhasil di-generate`);
    if (failCount > 0) toast.error(`${failCount} surat gagal di-generate`);
  };

  const tableHeaders = [
    "No",
    "Tanggal",
    "Nama Item",
    "Ruangan Asal",
    "Ruangan Tujuan",
    "Dipindahkan Oleh",
    "Catatan",
    "Status Surat",  // ← kolom baru
    "Aksi",
  ];

  return (
    <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">

        {/* Search + Generate Surat */}
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Cari ruangan, catatan..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            {/* Tombol Generate Surat Mutasi */}
            <button
              type="button"
              onClick={handleGenerateSurat}
              disabled={selectedIds.size === 0 || generating}
              className={`
                inline-flex items-center gap-2
                rounded-xl border
                px-2 py-2.5
                text-[clamp(2px,0.85rem,12px)] font-semibold
                shadow-md
                transition-all duration-200
                focus:outline-none focus:ring-4
                whitespace-nowrap
                ${selectedIds.size === 0 || generating
                  ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  : "border-blue-500 bg-blue-600 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 focus:ring-blue-500/20"
                }
              `}
            >
              {generating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              {generating
                ? `Generating... (${selectedIds.size})`
                : selectedIds.size > 0
                ? `Generate Surat (${selectedIds.size})`
                : "Generate Surat Mutasi"}
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  {tableHeaders.map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="bg-linear-to-br from-gray-50 to-gray-100/50  px-2 py-4 text-left  text-[clamp(2px,0.85rem,12px)] font-semibold uppercase tracking-wider text-gray-600 dark:from-white/5 dark:to-white/10 dark:text-gray-300"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <td colSpan={9} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Memuat data...
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <td colSpan={9} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                          <FileX className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {search ? "Data tidak ditemukan" : "Belum ada data mutasi"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {search
                            ? "Coba kata kunci pencarian lain"
                            : "Tambahkan mutasi baru untuk memulai"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                )}

                {!loading &&
                  filtered.map((m, index) => (
                    <TableRow
                      key={m.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      {/* No */}
                      <TableCell className="px-2 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(currentPage - 1) * limit + index + 1}
                        </span>
                      </TableCell>

                      {/* Tanggal */}
                      <TableCell className="px-2 py-4">
                        <span className=" text-[clamp(2px,0.85rem,12px)] text-gray-700 dark:text-gray-300">
                          {formatDate(m.migrated_at)}
                        </span>
                      </TableCell>

                      {/* Nama Item */}
                      <TableCell className="px-2 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 p-2  text-[clamp(2px,0.85rem,12px)] font-semibold text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                          {m.detail_items?.[0]?.item?.name ?? "—"}
                        </span>
                      </TableCell>

                      {/* Dari WH */}
                      <TableCell className="px-2 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1  text-[clamp(2px,0.85rem,12px)] font-semibold text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                          {roomMap[m.from_room_id] ?? (
                            <span className="italic text-gray-400">Loading...</span>
                          )}
                        </span>
                      </TableCell>

                      {/* Ke WH */}
                      <TableCell className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowRightLeft className="h-3.5 w-3.5 text-gray-400" />
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1  text-[clamp(2px,0.85rem,12px)] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {roomMap[m.to_room_id] ?? (
                              <span className="italic text-gray-400">Loading...</span>
                            )}
                          </span>
                        </div>
                      </TableCell>

                      {/* Dipindahkan Oleh */}
                      <TableCell className="px-5 py-4">
                        <span className=" text-[clamp(2px,0.85rem,12px)] text-gray-700 dark:text-gray-300">
                          {userMap[m.migrated_by] ?? (
                            <span className="italic text-xs text-gray-400">Loading...</span>
                          )}
                        </span>
                      </TableCell>

                      {/* Catatan */}
                      <TableCell className="max-w-45 px-5 py-4">
                        <span className="block truncate  text-[clamp(2px,0.85rem,12px)] text-gray-500 dark:text-gray-400">
                          {m.notes ?? (
                            <span className="italic text-gray-300 dark:text-gray-600">—</span>
                          )}
                        </span>
                      </TableCell>

                      {/* Status Surat ← baru */}
                      <TableCell className="px-2 py-4">
                        <span
                          className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${getLetterStatusBadge(m.letter_status)}`}
                        >
                          {m.letter_status ?? "pending"}
                        </span>
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="px-2 py-4">
                        <ActionButtonsMigration
                          mutasi={m}
                          showCheckbox={true}
                          checked={selectedIds.has(m.id)}
                          onCheckedChange={handleChecked}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200/50 p-4 dark:border-white/5">
              <span className=" text-[clamp(2px,0.85rem,12px)] text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, totalItems)} of {totalItems}
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}