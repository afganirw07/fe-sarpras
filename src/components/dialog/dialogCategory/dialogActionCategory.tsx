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
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Trash2, Pencil } from "lucide-react";
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
import { z } from "zod";
import { categorySchema } from "@/schema/category.schema";

type Subcategory = {
  id: string;
  name: string;
  code: string;
};

interface CategoryError {
  categoryName?: string;
  categoryCode?: string;
  SubcategoryName?: string;
  SubCategoryCode?: string;
}

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
  const [errors, setErrors] = useState<CategoryError>({});

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

  // Handle dialog open/close
  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    
    if (isOpen) {
      // Reset errors when dialog opens
      setErrors({});
    } else {
      // Reset subcategory inputs when dialog closes
      setSubcategoryName("");
      setSubcategoryCode("");
      setErrors({});
    }
  };

  // Handle input change dengan clear error
  const handleInputChange = (field: keyof CategoryError, value: string) => {
    if (field === 'categoryName') setCategoryName(value);
    else if (field === 'categoryCode') setCategoryCode(value);
    else if (field === 'SubcategoryName') setSubcategoryName(value);
    else if (field === 'SubCategoryCode') setSubcategoryCode(value);
    
    // Clear error untuk field yang sedang diubah
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleAddSubcategory = () => {
    // Reset errors untuk subcategory
    setErrors(prev => ({ 
      ...prev, 
      SubcategoryName: undefined, 
      SubCategoryCode: undefined 
    }));

    // Validate subcategory data
    const validationData = {
      categoryName: categoryName.trim(),
      categoryCode: categoryCode.trim(),
      SubcategoryName: subcategoryName.trim(),
      SubCategoryCode: subcategoryCode.trim(),
    };

    console.log("Validation data:", validationData);

    try {
      categorySchema.parse(validationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: CategoryError = {};
        
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof CategoryError;
          // Only show subcategory errors
          if (field === 'SubcategoryName' || field === 'SubCategoryCode') {
            formattedErrors[field] = err.message;
          }
        });
        
        if (Object.keys(formattedErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...formattedErrors }));
          const firstError = Object.values(formattedErrors)[0];
          if (firstError) {
            toast.error(firstError);
          }
          return;
        }
      }
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

  const handleSave = async () => {
    // Reset errors
    setErrors({});

    // Validate category data
    const validationData = {
      categoryName: categoryName.trim(),
      categoryCode: categoryCode.trim(),
      SubcategoryName: subcategoryName.trim() || "dummy",
      SubCategoryCode: subcategoryCode.trim() || "dummy",
    };

    console.log("Validation data:", validationData);

    // Validate with Zod (only category fields)
    try {
      categorySchema.parse(validationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: CategoryError = {};
        
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof CategoryError;
          // Only show category errors
          if (field === 'categoryName' || field === 'categoryCode') {
            formattedErrors[field] = err.message;
          }
        });
        
        if (Object.keys(formattedErrors).length > 0) {
          setErrors(formattedErrors);
          const firstError = Object.values(formattedErrors)[0];
          if (firstError) {
            toast.error(firstError);
          }
          return;
        }
      }
    }

    setLoading(true);
    
    try {
      await updateCategory(categoryId, {
        name: categoryName.trim(),
        code: categoryCode.trim(),
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
      await onSuccess?.();
      setOpen(false);
      setErrors({});
    } catch (error: any) {
      toast.error(error?.message || "Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (id.startsWith("temp")) {
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subkategori dihapus");
      return;
    }

    try {
      await deleteSubcategory(id);
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subkategori berhasil dihapus");
      await onSuccess?.();
    } catch (error) {
      toast.error("Gagal menghapus subkategori");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      await deleteCategory(categoryId);
      toast.success("Kategori berhasil dihapus");
      await onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Gagal menghapus kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      {/* EDIT */}
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button type="button">
                <Pencil size={15} className="cursor-pointer" />
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
              {/* Nama Kategori */}
              <div className="grid w-full max-w-md gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Nama Kategori *</Label>
                  {errors.categoryName && (
                    <p className="text-xs text-red-500">{errors.categoryName}</p>
                  )}
                </div>
                <div className={`${errors.categoryName ? 'border-red-500' : ''}`}>
                  <Input
                    value={categoryName}
                    onChange={(e) => handleInputChange('categoryName', e.target.value)}
                    readOnly={true}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Kode Kategori */}
              <div className="grid w-full max-w-md gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Kode Kategori *</Label>
                  {errors.categoryCode && (
                    <p className="text-xs text-red-500">{errors.categoryCode}</p>
                  )}
                </div>
                <div className={`${errors.categoryCode ? 'border-red-500' : ''}`}>
                  <Input
                    value={categoryCode}
                    onChange={(e) => handleInputChange('categoryCode', e.target.value)}
                    readOnly={true}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Nama Subkategori */}
              <div className="grid w-full max-w-md gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Nama Subkategori</Label>
                  {errors.SubcategoryName && (
                    <p className="text-xs text-red-500">{errors.SubcategoryName}</p>
                  )}
                </div>
                <div className={`${errors.SubcategoryName ? 'border-red-500' : ''}`}>
                  <Input
                    value={subcategoryName}
                    onChange={(e) => handleInputChange('SubcategoryName', e.target.value)}
                    placeholder="Nama subkategori (tanpa simbol)"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Kode Subkategori */}
              <div className="grid w-full max-w-md gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Kode Subkategori</Label>
                  {errors.SubCategoryCode && (
                    <p className="text-xs text-red-500">{errors.SubCategoryCode}</p>
                  )}
                </div>
                <div className={`${errors.SubCategoryCode ? 'border-red-500' : ''}`}>
                  <Input
                    value={subcategoryCode}
                    onChange={(e) => handleInputChange('SubCategoryCode', e.target.value)}
                    placeholder="Kode subkategori"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                type="button"
                className="mt-4 max-w-fit bg-blue-800 text-white hover:bg-blue-900"
                onClick={handleAddSubcategory}
                disabled={loading}
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
                        colSpan={4}
                        className="border px-6 py-6 text-center text-sm text-gray-500 dark:text-white/90"
                      >
                        Tidak ada Subkategori
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
                            disabled={loading}
                          />
                        </TableCell>
                        <TableCell className="light:border-gray-100 font-quicksand border px-4 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                          {subcategory.code}
                        </TableCell>
                        <TableCell className="border px-4 py-4 text-center">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button type="button" disabled={loading}>
                                <Trash2 size={15} className="text-red-600" />
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
                <Button variant="outline" type="button" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-800 text-white hover:bg-blue-900"
              >
                {loading ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button type="button">
                <Trash2 size={15} className="text-red-600" />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua subkategori akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteCategory}
              disabled={loading}
            >
              {loading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}