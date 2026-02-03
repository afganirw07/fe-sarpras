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
  const maxVisible = 3;

  const startPage = Math.max(
    1,
    Math.min(
      currentPage - 1,
      totalPages - maxVisible + 1
    )
  );

  const endPage = Math.min(
    totalPages,
    startPage + maxVisible - 1
  );

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {startPage > 1 && <span className="px-2">...</span>}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
              page === currentPage
                ? "bg-brand-500 text-white"
                : "text-gray-700 hover:bg-blue-500/[0.08] dark:text-gray-400"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && <span className="px-2">...</span>}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
