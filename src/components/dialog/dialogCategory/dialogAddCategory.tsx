import React, { ReactElement } from "react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useState } from "react";
import { createCategory, createSubcategory } from "@/lib/category";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { categorySchema } from "@/schema/category.schema";

interface SubcategoryTableItem {
  id: string;
  name: string;
  code: string;
}

interface CategoryError {
  categoryName?: string;
  categoryCode?: string;
  SubcategoryName?: string;
  SubCategoryCode?: string;
}

export default function DialogCategory({onSuccess}: {onSuccess?: () => void}) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryCode, setSubcategoryCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<CategoryError>({});
  const [subcategories, setSubcategories] = useState<SubcategoryTableItem[]>([]);

  const resetForm = () => {
    setCategoryName("");
    setCategoryCode("");
    setSubcategoryName("");
    setSubcategoryCode("");
    setSubcategories([]);
    setErrors({});
  };

  // Handle dialog open/close
  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    setOpen(isOpen);
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
        id: `${prev.length + 1}`,
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

    // Validate all fields
    const validationData = {
      categoryName: categoryName.trim(),
      categoryCode: categoryCode.trim(),
      SubcategoryName: subcategoryName.trim() || "dummy", // Dummy value if empty
      SubCategoryCode: subcategoryCode.trim() || "dummy",
    };

    // Check if required fields are filled
    if (!categoryName.trim() || !categoryCode.trim()) {
      const newErrors: CategoryError = {};
      if (!categoryName.trim()) newErrors.categoryName = "Nama kategori harus di isi";
      if (!categoryCode.trim()) newErrors.categoryCode = "Kode wajib diisi";
      
      setErrors(newErrors);
      toast.error("Nama & kode kategori wajib diisi");
      return;
    }

    // Validate with Zod
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

    if (subcategories.length === 0) {
      toast.error("Minimal 1 subkategori");
      return;
    }

    try {
      setLoading(true);

      const categoryRes = await createCategory({
        name: categoryName.trim(),
        code: categoryCode.trim(),
      });

      const categoryId = categoryRes.data.id;
      for (const sub of subcategories) {
        await createSubcategory({
          category_id: categoryId,
          name: sub.name,
          code: sub.code,
        });
      }

      toast.success("Kategori & Subkategori berhasil dibuat");
      await onSuccess?.();
      
      resetForm();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = (id: string) => {
    setSubcategories((prev) => prev.filter((item) => item.id !== id));
    toast.success("Subkategori dihapus");
  };

  return (
    <div className="flex flex-col items-end justify-end gap-2 md:flex-row lg:items-center">
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button
            size={"lg"}
            className="font-quicksand text-md bg-blue-800 text-white transition duration-300 hover:bg-blue-900"
          >
            + Add Kategori
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-y-auto p-6 dark:bg-black">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold">
              Add Kategori
            </DialogTitle>
          </DialogHeader>
          
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
                  placeholder="Nama kategori (tanpa simbol)"
                  value={categoryName}
                  onChange={(e) => handleInputChange('categoryName', e.target.value)}
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
                  placeholder="Kode (HURUF BESAR, angka, strip)"
                  value={categoryCode}
                  onChange={(e) => handleInputChange('categoryCode', e.target.value)}
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
                  placeholder="Nama subkategori (tanpa simbol)"
                  value={subcategoryName}
                  onChange={(e) => handleInputChange('SubcategoryName', e.target.value)}
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
                  placeholder="Kode subkategori"
                  value={subcategoryCode}
                  onChange={(e) => handleInputChange('SubCategoryCode', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              type="button"
              className="max-w-fit bg-blue-800 text-white hover:bg-blue-900 mt-4"
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
                    Nama Subcategory
                  </TableCell>
                  <TableCell
                    isHeader
                    className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                  >
                    Kode Subcategory
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
                  subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                      <TableCell className="light:border-gray-100 border px-6 py-4">
                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {subcategory.id}
                        </span>
                      </TableCell>
                      <TableCell className="light:border-gray-100 font-quicksand border px-4 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                        {subcategory.name}
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
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-800 hover:bg-blue-900 text-white transition duration-300"
            >
              {loading ? "Menyimpan..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}