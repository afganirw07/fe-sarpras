"use client";
import TableTrancsactionIn from "@/components/tables/tables-UI/table-transaction-in/page";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Search,
  SquareArrowOutUpRight,
  ArrowDownToLine,
  User,
  Package,
  Warehouse,
  Calendar,
  ArrowUpDown,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import Link from "next/link";
import DialogTransactionIn from "@/components/dialog/dialogTransaction/transactionIn/dialogTransactionIn"
import { useEffect } from "react";
import { getTransactions, Transaction } from "@/lib/transaction";
import { useSession } from "next-auth/react";
import ActionButtonIn from "@/components/dialog/dialogTransaction/transactionIn/actionButton";
import { getUsers } from "@/lib/user";

export default function TransactionIn({
  onSuccess,
}: {
  onSuccess?: () => void;
})  {

          const [loading, setLoading] = useState(false);
          const [search, setSearch] = useState("");
          const [users, setUsers] = useState<any[]>([]);
          const [transactions, setTransactions] = useState<Transaction[]>([])
          const [refreshKey, setRefreshKey] = useState(0);
const [currentPage, setCurrentPage] = useState(1)
const limit = 10

const fetchTransaction = async (page = currentPage) => {
  const res = await getTransactions(page, limit)
  setTransactions(res.data)
}

useEffect(() => {
  fetchTransaction()
}, [currentPage])
          
        
          useEffect(() => {
            getUsers().then(setUsers);
          }, []);
          
        

          const filteredTransactions = useMemo(() => {
            const keyword = search.toLowerCase();
            return transactions.filter((trx) => {
              return (
                trx.user_id.toLowerCase().includes(keyword) ||
                trx.type.toLowerCase().includes(keyword) ||
                trx.supplier_id.toLowerCase().includes(keyword) ||
                trx.status.toLowerCase().includes(keyword)
              );
            });
          }, [transactions, search]);
        
          const userMap = useMemo(() => {
            return users.reduce(
              (acc, user) => {
                acc[user.id] = user.username;
                return acc;
              },
              {} as Record<string, string>,
            );
          }, [users]);
        
        
          const totalPending = transactions.filter((t) =>
            t.status.toLowerCase().includes("draft"),
          ).length;
          const totalApproved = transactions.filter(
            (t) =>
              t.status.toLowerCase().includes("approved") ||
              t.status.toLowerCase().includes("received"),
          ).length; 
          
           const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }
        
          return (
                 <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">
                <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-linear-to-br from-sky-500 to-sky-600 p-3 shadow-lg shadow-sky-500/20">
                        <ArrowDownToLine className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                          Data Transaksi
                        </h1>
                        <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                          Kelola riwayat transaksi masuk
                        </p>
                      </div>
                    </div>
                 <DialogTransactionIn onSuccess={handleRefresh}
/>
                  </div>
                </div>
        
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                        <Receipt className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                          Total Transaksi
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {transactions.length}
                        </p>
                      </div>
                    </div>
                  </div>
        
                  <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                          Disetujui
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {totalApproved}
                        </p>
                      </div>
                    </div>
                  </div>
        
                  <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-[clamp(10px,0.7rem,10px)] text-gray-500 dark:text-gray-400">
                          Pending
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {totalPending}
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
                          {filteredTransactions.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
          <TableTrancsactionIn key={refreshKey}
/>
                </div>
    )

}