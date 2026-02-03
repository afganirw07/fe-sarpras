import React, { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { createCategory, createSubcategory } from "@/lib/category";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DialogCategory({onSuccess}: {onSuccess?: () => void}) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryCode, setSubcategoryCode] = useState("");
  const [open, setOpen] = useState(false);
  const [subcategoryType, setSubcategoryType] = useState<
    "" | "Consumable" | "Loanable"
  >("Consumable");

  const [loading, setLoading] = useState(false);
  interface SubcategoryTableItem {
    id: string;
    name: string;
    code: string;
    type: "Consumable" | "Loanable";
  }

  const resetForm = () => {
    setCategoryName("");
    setCategoryCode("");
    setSubcategoryName("");
    setSubcategoryCode("");
    setSubcategoryType("");
    setSubcategories([]);
  };

  const [subcategories, setSubcategories] = useState<SubcategoryTableItem[]>(
    [],
  );
  const handleAddSubcategory = () => {
    if (!subcategoryName || !subcategoryCode || !subcategoryType) {
      toast.error("Lengkapi data subkategori");
      return;
    }

    setSubcategories((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        name: subcategoryName,
        code: subcategoryCode,
        type: subcategoryType,
      },
    ]);
    console.log("SEND TYPE:", subcategoryType);
    
    setSubcategoryName("");
    setSubcategoryCode("");
    setSubcategoryType("");
  };

  const handleSave = async () => {
    if (!categoryName || !categoryCode) {
      toast.error("Nama & kode kategori wajib diisi");
      return;
    }

    if (subcategories.length === 0) {
      toast.error("Minimal 1 subkategori");
      return;
    }

    try {
      setLoading(true);

      const categoryRes = await createCategory({
        name: categoryName,
        code: categoryCode,
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
    await onSuccess?.()
      console.log("CATEGORY & SUBCATEGORY CREATED", categoryRes, subcategories);
      setCategoryName("");
      setCategoryCode("");
      setSubcategoryName("");
      setSubcategoryCode("");
      setSubcategoryType("");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan");
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
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
          }
          setOpen(isOpen);
        }}
      >
        <form>
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
              <div className="grid w-full max-w-md gap-2">
                <Label>Nama Kategori</Label>
                <Input
                  placeholder="Nama kategori"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-md gap-2">
                <Label>Kode Kategori</Label>
                <Input
                  placeholder="Kode kategori"
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-md gap-2">
                <Label>Nama Subkategori</Label>
                <Input
                  placeholder="Nama subkategori"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-md gap-2">
                <Label>Kode Subkategori</Label>
                <Input
                  placeholder="Kode subkategori"
                  value={subcategoryCode}
                  onChange={(e) => setSubcategoryCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                type="button"
                className="max-w-fit bg-blue-800 text-white hover:bg-blue-900 mt-4"
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
                      Kode
                    </TableCell>
                    <TableCell
                      isHeader
                      className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                    >
                      Nama
                    </TableCell>

                    <TableCell
                      isHeader
                      className="min-w-55 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                    >
                      Subcategory
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
                        <TableCell className="light:border-gray-100 font-quicksand border px-4 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                          {subcategory.type}
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
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-800 hover:bg-blue-900 text-white transition duration-300"
              >
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
