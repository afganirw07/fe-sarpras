"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  getApprovedLoanRequests,
  returnLoanRequest,
  LoanDetailItem,
  ReturnItemEntry,
} from "@/lib/transaction-return";
import { getLoanRequestById } from "@/lib/loan-request";
import { getEmployees, Employee } from "@/lib/roles";
import { getUsers, User } from "@/lib/user";

const KONDISI_OPTIONS = ["Good", "Fair", "Poor"] as const;

interface DialogTransactionReturnProps {
  onSuccess?: () => void;
}

export default function DialogTransactionReturn({
  onSuccess,
}: DialogTransactionReturnProps) {
  const router = useRouter();

  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(false);
  const [loadingLoans, setLoadingLoans]   = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [approvedLoans, setApprovedLoans]   = useState<any[]>([]);
  const [employees, setEmployees]           = useState<Employee[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [selectedLoan, setSelectedLoan]     = useState<any | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [kondisiMap, setKondisiMap]         = useState<Record<string, string>>({});
  const [user, setUsers] = useState<User[]>([]);
  // Search state khusus untuk employee select
  const [employeeSearch, setEmployeeSearch] = useState("");

  useEffect(() => {
      getUsers().then(setUsers);
    }, []);

  // ── Filtered employees berdasarkan search ─────────────────────────────────
  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.toLowerCase();
    if (!q) return employees;
    return employees.filter((e) => e.full_name.toLowerCase().includes(q));
  }, [employees, employeeSearch]);

  const userMap = useMemo(() => {
  if (!Array.isArray(user)) return {};
  return user.reduce((acc, u) => {
    acc[u.id] = u.username;
    return acc;
  }, {} as Record<string, string>);
}, [user]);

  // ── Label employee yang terpilih (untuk SelectValue display) ──────────────
  const selectedEmployeeLabel = useMemo(() => {
    return employees.find((e) => e.id === selectedUserId)?.full_name ?? "";
  }, [employees, selectedUserId]);

  useEffect(() => {
    if (!open) return;
    setLoadingLoans(true);
    Promise.all([getApprovedLoanRequests(), getEmployees()])
      .then(([loans, employeesRes]) => {
        setApprovedLoans(loans);
        setEmployees(employeesRes);
      })
      .catch(() => toast.error("Gagal memuat data"))
      .finally(() => setLoadingLoans(false));
  }, [open]);

  const handleSelectLoan = async (loanId: string) => {
    setSelectedLoanId(loanId);
    setSelectedLoan(null);
    setKondisiMap({});
    try {
      setLoadingDetail(true);
      const detail = await getLoanRequestById(loanId);
      setSelectedLoan(detail);
      const defaultMap: Record<string, string> = {};
      detail.item?.forEach((d: LoanDetailItem) => {
        defaultMap[d.id] = d.condition;
      });
      setKondisiMap(defaultMap);
    } catch {
      toast.error("Gagal mengambil detail transaksi");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleKondisiChange = (id: string, val: string) => {
    setKondisiMap((prev) => ({ ...prev, [id]: val }));
  };

  const allKondisiFilled =
    selectedLoan?.item?.length &&
    selectedLoan.item.every((d: LoanDetailItem) => kondisiMap[d.id]);

  const handleSubmit = async () => {
    if (!selectedLoan)     return toast.error("Pilih transaksi dulu");
    if (!selectedUserId)   return toast.error("Pilih user");
    if (!allKondisiFilled) return toast.error("Isi semua kondisi item");

    const entries: ReturnItemEntry[] = selectedLoan.item.map(
      (d: LoanDetailItem) => ({ detail_item: d, new_condition: kondisiMap[d.id] })
    );

    try {
      setLoading(true);
     await returnLoanRequest(selectedLoan, entries, selectedUserId); // pass it here
      toast.success(`${entries.length} item berhasil dikembalikan`);
      resetForm();
      setOpen(false);
      onSuccess?.();
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal return");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedLoanId("");
    setSelectedLoan(null);
    setSelectedUserId("");
    setKondisiMap({});
    setApprovedLoans([]);
    setEmployees([]);
    setEmployeeSearch("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-800 text-white hover:bg-blue-900">
          + Add Transaction Return
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-4xl p-8 dark:bg-black">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl">Add Transaction Return</DialogTitle>
          <DialogDescription>
            Pilih transaksi dan isi kondisi item yang dikembalikan
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">

          {/* SELECT ROW */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* Loan select */}
            <div className="flex flex-col gap-2">
              <Label>Not Returned Transaction</Label>
              <Select
                value={selectedLoanId}
                onValueChange={handleSelectLoan}
                disabled={loadingLoans}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Pilih transaksi" />
                </SelectTrigger>
              <SelectContent>
  {approvedLoans.map((loan) => (
    <SelectItem key={loan.id} value={loan.id}>
      Return -{" "}
      {format(new Date(loan.borrow_date), "dd MMM yyyy", { locale: id })} -{" "}
      {userMap[loan.user_id || "loading"]} -{""}
      {loan.item?.length ?? 0} item 
    </SelectItem>
  ))}
</SelectContent>
              </Select>
            </div>

            {/* Employee select — dengan search */}
            <div className="flex flex-col gap-2">
              <Label>User Yang Mengembalikan</Label>
              <Select
                value={selectedUserId}
                onValueChange={(val) => {
                  setSelectedUserId(val);
                  setEmployeeSearch(""); // reset search setelah pilih
                }}
              >
                <SelectTrigger className="h-11 w-full">
                  {/* Tampilkan nama yang terpilih, bukan value (UUID) */}
                  <SelectValue placeholder="Pilih user">
                    {selectedEmployeeLabel || "Pilih user"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="w-(--radix-select-trigger-width)"
                >
                  {/* Search input */}
                  <div className="sticky top-0 z-10 bg-white dark:bg-black px-2 pb-2 pt-1">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        placeholder="Cari employee..."
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  {/* Employee list */}
                  <div className="max-h-52 overflow-y-auto">
                    {filteredEmployees.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        Employee tidak ditemukan
                      </div>
                    ) : (
                      filteredEmployees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.full_name}
                        </SelectItem>
                      ))
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  {["Item ID", "Name", "SN", "Subcategory", "WH", "Condition"].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingDetail ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      <Loader2 className="animate-spin mx-auto" size={18} />
                    </td>
                  </tr>
                ) : !selectedLoan ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                      Pilih transaksi untuk melihat item
                    </td>
                  </tr>
                ) : selectedLoan.item?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                      Tidak ada item
                    </td>
                  </tr>
                ) : (
                  selectedLoan.item.map((d: LoanDetailItem) => (
                    <tr
                      key={d.id}
                      className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500">{d.item?.id?.slice(0, 8)}</td>
                      <td className="px-4 py-3 font-medium">{d.item?.name}</td>
                      <td className="px-4 py-3 text-gray-500">{d.serial_number}</td>
                      <td className="px-4 py-3 text-gray-500">{d.item?.subcategory?.name}</td>
                      <td className="px-4 py-3 text-gray-500">{d.room?.name}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={kondisiMap[d.id]}
                          onValueChange={(val) => handleKondisiChange(d.id, val)}
                        >
                          <SelectTrigger className="h-8 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {KONDISI_OPTIONS.map((k) => (
                              <SelectItem key={k} value={k}>{k}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>Close</Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedLoan || !selectedUserId || !allKondisiFilled}
              className="bg-blue-800 px-6 text-white hover:bg-blue-900 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}