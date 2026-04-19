import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPages = (): (number | "left-dots" | "right-dots")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "left-dots" | "right-dots")[] = [];

    // Selalu tampilkan halaman pertama
    pages.push(1);

    // ... kiri
    if (currentPage > 2) pages.push("left-dots");

    // 3 halaman sekitar currentPage
    const start = Math.max(2, currentPage - 1);
    const end   = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    // ... kanan
    if (currentPage < totalPages - 2) pages.push("right-dots");

    // Selalu tampilkan halaman terakhir
    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  const btnBase =
    "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors";
  const btnActive  = "bg-blue-600 text-white";
  const btnInactive = "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10";
  const btnDots    = "flex h-9 w-9 items-center justify-center text-gray-400 cursor-default";
  const btnNav     =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 transition-colors";

  return (
    <div className="flex items-center gap-1">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={btnNav}
      >
        ‹
      </button>

      {/* Pages */}
      {pages.map((page) => {
        if (page === "left-dots" || page === "right-dots") {
          return (
            <span key={page} className={btnDots}>
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={btnNav}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;