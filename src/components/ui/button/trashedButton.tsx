import {Button} from "../button"
import Link from "next/link"

export default function ButtonTrashed ({
    route = ""
}){
    return (
    <>
        <Button
              size={"lg"}
              className="text-White bg-red-600 transition duration-300 hover:bg-red-700 font-quicksand font-semibold"
            >
              <Link href={`/dashboard/${route}/trashed`}>Trashed</Link>
            </Button>
    </>
    )
}