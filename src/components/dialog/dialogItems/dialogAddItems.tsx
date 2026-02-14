"use client";
import { Button } from "../../ui/button";
import { useState, useEffect, useCallback, ReactHTMLElement } from "react";
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
import Input from "@/components/form/input/InputField";
import ButtonTrashed from "@/components/ui/button/trashedButton";
import { getCategories, Category, Subcategory } from "@/lib/category";
import { createItem, Item } from "@/lib/items";
import { z } from "zod";
import { itemSchema } from "@/schema/items.schema";

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

interface ItemFormData {
  code: string;
  name: string;
  category_id: string;
  subcategory_id: string;
  brand: string;
  unit: string;
  stock: number;
}

interface FormErrors {
  code?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  unit?: string;
  stock?: string;
}

export default function DialogAddItems({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithSubcategories[]>([]);
  const [selectedCategorySubcategories, setSelectedCategorySubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ItemFormData>({
    code: "",
    name: "",
    category_id: "",
    subcategory_id: "",
    brand: "",
    unit: "",
    stock: 0,
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategories(1, 100);
      const categoriesData = response.data as CategoryWithSubcategories[];
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  const handleInputChange = (field: keyof ItemFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'category_id') {
      setErrors(prev => ({ ...prev, category: undefined }));
    } else if (field === 'subcategory_id') {
      setErrors(prev => ({ ...prev, subCategory: undefined }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
      subcategory_id: "",
    }));

    setErrors(prev => ({ ...prev, category: undefined, subCategory: undefined }));

    const selectedCategory = categories.find((cat) => cat.id === value);
    if (selectedCategory && selectedCategory.subcategories) {
      setSelectedCategorySubcategories(selectedCategory.subcategories);
    } else {
      setSelectedCategorySubcategories([]);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      setFormData({
        code: "",
        name: "",
        category_id: "",
        subcategory_id: "",
        brand: "",
        unit: "",
        stock: 0,
      });
      setSelectedCategorySubcategories([]);
      setErrors({});
      fetchCategories();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    const validationData = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      category: formData.category_id,
      subCategory: formData.subcategory_id,
      unit: formData.unit.trim(),
      stock: formData.stock,
      brand: formData.brand.trim(),
    };

    console.log("Validation data:", validationData);

    // Validate with Zod
    try {
      itemSchema.parse(validationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          formattedErrors[field] = err.message;
        });
        
        console.log("Validation errors:", formattedErrors);
        setErrors(formattedErrors);
        
        // Show first error in toast
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      const itemData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        brand: formData.brand?.trim() || null,
        unit: formData.unit.trim(),
        stock: formData.stock,
        type: "Loanable",
      };

      console.log("Submitting data:", itemData);

      await createItem(itemData as Item);


      // Reset form
      setFormData({
        code: "",
        name: "",
        category_id: "",
        subcategory_id: "",
        brand: "",
        unit: "",
        stock: 0,
      });
      setSelectedCategorySubcategories([]);
      setErrors({});

      onSuccess?.();

      // Tutup dialog
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error creating item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="font-quicksand text-md bg-blue-600 text-white transition duration-300 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
          >
            + Add Item
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl p-6 dark:bg-black">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Tambah Item Baru</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
              {/* Kode Item */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                <Label>Kode Item *</Label>
                  {errors.code && (
                  <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                )}
                </div>
                <div className={`${errors.code ? 'border-red-500' : ''}`}>
                  <Input
                    placeholder="Kode Item (HURUF BESAR)"
                    defaultValue={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    disabled={loading}
                  />
                </div>
              
              </div>

              {/* Nama Item */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                <Label>Nama Item *</Label>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
                </div>
                <div className={`${errors.name ? 'border-red-500' : ''}`}>
                  <Input
                    placeholder="Nama Item"
                    defaultValue={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={loading}
                  />
                </div>
                
              </div>

              {/* Kategori */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                <Label>Kategori *</Label>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
                </div>
                <Select
                  value={formData.category_id}
                  onValueChange={handleCategoryChange}
                  disabled={loading}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        Kategori tidak ditemukan
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Merek */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                <Label>Merek *</Label>
                 {errors.brand && (
                  <p className="text-xs text-red-500 mt-1">{errors.brand}</p>
                )}
                </div>
                <div className={`${errors.brand ? 'border-red-500' : ''}`}>
                  <Input
                    placeholder="Merek Item"
                    defaultValue={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    disabled={loading}
                  />
                </div>
               
              </div>

              {/* Sub Kategori */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                  <Label>Sub Kategori *</Label>
                  {errors.subCategory && (
                  <p className="text-xs text-red-500 mt-1">{errors.subCategory}</p>
                )} 
                </div>
                <Select
                  value={formData.subcategory_id}
                  onValueChange={(value) =>
                    handleInputChange("subcategory_id", value)
                  }
                  disabled={
                    loading ||
                    !formData.category_id ||
                    selectedCategorySubcategories.length === 0
                  }
                >
                  <SelectTrigger className={errors.subCategory ? 'border-red-500' : ''}>
                    <SelectValue
                      placeholder={
                        !formData.category_id
                          ? "Pilih kategori terlebih dahulu"
                          : selectedCategorySubcategories.length === 0
                          ? "Tidak ada sub kategori"
                          : "Pilih Sub Kategori"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategorySubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
               
              </div>

              {/* Satuan */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                <Label>Satuan *</Label>
                {errors.unit && (
                  <p className="text-xs text-red-500 mt-1">{errors.unit}</p>
                )}
                </div>
                <div className={`${errors.unit ? 'border-red-500' : ''}`}>
                  <Input
                    placeholder="Satuan (pcs, kg, unit, dll)"
                    defaultValue={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    disabled={loading}
                  />
                </div>
                
              </div>

              {/* Stok */}
              <div className="grid gap-2">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-2 items-center">
                  <Label>Stok *</Label>
                  {errors.stock && (
                  <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
                )} 
                  </div>  
                </div>
                <div className={`${errors.stock ? 'border-red-500' : ''}`}>
                  <Input
                    type="number"
                    placeholder="0"
                    defaultValue={formData.stock}
                    onChange={(e) =>
                      handleInputChange("stock", Number(e.target.value))
                    }
                    min="0"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="border border-gray-100 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ButtonTrashed route="items" />
    </>
  );
}