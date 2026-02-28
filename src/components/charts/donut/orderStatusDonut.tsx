"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { getTransactions } from "@/lib/transaction";
import { getLoanRequests } from "@/lib/loan-request";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OrderStatusDonut() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans]               = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isDark, setIsDark]             = useState(false);

  // ── Detect dark mode (same pattern as MonthlySalesChart) ─────────────────
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ── Fetch data ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [txRes, loanRes] = await Promise.all([
          getTransactions(1, 100),
          getLoanRequests(1, 100),
        ]);
        setTransactions(txRes?.data  ?? (Array.isArray(txRes)   ? txRes   : []));
        setLoans(loanRes?.data       ?? (Array.isArray(loanRes) ? loanRes : []));
      } catch (err) {
        console.error("Donut fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Series ────────────────────────────────────────────────────────────────
  const series = useMemo(() => {
    const masuk        = transactions.filter((t) => t.type === "In").length;
    const dipinjam     = loans.filter((l) => l.status === "borrowed").length;
    const dikembalikan = loans.filter((l) => l.status === "returned").length;
    return [masuk, dipinjam, dikembalikan];
  }, [transactions, loans]);

  // ── Options (reactive to isDark) ──────────────────────────────────────────
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      background: "transparent",
    },
    labels: ["Barang Masuk", "Dipinjam", "Dikembalikan"],
    colors: ["#6366f1", "#3b82f6", "#10b981"],
    legend: {
      show: true,
      position: "bottom",
      fontSize: "13px",
      fontFamily: "Outfit, sans-serif",
      labels: {
        colors: isDark ? "#9ca3af" : "#6b7280",
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
              fontFamily: "Outfit, sans-serif",
              color: isDark ? "#9ca3af" : "#6b7280",
            },
            value: {
              show: true,
              fontSize: "22px",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              color: isDark ? "#f9fafb" : "#111827",
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              fontFamily: "Outfit, sans-serif",
              color: isDark ? "#9ca3af" : "#6b7280",
              formatter: (w) =>
                String(
                  w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                  )
                ),
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (val) => `${val} transaksi` },
    },
  };

  // ── Legend items ──────────────────────────────────────────────────────────
  const legendItems = [
    { label: "Barang Masuk", value: series[0], color: "bg-indigo-500" },
    { label: "Dipinjam",     value: series[1], color: "bg-blue-500"   },
    { label: "Dikembalikan", value: series[2], color: "bg-emerald-500" },
  ];

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
        Distribusi Transaksi
      </h4>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Barang masuk &amp; status peminjaman
      </p>

      {loading ? (
        <div className="flex h-[280px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500 dark:border-gray-700 dark:border-t-indigo-400" />
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={280}
        />
      )}

      {/* Manual legend detail */}
      {!loading && (
        <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 dark:border-gray-800">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-white/80">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}