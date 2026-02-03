"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
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
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Trash2, Pencil, SquareArrowOutUpRight } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  updateCategory,
  createSubcategory,
  getCategoryById,
  getSubcategoriesByCategoryId,
  updateSubcategory,
  deleteSubcategory,
  deleteCategory,
} from "@/lib/category";

import Link from "next/link";

type Subcategory = {
  id: string;
  name: string;
  code: string;
};

export default function ActionButtonsCategory({
  categoryId,
  onSuccess
}: {
  categoryId: string;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryCode, setSubcategoryCode] = useState("");
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const handleAddSubcategory = () => {
    if (!subcategoryName || !subcategoryCode) {
      toast.error("Subkategori belum lengkap");
      return;
    }

    setSubcategories((prev) => [
      ...prev,
      {
        id: `temp-${crypto.randomUUID()}`,
        name: subcategoryName,
        code: subcategoryCode,
      },
    ]);

    setSubcategoryName("");
    setSubcategoryCode("");
  };

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const category = await getCategoryById(categoryId);
        const subs = await getSubcategoriesByCategoryId(categoryId);

        if (category) {
          setCategoryName(category.name);
          setCategoryCode(category.code);
        }

        setSubcategories(
          subs.map((s) => ({
            id: s.id,
            name: s.name,
            code: s.code,
          })),
        );
      } catch {
        toast.error("Gagal mengambil data kategori");
      }
    };

    fetchData();
  }, [open, categoryId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateCategory(categoryId, {
        name: categoryName,
        code: categoryCode,
      });

      const newSubs = subcategories.filter((s) => s.id.startsWith("temp"));

      await Promise.all(
        newSubs.map((s) =>
          createSubcategory({
            category_id: categoryId,
            name: s.name,
            code: s.code,
          }),
        ),
      );

      const existingSubs = subcategories.filter(
        (s) => !s.id.startsWith("temp"),
      );

      await Promise.all(
        existingSubs.map((s) =>
          updateSubcategory(s.id, {
            category_id: categoryId,
            name: s.name,
            code: s.code,
          }),
        ),
      );

      toast.success("Kategori berhasil disimpan");
      await onSuccess?.()
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (id.startsWith("temp")) {
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      return;
    }

    try {
      await deleteSubcategory(id);

      setSubcategories((prev) => prev.filter((s) => s.id !== id));

      toast.success("Subkategori berhasil dihapus");
      await onSuccess?.()
    } catch (error) {
      toast.error("Gagal menghapus subkategori");
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button type="button">
                <Pencil size={16} className="cursor-pointer" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-y-auto p-6 dark:bg-black">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold">
              Edit Kategori
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="grid w-full max-w-md gap-2">
                <Label>Nama Kategori</Label>
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  readOnly={true}
                />
              </div>
              <div className="grid w-full max-w-md gap-2">
                <Label>Kode Kategori</Label>
                <Input
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value)}
                  readOnly={true}
                />
              </div>
              <div className="grid w-full max-w-md gap-2">
                <Label>Nama Subkategori</Label>
                <Input
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-md gap-2">
                <Label>Kode Subkategori</Label>
                <Input
                  value={subcategoryCode}
                  onChange={(e) => setSubcategoryCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                type="button"
                className="mt-4 max-w-fit bg-blue-800 text-white hover:bg-blue-900"
                onClick={handleAddSubcategory}
              >
                Add Subkategori
              </Button>
            </div>

            <div className="relative overflow-x-auto">
              <Table className="w-full max-w-sm table-auto ">
                <TableHeader className="">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="min-w-7.5 rounded-b-none rounded-l-md border border-r-0 bg-blue-800 px-6 py-3 text-xs font-medium text-gray-200"
                    >
                      No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                    >
                      Nama Subkategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                    >
                      Kode Subkategori
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-7.5 rounded-b-none rounded-r-md border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {subcategories.length === 0 ? (
                    <TableRow>
                      <td
                        colSpan={6}
                        className="border px-6 py-6 text-center text-sm text-gray-500 dark:text-white/90"
                      >
                        Tidak ada Kategori
                      </td>
                    </TableRow>
                  ) : (
                    subcategories.map((subcategory, index) => (
                      <TableRow key={subcategory.id}>
                        <TableCell className="light:border-gray-100 border px-6 py-4">
                          <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="light:border-gray-100 font-quicksand border px-4 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                          <Input
                            value={subcategory.name}
                            onChange={(e) =>
                              setSubcategories((prev) =>
                                prev.map((s) =>
                                  s.id === subcategory.id
                                    ? { ...s, name: e.target.value }
                                    : s,
                                ),
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="light:border-gray-100 font-quicksand border px-4 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                          {subcategory.code}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-center">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button type="button">
                                <Trash2 size={16} className="text-red-600" />
                              </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus Subkategori?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Data ini akan dihapus permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white"
                                  onClick={() =>
                                    handleDeleteSubcategory(subcategory.id)
                                  }
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-800 text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button type="button">
                <Trash2 size={16} className="text-red-600" />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua subkategori akan ikut terhapus
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white"
              onClick={async () => {
                try {
                  await deleteCategory(categoryId);
                  toast.success("Kategori berhasil dihapus");
                  await onSuccess?.()
                } catch {
                  toast.error("Gagal menghapus kategori");
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
