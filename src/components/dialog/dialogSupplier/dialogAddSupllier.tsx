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
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Textarea } from "@/components/ui/textarea";
export default function DialogAddSupplier () {
    return (
        <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
                    <Dialog>
                      <form >
                        <DialogTrigger asChild>
                          <Button
                            size={"lg"}
                            className="font-quicksand text-md bg-blue-800 text-white transition duration-300 hover:bg-blue-900"
                          >
                            + Add Supplier
                          </Button>
                        </DialogTrigger>
        
                        <DialogContent className="max-w-xl p-6">
                          <DialogHeader>
                            <DialogTitle>Add Contact</DialogTitle>
                          </DialogHeader>
        
                          <div className="grid grid-cols-1 gap-4">
                            <div className="grid gap-2">
                              <Label>Nama</Label>
                              <Input placeholder="Nama Lengkap" />
                            </div>
        
                            <div className="grid gap-2">
                              <Label>Contact</Label>
                              <Input placeholder="Nomor Telepon / Email" />
                            </div>
        
                            <div className="grid gap-2">
                              <Label>Address</Label>
                              <Textarea
                                placeholder="Alamat Lengkap"
                                className="min-h-[120px]"
                              />
                            </div>
                          </div>
        
                          <DialogFooter className="mt-6">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button className="bg-blue-800 hover:bg-blue-900">
                              Save
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </form>
                    </Dialog>
                  </div>
    )
}