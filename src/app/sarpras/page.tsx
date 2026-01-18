import { GradientButton } from "@/components/ui/button/gradientButton";
import Image from "next/image";
import {
  Cpu,
  MousePointerClick,
  Link2,
  Package,
  Wrench,
  Calendar,
  School,
  BarChart3,
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { TextureOverlay } from "@/components/ui/texture-overlay";

export default function Sarpras() {
  const FloatingItems = [
    {
      icon: <Package size={20} />,
      label: "Aset",
      className: "top-[20%] left-[8%]",
    },
    {
      icon: <Wrench size={20} />,
      label: "Perawatan",
      className: "top-[35%] right-[10%]",
    },
    {
      icon: <Calendar size={20} />,
      label: "Peminjaman",
      className: "bottom-[25%] left-[12%]",
    },
    {
      icon: <School size={20} />,
      label: "Ruang Kelas",
      className: "bottom-[30%] right-[15%]",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Laporan",
      className: "top-[55%] right-[5%]",
    },
  ];

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
      <section className="relative flex h-screen w-full flex-col items-center justify-start gap-2 overflow-hidden px-4 pt-32 md:px-10 lg:px-20 2xl:px-32">
        {/* mesh bg */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
          {FloatingItems.map((item, index) => (
            <div
              key={index}
              className={`absolute ${item.className} animate-float`}
              style={{ animationDelay: `${index * 0.6}s` }}
            >
              <div className="relative">
                <div className="animate-glow absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/40 to-blue-500/40 blur-xl" />
                <div className="flex items-center gap-2 rounded-xl border border-cyan-200/40 bg-white/80 px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md">
                  <div className="text-blue-500 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                    {item.icon}
                  </div>
                  <span className="font-quicksand text-sm font-semibold text-gray-800">
                    {item.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-BgMesh lg:w-225 lg:h-100 w-125 h-50 absolute -top-[5%] z-10 rounded-full opacity-65 blur-3xl lg:-top-[20%] ">
          {" "}
        </div>

        <div className="z-20 flex flex-col items-center gap-2">
          <div className="bg-linear-to-b from-BgMesh font-quicksand w-fit rounded-2xl border-2 border-[#add2ff] to-blue-700 px-3 py-2">
            <p className=" text-xs font-bold uppercase tracking-wider text-white 2xl:text-base ">
              SMK Taruna Bhakti Depok
            </p>
          </div>

          <div className="lg:max-w-275 flex flex-col text-center ">
            <h1 className="text-Black font-figtree text-[1.7rem] font-bold  md:text-4xl lg:text-5xl">
              Aplikasi Manajemen Moderen{" "}
            </h1>
            <h1 className="bg-linear-to-r font-figtree from-cyan-500 to-blue-500 bg-clip-text text-[1.7rem] font-bold leading-normal  text-transparent opacity-40 md:text-4xl lg:text-5xl">
              Informasi Pengadaan Fasilitas Sekolah{" "}
            </h1>
          </div>
        </div>
        <div className="z-20 flex flex-col gap-2">
          <p className="font-quicksand font-semibold text-sm lg:text-xl">
            Mempermudah Kelola Barang-Barang Sekolah
          </p>
          <div className="ease-initial mb-20 flex scale-90 justify-center transition-transform duration-300 hover:scale-100">
            <GradientButton
              containerClassName="w-fit p-2 rounded-full mx-auto"
              gradientColors={[
                "rgb(56, 189, 248)", // cyan-400
                "rgb(59, 130, 246)", // blue-500
                "rgb(99, 102, 241)", // indigo-500
              ]}
            >
              <button className=" font-quicksand bg-linear-to-r active:scale-98 h-full w-full cursor-pointer rounded-full from-neutral-100 via-neutral-100 to-white px-4 py-2 font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
                Mulai Sekarang
              </button>
            </GradientButton>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 justify-center hidden lg:block">
          <Image
            src="/images/mockup/Dashboardmockup.png"
            alt="Dashboard UI"
            width={600}
            height={200}
            className="object-fit rouned-2xl mx-auto opacity-90"
          />
        </div>
        <div className="pointer-events-none h-[400px] absolute inset-x-0 bottom-0 z-10 justify-center lg:hidden">
          <Image
            src="/images/mockup/MobileDashboard.png"
            alt="Dashboard UI"
            width={200}
            height={600}
            className="object-fit rouned-2xl mx-auto opacity-90"
          />
        </div>
      </section>
      <section className="relative flex min-h-screen w-full flex-col gap-2 overflow-hidden px-4 py-10 md:px-10 lg:px-20 2xl:px-32 ">
        <TextureOverlay texture="dots" opacity={0.2} />
        <div className="lg:w-225 lg:h-100 w-125 h-50 absolute -top-[5%] z-10 rounded-full opacity-65 blur-3xl lg:-top-[20%] ">
          {" "}
        </div>
        <div className="relative z-20 mt-16 flex flex-col items-center gap-4 lg:gap-5">
          <div className="lg:max-w-275 flex flex-col text-center ">
            <h1 className="bg-linear-to-r font-figtree from-cyan-500 to-blue-500 bg-clip-text text-[1.7rem] font-bold text-transparent  md:text-4xl lg:text-5xl">
              Mulai Dengan Sarpras{" "}
            </h1>
            <p className="font-quicksand text-base font-semibold lg:text-xl">
              solusi modern dan intuitif untuk pengelolaan sarana prasarana di
              sekolah
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            <div className="flex w-full justify-center">
              <div className="absolute hidden h-[598px] w-full overflow-hidden lg:top-0 lg:block">
                <Image
                  src="/images/mockup/Dashboard.png"
                  alt="Dashboard UI"
                  width={1400}
                  height={900}
                  className="object-fit mx-auto opacity-90"
                />
              </div>
              <div className="relative z-20 mt-12 flex justify-center overflow-visible">
                <div className="group relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ListFitur.map((fitur, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-5 shadow-lg backdrop-blur-md transition-transform duration-200 ease-out hover:scale-[1.03]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 text-cyan-500">
                          {fitur.logo}
                        </div>
                        <h3 className="font-figtree text-lg font-bold">
                          {fitur.nama}
                        </h3>
                      </div>
                      <p className="font-quicksand mt-3 text-sm text-gray-700">
                        {fitur.penjelasan}
                      </p>
                      <BorderBeam
                        duration={8}
                        size={100}
                        colorFrom="#00BCD4"
                        colorTo="#3b82f6"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-White relative flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden px-4 py-10 md:px-10 lg:px-20 2xl:px-32 ">
        <div className="bg-BgMesh lg:w-225 lg:h-100 w-125 h-50 absolute -top-[5%] z-10 rounded-full opacity-65 blur-3xl lg:-top-[20%] ">
          {" "}
        </div>
      </section>
    </>
  );
}
