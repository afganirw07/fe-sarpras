"use client"

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {

  const pathName = usePathname()
  const segments = pathName
    .split("/")
    .filter(Boolean);

    if (pathName === "/dashboard") {
      return null;
    }

  const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  role: "User Role",
  item: "item",
  supplier: "supplier",
  warehouse: "warehouse",
  calendar: "Calendar",
  tambah: "Tambah Data",
};

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2> */}
      <nav>
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/dashboard"
            >
              Dashboard
            </Link>
            </li>
            {segments.slice(1).map((segment, index) => {
              const href = "/" + segments.slice(0, index + 2).join("/");
              return (
           <li key={href} className="flex items-center">
            <ChevronRight size={16} className="mx-1 h-4 w-4 text-gray-600" />
            <Link href={href} className="inline-flex items-center gap-1.5 text-sm text-gray-900 dark:text-gray-400 font-medium">
              {LABELS[segment] ?? segment.replace("-", " ")}
            </Link>
          </li>
              )
            })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
