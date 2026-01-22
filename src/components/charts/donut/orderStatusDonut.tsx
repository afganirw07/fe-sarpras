"use client";

import Chart from "react-apexcharts";

export default function OrderStatusDonut() {
  const series = [45, 30, 15, 10];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Delivered", "Pending", "Canceled", "Returned"],
    colors: ["#22c55e", "#f59e0b", "#ef4444", "#6366f1"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white dark:bg-black p-6 pb-18 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Order Status
      </h4>

      <Chart options={options} series={series} type="pie" height={320} />
    </div>
  );
}
