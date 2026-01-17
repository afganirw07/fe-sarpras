import { GradientButton } from "@/components/ui/button/gradientButton"
import Image from "next/image"

export default function Sarpras(){
    return(
        <>
        <section className="flex-col gap-2 relative w-full h-screen bg-White flex justify-center items-center py-10 lg:px-20 2xl:px-32 md:px-10 px-4 ">

            {/* mesh bg */}
            <div className="absolute bg-BgMesh lg:w-225 lg:h-100 w-125 h-50 rounded-full lg:-top-[20%] -top-[5%] blur-3xl opacity-65 z-10 "> </div>

        <div className="flex flex-col items-center lg:gap-5 gap-4 z-20">
            <div className="py-2 px-3 w-fit rounded-2xl bg-linear-to-b from-BgMesh to-blue-700 border-2 border-[#add2ff] font-quicksand" >
                <p className=" text-white font-bold uppercase 2xl:text-base text-xs tracking-wider " >SMK Taruna Bhakti Depok</p>
            </div>

            <div className="lg:max-w-275 text-center flex flex-col  ">
                <h1 className="text-Black lg:text-5xl md:text-4xl text-[1.7rem]  font-figtree font-bold">Aplikasi Manajemen Moderen  </h1>
                <h1 className="bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent lg:text-5xl md:text-4xl text-[1.7rem]  font-figtree font-bold leading-normal">Informasi Pengadaan Fasilitas Sekolah  </h1>
            </div>
        </div>
            <div className="flex flex-col gap-3 z-20">
                <p className="lg:text-xl text-base font-quicksand font-semibold">Mempermudah Kelola Barang-Barang Sekolah</p>
                <div className="flex justify-center scale-90 hover:scale-100 transition-transform duration-300 ease-initial">
                    <GradientButton
                        containerClassName="w-fit p-2 rounded-full mx-auto"
                        gradientColors={[
                          "rgb(56, 189, 248)",   // cyan-400
                          "rgb(59, 130, 246)",   // blue-500
                          "rgb(99, 102, 241)",   // indigo-500
                        ]}
                    >
                        <button className=" font-semibold font-quicksand  h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-2 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
                            Mulai Sekarang 
                        </button>
                    </GradientButton>
                </div>
            </div> 

        </section>
        </>
    )
}