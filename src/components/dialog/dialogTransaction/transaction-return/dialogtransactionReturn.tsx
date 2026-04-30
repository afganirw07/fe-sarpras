"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  getApprovedLoanRequests,
  returnLoanRequest,
  LoanDetailItem,
  ReturnItemEntry,
} from "@/lib/transaction-return";
import { getLoanRequestById } from "@/lib/loan-request";
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
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [selectedLoan, setSelectedLoan]     = useState<any | null>(null);
  const [returnerName, setReturnerName]     = useState(""); // ← ganti jadi text input
  const [kondisiMap, setKondisiMap]         = useState<Record<string, string>>({});
  const [user, setUsers]                    = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const userMap = useMemo(() => {
    if (!Array.isArray(user)) return {};
    return user.reduce((acc, u) => {
      acc[u.id] = u.username;
      return acc;
    }, {} as Record<string, string>);
  }, [user]);

  useEffect(() => {
    if (!open) return;
    setLoadingLoans(true);
    getApprovedLoanRequests()
      .then(setApprovedLoans)
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
      detail.item?.forEach((d: any) => {
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
    if (!selectedLoan)              return toast.error("Pilih transaksi dulu");
    if (!returnerName.trim())       return toast.error("Isi nama yang mengembalikan");
    if (!allKondisiFilled)          return toast.error("Isi semua kondisi item");

    const entries: ReturnItemEntry[] = selectedLoan.item.map(
      (d: LoanDetailItem) => ({ detail_item: d, new_condition: kondisiMap[d.id] })
    );

    try {
      setLoading(true);
      await returnLoanRequest(selectedLoan, entries, returnerName.trim());
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
    setReturnerName("");
    setKondisiMap({});
    setApprovedLoans([]);
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
          + Pengembalian Barang
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
              <Label>Barang Di pinjam</Label>
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
                      {userMap[loan.user_id] ?? "..."} -{" "}
                      {loan.item?.length ?? 0} item
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── Ganti Select → Input text ── */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="returner-name">Yang Mengembalikan</Label>
              <Input
                id="returner-name"
                placeholder="Masukkan nama..."
                value={returnerName}
                onChange={(e) => setReturnerName(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  {["Item ID", "Nama", "Nomor Serial", "Sub Kategori", "Ruangan", "Kondisi"].map((col) => (
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
              disabled={loading || !selectedLoan || !returnerName.trim() || !allKondisiFilled}
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