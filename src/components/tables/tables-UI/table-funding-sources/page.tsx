"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Search, Banknote } from "lucide-react";
import { toast } from "sonner";
import ActionButtonsFundingSource from "@/components/dialog/dialogFundingSources/dialogActionFunding";
import { getFundingSources, FundingSource } from "@/lib/funding-sources";
import Pagination from "../../Pagination";

type FundingSourceStats = {
  totalFundingSource: number;
  totalActive: number;
  totalSearch: number;
};

export default function TableFundingSource({
  onStatsUpdate,
  onDataUpdate,
}: {
  onStatsUpdate?: (stats: FundingSourceStats) => void;
  onDataUpdate?: (fundingSources: FundingSource[]) => void;
}) {
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 3;

  const fetchFundingSources = async (page = currentPage) => {
    try {
      setLoading(true);
     const res = await getFundingSources(page, perPage);

const data = res.data?.fundingSource || [];
console.log("FULL DATA:", res.data);

setFundingSources(data);
setTotalPages(res.data?.totalPages || 1);
setTotalItems(res.data?.totalFundingSource || 0);

onStatsUpdate?.({
  totalFundingSource: res.data.totalFundingSource,
  totalActive: data.length,
  totalSearch: data.length,
});

onDataUpdate?.(data); // ✅ cukup ini
    //   onDataUpdate?.(res.data);
    } catch (error: any) {
      toast.error(error?.message || "Gagal mengambil data funding source");
      onStatsUpdate?.({ totalFundingSource: 0, totalActive: 0, totalSearch: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingSources(currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredFundingSources = useMemo(() => {
    const keyword = search.toLowerCase();
    return fundingSources.filter((fs) =>
      fs.name.toLowerCase().includes(keyword) ||
      fs.description?.toLowerCase().includes(keyword)
    );
  }, [fundingSources, search]);

  useEffect(() => {
    if (fundingSources.length === 0) return;
    onStatsUpdate?.({
      totalFundingSource: totalItems,
      totalActive: fundingSources.length,
      totalSearch: filteredFundingSources.length,
    });
  }, [filteredFundingSources, totalItems, fundingSources]);

  return (
    <div className="w-full lg:max-w-7xl md:max-w-2xl max-w-xs">
      <div className="rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/5 dark:bg-white/5">
        {/* Search Bar */}
        <div className="border-b border-gray-200/50 p-6 dark:border-white/5">
          <div className="relative w-full md:w-80">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Cari funding source atau deskripsi..."
              value={search}
              onChange={handleSearch}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-white/5">
                  <TableCell isHeader className="w-20 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300">
                    No
                  </TableCell>
                  <TableCell isHeader className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300">
                    Nama
                  </TableCell>
                  <TableCell isHeader className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300">
                    Email
                  </TableCell>
                  <TableCell isHeader className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300">
                    Telepon
                  </TableCell>
                  <TableCell isHeader className="bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300">
                    Deskripsi
                  </TableCell>
                  <TableCell isHeader className="w-32 bg-linear-to-br from-gray-50 to-gray-100/50 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:from-white/5 dark:to-white/10 dark:text-gray-300">
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <td colSpan={4} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                      </div>
                    </td>
                  </TableRow>
                ) : filteredFundingSources.length === 0 ? (
                  <TableRow>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-white/5">
                          <Banknote className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {search ? "Data tidak ditemukan" : "Tidak ada funding source"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {search ? "Coba kata kunci pencarian lain" : "Tambahkan funding source baru untuk memulai"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  filteredFundingSources.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="px-6 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 lg:text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {(currentPage - 1) * perPage + index + 1}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center lg:text-[.9rem] font-semibold text-black ">
                            {item.name}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <span className="lg:text-xs text-gray-700 dark:text-gray-300">
                          {item.email}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <span className="lg:text-xs text-gray-700 dark:text-gray-300">
                          {item.phone_number}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <span className="lg:text-xs text-gray-700 dark:text-gray-300">
                          {item.description ?? (
                            <span className="italic text-gray-400">Tidak ada deskripsi</span>
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <ActionButtonsFundingSource
                          fundingSource={item}
                          onSuccess={fetchFundingSources}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between p-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Showing {(currentPage - 1) * perPage + 1} –{" "}
                  {Math.min(currentPage * perPage, totalItems)} of {totalItems}
                </span>
                <span className="text-gray-400">|</span>
                <span>{perPage} rows per page</span>
              </div>
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