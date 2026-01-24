import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export default function DetailItem() {
    return (
        <div className="w-full max-w-6xl rounded-xl border p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
  <div className="flex flex-col gap-8">
    <h1 className="font-figtree text-2xl font-semibold text-gray-800 dark:text-white">
      Detail Item
    </h1>

    <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-2">
      <div className="grid gap-2">
        <Label>Nama Item :</Label>
        <Input value="PC" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Status :</Label>
        <Input value="DISIMPAN" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Kategori Item :</Label>
        <Input value="ELEKTRONIK" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Instansi :</Label>
        <Input value="TB002" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Subkategori Item :</Label>
        <Input value="PC" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Created By :</Label>
        <Input value="shintanuria17" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Serial Number :</Label>
        <Input value="PC01-ELK-1-20260109-ELEK-102-00" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Created At :</Label>
        <Input value="shintanuria17" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Warehouse Item :</Label>
        <Input value="OLD SARPRAS" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Kondisi :</Label>
        <Input value="Baik" readOnly />
      </div>

      <div className="grid gap-2">
        <Label>Item In :</Label>
        <Button variant="secondary" className="w-fit">
          Show
        </Button>
      </div>

      <div className="grid gap-2">
        <Label>Keterangan Kondisi :</Label>
        <Input readOnly />
      </div>
    </div>
  </div>
</div>
    )
}