"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { getDeletedDetailItems } from "@/lib/items";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


type Period = "1M" | "6M" | "1Y";


function getMonthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthRange(months: number): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return result;
}

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
}

const PERIOD_MONTHS: Record<Period, number> = {
  "1M": 1,
  "6M": 6,
  "1Y": 12,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DamagedItemsLineChart() {
  const [allItems, setAllItems]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [period, setPeriod]       = useState<Period>("6M");
  const [isDark, setIsDark]       = useState(false);

  // ── Dark mode detector ────────────────────────────────────────────────────
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // First fetch to get total
        const first = await getDeletedDetailItems(1, 100);
        const total = first?.pagination?.total ?? first?.data?.length ?? 0;
        const totalPages = Math.ceil(total / 100);

        let all = [...(first?.data ?? [])];

        // Fetch remaining pages if more than 1
        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) =>
              getDeletedDetailItems(i + 2, 100)
            )
          );
          rest.forEach((r) => {
            all = [...all, ...(r?.data ?? [])];
          });
        }

        setAllItems(all);
      } catch (err) {
        console.error("DamagedItemsLineChart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Build chart data based on period ─────────────────────────────────────
  const { categories, seriesData, totalCount } = useMemo(() => {
    const months = buildMonthRange(PERIOD_MONTHS[period]);

    // Count damaged items per month
    const countMap: Record<string, number> = {};
    months.forEach((m) => (countMap[m] = 0));

    allItems.forEach((item) => {
      const key = getMonthKey(item.created_at);
      if (countMap[key] !== undefined) {
        countMap[key]++;
      }
    });

    const seriesData = months.map((m) => countMap[m]);
    const categories = months.map(formatMonthLabel);
    const totalCount = seriesData.reduce((a, b) => a + b, 0);

    return { categories, seriesData, totalCount };
  }, [allItems, period]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 400,
      },
    },
    colors: ["#ef4444"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: isDark ? 0.25 : 0.2,
        opacityTo: 0.01,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
      colors: ["#ef4444"],
      strokeColors: isDark ? "#1f2937" : "#ffffff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: (val) => String(Math.round(val)),
        style: {
          colors: isDark ? "#9ca3af" : "#6b7280",
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    grid: {
      borderColor: isDark ? "#1f2937" : "#f3f4f6",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      x: { show: true },
      y: { formatter: (val) => `${val} barang rusak` },
    },
  };

  const series = [{ name: "Barang Rusak", data: seriesData }];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Barang Rusak per Bulan
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Tren kerusakan barang berdasarkan periode
          </p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-white/[0.03]">
          {(["1M", "6M", "1Y"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                period === p
                  ? "bg-white text-gray-800 shadow-sm dark:bg-white/[0.08] dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary badge */}
      {!loading && (
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 items-center rounded-full bg-red-50 px-3 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {totalCount} rusak
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            dalam {PERIOD_MONTHS[period]} bulan terakhir
          </span>
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="flex h-[220px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-500 dark:border-gray-700 dark:border-t-red-400" />
        </div>
      ) : (
        <div className="-ml-3">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={220}
          />
        </div>
      )}
    </div>
  );
}