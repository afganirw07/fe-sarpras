"use client"

import { useState } from "react";
import { GradientButton } from "@/components/ui/button/gradientButton";
import Image from "next/image";
import {
  Cpu,
  MousePointerClick,
  Link2,
  Package,
  Lock,
  Zap,
  ChevronDown,
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
      icon: <BarChart3 size={20} />,
      label: "Laporan",
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
   <section className="bg-White/50 relative flex h-auto w-full flex-col items-center justify-start gap-2 overflow-hidden px-4 pt-32 pb-10 md:px-10 lg:px-20 2xl:px-32">
        {/* mesh bg */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
          {FloatingItems.map((item, index) => (
            <div
              key={index}
              className={`absolute ${item.className} animate-float`}
              style={{ animationDelay: `${index * 0.6}s` }}
            >
              <div className="relative">
                <div className="animate-glow absolute inset-0 -z-10 rounded-xl bg-linear-to-r from-cyan-500/40 to-blue-500/40 blur-xl" />
                <div className="flex items-center gap-2 rounded-xl border border-cyan-200/40 bg-White/80 px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md">
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
            <p className=" text-xs font-bold uppercase tracking-wider text-White 2xl:text-base ">
              SMK Taruna Bhakti Depok
            </p>
          </div>

          <div className="lg:max-w-275 flex flex-col text-center ">
            <h1 className="text-Black font-figtree text-[1.7rem] font-bold  md:text-4xl lg:text-5xl">
              Aplikasi Manajemen Moderen{" "}
            </h1>
            <h1 className="bg-linear-to-r font-figtree from-cyan-500 to-blue-700 bg-clip-text text-[1.7rem] font-bold leading-normal  text-transparent  md:text-4xl lg:text-5xl ">
              Informasi Pengadaan Fasilitas Sekolah{" "}
            </h1>
          </div>
        </div>
        <div className="z-20 flex flex-col gap-2">
          <p className="font-quicksand font-semibold text-sm lg:text-xl">
            Mempermudah Kelola Barang-Barang Sekolah
          </p>
          <div className="ease-initial my-6 flex scale-90 justify-center transition-transform duration-300 hover:scale-100">
            <GradientButton
              containerClassName="w-fit p-2 rounded-full mx-auto"
              gradientColors={[
                "rgb(56, 189, 248)", // cyan-400
                "rgb(59, 130, 246)", // blue-500
                "rgb(99, 102, 241)", // indigo-500
              ]}
            >
              <button className=" font-quicksand bg-linear-to-r active:scale-98 h-full w-full cursor-pointer rounded-full from-neutral-100 via-neutral-100 to-White px-4 py-2 font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 dark:from-black dark:via-black dark:to-neutral-900 dark:text-White dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
                Mulai Sekarang
              </button>
            </GradientButton>
          </div>
        </div>
        <div className="w-full relative z-20 ">
        <div className="pointer-events-none justify-center hidden lg:block">
          <Image
            src="/images/mockup/Dashboardmockup.png"
            alt="Dashboard UI"
            width={600}
            height={200}
            className="object-fit rouned-2xl mx-auto opacity-90"
            />
        </div>
        <div className="pointer-events-none justify-center lg:hidden">
          <Image
            src="/images/mockup/MobileDashboard.png"
            alt="Dashboard UI"
            width={200}
            height={600}
            className="object-fit rouned-2xl mx-auto opacity-90"
            />
        </div>
        </div>
        <div className="w-full h-18 bg-White absolute bottom-0 z-30 blur-md"></div>
      </section>



 <section className="lg:gap-8 grid lg:grid-cols-2 grid-cols-1 w-full h-screen bg-linear-to-b from-White to-White/50 lg:px-20 2xl:px-32 md:px-10 px-4 lg:py-10 py-6">
      <div className="relative w-full col-span-1 rounded-[40px] h-100 lg:h-full"> 
        <Image
          src="/images/landingPage/atk_blue.jpg"
          fill
          alt="School Facility"
          className="object-cover object-center rounded-[40px] w-full h-full"
        />
        <div className="w-60 h-30 absolute bg-white rounded-3xl bottom-4 left-8 p-4 shadow-lg">
        </div>
      </div>
      
      <div className="w-full col-span-1 bg-white rounded-[40px] p-6 lg:p-8 flex flex-col overflow-hidden"> 
        <div className="flex flex-col gap-4 lg:gap-6 w-full h-full justify-start items-center ">
          <h1 className="font-semibold font-figtree text-2xl lg:text-4xl text-center">
            Solusi Manajemen Sarana dan Prasarana Sekolah
          </h1>
          
          <div className="flex flex-col gap-4 lg:gap-6 flex-1 w-full min-h-0">
            <p className="text-center font-medium text-sm lg:text-base text-gray-600">
              Platform Manajemen Sarana dan Prasarana Sekolah yang membantu pengelolaan aset dan fasilitas secara efisien dan terstruktur, sehingga setiap sarana dapat digunakan secara optimal untuk mendukung kegiatan belajar mengajar.
            </p>

            <button 
              className="relative group mx-auto px-4 py-2 rounded-full font-semibold 
                       bg-linear-to-r from-blue-500 to-cyan-500 text-white text-base
                       hover:from-blue-600 hover:to-cyan-600
                       transform hover:scale-105 active:scale-95
                       transition-all duration-300 ease-out
                       shadow-lg hover:shadow-xl
                       flex items-center gap-2 shrink-0"
            >
              <span className="relative z-10">Gunakan Sekarang</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full ">
              
              
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center gap-3
                            hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-blue-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center
                              shadow-lg transform group-hover:rotate-12 transition-transform duration-300 shrink-0">
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h3 className="font-bold text-base lg:text-lg text-center text-gray-800">Efisien</h3>
                <p className="text-center text-xs lg:text-sm text-gray-600">Dirancang untuk semua orang, dengan fitur yang mudah dan inklusif.</p>
              </div>
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center gap-3
                            hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-blue-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center
                              shadow-lg transform group-hover:rotate-12 transition-transform duration-300 shrink-0">
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h3 className="font-bold text-base lg:text-lg text-center text-gray-800">Efisien</h3>
                <p className="text-center text-xs lg:text-sm text-gray-600">Dirancang untuk semua orang, dengan fitur yang mudah dan inklusif.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      <section className=" bg-White/50 relative flex min-h-screen w-full flex-col gap-2 overflow-hidden px-4 py-10 md:px-10 lg:px-20 2xl:px-32 ">
        <TextureOverlay texture="dots" opacity={0.2} />
        <div className="lg:w-225 lg:h-100 w-125 h-50 absolute -top-[5%] z-10 rounded-full opacity-65 blur-3xl lg:-top-[20%] ">
          {" "}
        </div>
        <div className="relative z-20 mt-16 flex flex-col items-center gap-4 lg:gap-5">
          <div className="lg:max-w-275 flex flex-col text-center ">
            <h1 className="bg-linear-to-r font-figtree leading-relaxed from-cyan-500 to-blue-500 bg-clip-text text-[1.7rem] font-bold text-transparent  md:text-4xl lg:text-5xl">
              Mulai Dengan Sarpras{" "}
            </h1>
            <p className="font-quicksand text-base font-semibold lg:text-xl">
              solusi modern dan intuitif untuk pengelolaan sarana prasarana di
              sekolah
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            <div className="flex w-full justify-center">
              {/* <div className="absolute hidden h-149.5 w-full overflow-hidden lg:top-0 lg:block">
                <Image
                  src="/images/mockup/Dashboard.png"
                  alt="Dashboard UI"
                  width={1400}
                  height={900}
                  className="object-fit mx-auto opacity-90"
                />
              </div> */}
              <div className="relative z-20 mt-12 flex justify-center overflow-visible">
                <div className="group relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ListFitur.map((fitur, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-5 shadow-lg backdrop-blur-md transition-transform duration-200 ease-out hover:scale-[1.03]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-linear-to-r from-cyan-500/20 to-blue-500/20 p-3 text-cyan-500">
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
