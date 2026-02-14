"use client";

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
import Label from "../../form/Label";
import { Input } from "../../ui/input";

export default function DialogTransactionOut() {
  const tableData: any[] = [];

  return (
    <div className="flex justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-blue-800 text-white hover:bg-blue-900"
          >
            + Add Transaction In
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] w-full max-w-6xl overflow-y-auto p-8">
          <form>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold">
                Add Transaction In
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>PO Number</Label>
                <Input placeholder="PO Number" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Detail Transaction</Label>
                <Input placeholder="Detail Transaction" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Warehouses</Label>
                <Select>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="w1">Warehouse 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Suppliers</Label>
                <Select>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">Supplier 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Kategori</Label>
                <Select>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="k1">Kategori 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Item</Label>
                <Input placeholder="Item" />
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                className="bg-blue-800 text-white hover:bg-blue-900"
              >
                Add Item +
              </Button>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
              <div className="relative overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <Table className="w-full min-w-200 table-auto">
                    <TableHeader className="border border-gray-100 dark:border-white/5">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="min-w-7.5 rounded-l-md border border-r-0 bg-blue-800 px-6 py-3 text-xs font-medium text-gray-200"
                        >
                          No
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Item ID
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Item Name
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          Item Price
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-55 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                          QTY Request
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                           QTY Receive
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                           Item condition
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                            Tahun Pengadaan
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                           Item condition
                        </TableCell>
                        <TableCell
                          isHeader
                          className="min-w-7.5 rounded-r-md border bg-blue-800 px-5 py-3 text-xs font-medium text-gray-200"
                        >
                           Action
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {tableData.length === 0 ? (
                        <TableRow>
                          <td
                            colSpan={10}
                            className="border px-6 py-6 text-center text-sm text-gray-500"
                          >
                            Tidak ada Kategori
                          </td>
                        </TableRow>
                      ) : (
                        tableData.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="border px-6 py-4">
                              {user.id}
                            </TableCell>
                            <TableCell className="border px-4 py-4">
                              {user.id}
                            </TableCell>
                            <TableCell className="border px-4 py-4">
                              {user.nama}
                            </TableCell>
                            <TableCell className="border px-4 py-4">
                              {user.nama}
                            </TableCell>
                            <TableCell className="border px-4 py-4">
                              {user.nama}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 gap-3">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button className="bg-blue-800 text-white hover:bg-blue-900">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
