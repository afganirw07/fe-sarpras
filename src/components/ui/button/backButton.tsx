import { Button } from "../button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ButtonBack({ route = "" }) {
  return (
    <Button
      size="lg"
      className="bg-blue-600 hover:bg-blue-700 text-white font-quicksand font-semibold"
      asChild
    >
      <Link
        href={`/dashboard/${route}`}
        className="flex items-center gap-1"
      >
        <ArrowLeft size={25} className="text-white" />
        <span>Kembali</span>
      </Link>
    </Button>
  );
}
