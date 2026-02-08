"use client"

import { useMemo } from "react";
import TableKategori from "@/components/tables/tables-UI/table-kategori/page"
import { useEffect, useState } from "react";
import {
  getCategories,
  Category,
  Subcategory,
  getSubcategories,
} from "@/lib/category";
import { toast } from "sonner";
import {
  Search,
  Pencil,
  Trash2,
  SquareArrowOutUpRight,
  ArrowRightFromLine,
  FolderOpen,
  Tag,
  Building2,
  List,
} from "lucide-react";
import DialogCategory from "@/components/dialog/dialogCategory/dialogAddCategory";
import ButtonTrashed from "@/components/ui/button/trashedButton";

export default function Kategori() {
    
    const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [catsRes, subsRes] = await Promise.all([
        getCategories(),
        getSubcategories(),
      ]);

      setCategories(catsRes.data);
      setSubcategories(subsRes.data);
    } catch {
      toast.error("Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("SUBCATEGORIES UPDATED:", subcategories);
  }, [subcategories]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCategories = useMemo(() => {
    const keyword = search.toLowerCase();

    return categories.filter((category) => {
      const matchesCategory =
        category.name.toLowerCase().includes(keyword) ||
        category.code.toLowerCase().includes(keyword) ||
        (category.instansi?.toLowerCase().includes(keyword) ?? false);

      const matchesSubcategory = subcategories
        .filter((sub) => sub.category_id === category.id)
        .some(
          (sub) =>
            sub.name.toLowerCase().includes(keyword) ||
            sub.code.toLowerCase().includes(keyword),
        );

      return matchesCategory || matchesSubcategory;
    });
  }, [categories, subcategories, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredCategories.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCategories, currentPage]);

    return (
        <div className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-7xl">
      <div className="mb-6 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br rounded-xl from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/20">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-figtree text-2xl font-bold text-gray-900 dark:text-white">
                Manajemen Kategori
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola kategori dan subkategori
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DialogCategory onSuccess={fetchAllData} />
            <ButtonTrashed route="kategori" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Kategori
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Subkategori
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subcategories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
              <Tag className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hasil Pencarian
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredCategories.length}
              </p>
            </div>
          </div>
        </div>
      </div>
        <TableKategori />
    </div>
    )
}