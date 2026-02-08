"use client";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../../ui/label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import ButtonTrashed from "@/components/ui/button/trashedButton";


export default function DialogAddItems(){
    return(
        <>
                 <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="font-quicksand text-md bg-blue-600 text-white transition duration-300 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                  >
                    + Add Item
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl p-6 dark:bg-black">
                  <form >
                    <DialogHeader>
                      <DialogTitle>Tambah Item Baru</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
                      <div className="grid gap-2">
                        <Label>Kode Item</Label>
                        <Input placeholder="Kode Item" />
                      </div>

                      <div className="grid gap-2">
                        <Label>Nama Item</Label>
                        <Input placeholder="Nama Item" />
                      </div>

                      <div className="grid gap-2">
                        <Label>Kategori</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="elektronik">Elektronik</SelectItem>
                            <SelectItem value="aksesoris">Aksesoris</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Merek</Label>
                        <Input placeholder="Merek Item" />
                      </div>

                      <div className="grid gap-2">
                        <Label>Sub Kategori</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Sub Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a">Sub A</SelectItem>
                            <SelectItem value="b">Sub B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Harga Item</Label>
                        <Input type="number" defaultValue={0} />
                      </div>

                      <div className="grid gap-2">
                        <Label>Satuan</Label>
                        <Input placeholder="Satuan" />
                      </div>

                      <div className="row-span-2 grid gap-2">
                        <Label>Spesifikasi</Label>
                        <TextArea className="h-full min-h-45" />
                      </div>
                    </div>

                    <DialogFooter className="mt-6">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="border border-gray-100 bg-blue-600 hover:bg-blue-700"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <ButtonTrashed route="items" />
        </>
    )
}