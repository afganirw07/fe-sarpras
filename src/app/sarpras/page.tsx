import { GradientButton } from "@/components/ui/button/gradientButton";
import Image from "next/image";
import { Cpu, MousePointerClick, Link2 } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { useTheme } from "next-themes"      

export default function Sarpras() {
const theme = useTheme()
  const ListFitur = [
    {
      nama: "Advance System",
      penjelasan:
        "Sistem pengelolaan sarana dan prasarana yang canggih dan terstruktur, memungkinkan pencatatan aset, pemantauan kondisi, serta pengelolaan inventaris sekolah secara real-time dan akurat.",
      logo: <Cpu />,
    },
    {
      nama: "Easy Access",
      penjelasan:
        "Akses mudah dan cepat dari berbagai perangkat, kapan saja dan di mana saja, tanpa proses yang rumit. Antarmuka yang intuitif memastikan semua pengguna dapat mengoperasikan sistem dengan nyaman.",
      logo: <MousePointerClick />,
    },
    {
      nama: "Fully Integrated",
      penjelasan:
        "Terintegrasi penuh dengan berbagai modul pendukung seperti data barang, peminjaman, pengembalian, laporan, dan manajemen pengguna, sehingga seluruh proses berjalan efisien dalam satu sistem terpadu.",
      logo: <Link2 />,
    },
  ];

  return (
    <>
      <section className="bg-White relative flex h-screen w-full flex-col items-center justify-center gap-2 px-4 py-10 md:px-10 lg:px-20 2xl:px-32 ">
        {/* mesh bg */}
        <div className="bg-BgMesh lg:w-225 lg:h-100 w-125 h-50 absolute -top-[5%] z-10 rounded-full opacity-65 blur-3xl lg:-top-[20%] ">
          {" "}
        </div>

        <div className="z-20 flex flex-col items-center gap-4 lg:gap-5">
          <div className="bg-linear-to-b from-BgMesh font-quicksand w-fit rounded-2xl border-2 border-[#add2ff] to-blue-700 px-3 py-2">
            <p className=" text-xs font-bold uppercase tracking-wider text-white 2xl:text-base ">
              SMK Taruna Bhakti Depok
            </p>
          </div>

          <div className="lg:max-w-275 flex flex-col text-center  ">
            <h1 className="text-Black font-figtree text-[1.7rem] font-bold  md:text-4xl lg:text-5xl">
              Aplikasi Manajemen Moderen{" "}
            </h1>
            <h1 className="bg-linear-to-r font-figtree from-cyan-500 to-blue-500 bg-clip-text text-[1.7rem] font-bold leading-normal  text-transparent md:text-4xl lg:text-5xl">
              Informasi Pengadaan Fasilitas Sekolah{" "}
            </h1>
          </div>
        </div>
        <div className="z-20 flex flex-col gap-3">
          <p className="font-quicksand text-base font-semibold lg:text-xl">
            Mempermudah Kelola Barang-Barang Sekolah
          </p>
          <div className="ease-initial flex scale-90 justify-center transition-transform duration-300 hover:scale-100">
            <GradientButton
              containerClassName="w-fit p-2 rounded-full mx-auto"
              gradientColors={[
                "rgb(56, 189, 248)", // cyan-400
                "rgb(59, 130, 246)", // blue-500
                "rgb(99, 102, 241)", // indigo-500
              ]}
            >
              <button className=" font-quicksand bg-linear-to-r  active:scale-98 h-full w-full cursor-pointer rounded-full from-neutral-100 via-neutral-100 to-white px-4 py-2 font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
                Mulai Sekarang
              </button>
            </GradientButton>
          </div>
        </div>
      </section>
      <section className="bg-White relative relative flex min-h-screen w-full flex-col gap-2 px-4 py-10 md:px-10 lg:px-20 2xl:px-32 ">
        {/* mesh bg */}
        <div className="lg:w-225  lg:h-100 w-125 h-50 absolute -top-[5%] z-10 rounded-full opacity-65 blur-3xl lg:-top-[20%] ">
          {" "}
        </div>
        <div className="relative z-20 flex flex-col items-center gap-4 lg:gap-5">
          <div className="lg:max-w-275 flex flex-col text-center ">
            <h1 className="bg-linear-to-r font-figtree from-cyan-500 to-blue-500 bg-clip-text text-[1.7rem] font-bold text-transparent  md:text-4xl lg:text-5xl">
              Mulai Dengan Sarpras{" "}
            </h1>
            <p className="font-quicksand text-base font-semibold lg:text-xl">
              solusi modern dan intuitif untuk pengelolaan sarana prasarana di
              sekolah{" "}
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            <div className="flex w-full justify-center">
              <div className="hidden lg:block absolute lg:top-0 h-[662px] w-full overflow-hidden">
                <Image
                  src="/images/mockup/Dashboard.png"
                  alt="Dashboard UI"
                  width={1400}
                  height={900}
                  className="mx-auto opacity-90 object-fit "
                />
              </div>
              <div className="relative z-20 mt-24 flex justify-center">
                <ShineBorder shineColor={theme.theme === "dark" ? "white" : "black"} />
                <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ListFitur.map((fitur, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-gray-300 bg-white p-5 shadow-lg backdrop-blur-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 p-3 text-blue-500">
                          {fitur.logo}
                        </div>
                        <h3 className="font-figtree text-lg font-bold">
                          {fitur.nama}
                        </h3>
                      </div>
                      <p className="font-quicksand mt-3 text-sm text-gray-700">
                        {fitur.penjelasan}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-White relative flex h-screen w-full flex-col items-center justify-center gap-2 px-4 py-10 md:px-10 lg:px-20 2xl:px-32 ">
       
      </section>
    </>
  );
}
