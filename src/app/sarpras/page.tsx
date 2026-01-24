"use client"

import { GradientButton } from "@/components/ui/button/gradientButton";
import CountUp from "@/components/ui/count-up";
import Image from "next/image";
import {
  Cpu,
  MousePointerClick,
  Link2,
  Package,
  ScreenShare,
  Zap,
  Calendar,
  School,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { TextureOverlay } from "@/components/ui/texture-overlay";
import { 
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel 
} from "@/components/ui/accordion";

import ContactPopover from "@/components/ui/button/popoverContact";

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

  const faqData = [
  {
    question: "Apa itu Sistem Informasi Manajemen Sarana Prasarana ?",
    answer: "SIMS Sarpras adalah sistem digital terintegrasi yang dirancang khusus untuk mengelola seluruh aset sarana dan prasarana sekolah secara efisien. Sistem ini membantu sekolah dalam pencatatan, monitoring, peminjaman, pemeliharaan, dan pelaporan kondisi barang inventaris secara real-time dan terstruktur."
  },
  {
    question: "Apa saja fitur utama yang tersedia di SIMS Sarpras?",
    answer: "SIMS Sarpras dilengkapi dengan berbagai fitur unggulan seperti manajemen inventaris barang, sistem peminjaman otomatis, tracking kondisi aset, Laporan aset,  barcode/QR scanner untuk identifikasi barang, serta dashboard analitik yang memberikan insight data secara komprehensif."
  },
  {
    question: "Apakah data di sistem ini aman?",
    answer: "Keamanan data adalah prioritas utama kami. Sistem menggunakan enkripsi SSL/TLS untuk semua transmisi data, backup otomatis harian, autentikasi multi-faktor, dan server yang tersertifikasi ISO 27001. Semua data disimpan di cloud storage terpercaya dengan sistem redundansi untuk mencegah kehilangan data."
  },
  {
    question: "Bagaimana sistem peminjaman barang bekerja?",
    answer: "Peminjaman barang dapat dilakukan melalui aplikasi dengan workflow yang sistematis. Riwayat peminjaman tersimpan lengkap untuk keperluan audit."
  },
  {
    question: "Apakah sistem ini bisa diakses dari smartphone?",
    answer: "Ya, SIMS Sarpras fully responsive dan dapat diakses dari berbagai perangkat termasuk smartphone, tablet, laptop, dan desktop."
  },
  
];


  return (
    <>
   <section className="bg-White/50 relative flex h-auto w-full flex-col items-center justify-start gap-2 overflow-hidden px-4 pt-42 2xl:pt-48 pb-16 md:px-10 lg:px-20 2xl:px-32">
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
                "rgb(56, 189, 248)",
                "rgb(59, 130, 246)",
                "rgb(99, 102, 241)", 
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
        <div className="w-full h-24 bg-White absolute bottom-0 z-30 blur-md"></div>
      </section>



 <section className="lg:gap-8 gap-y-10 grid lg:grid-cols-2 grid-cols-1 w-full h-auto bg-linear-to-b from-White to-White/50 lg:px-20 2xl:px-42 md:px-10 px-4 lg:py-32 2xl:py-32 py-16">
      <div className="group relative col-span-1 h-100 w-full overflow-hidden rounded-[40px] lg:h-full"> 
        <Image
          src="/images/landingPage/atk_blue.jpg"
          fill
          alt="School Facility"
          className="h-full w-full rounded-[40px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-[40px] bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Stats Card */}
        <div className="absolute bottom-6 left-15 right-15 md:left-24 md:right-24 flex items-center justify-center gap-6 rounded-2xl border border-white/20 bg-white/20 p-5 shadow-2xl backdrop-blur-md ">
          <div className="flex items-baseline gap-1.5">
            <CountUp
              from={0}
              to={100}
              separator=","
              direction="up"
              duration={12}
              className="font-figtree text-5xl font-black leading-none text-cyan-300"
            />
            <span className="font-figtree text-4xl font-bold text-white">%</span>
          </div>
          <h1 className="font-figtree text-2xl font-bold tracking-tight text-white"> lebih efektif </h1>
        </div>
      </div>
      
      <div className="w-full col-span-1 bg-white rounded-[40px] p-6 lg:p-8 2xl:p-16 flex flex-col overflow-hidden"> 
        <div className="flex flex-col gap-4 lg:gap-6 w-full h-full justify-start items-center ">
          <h1 className="font-semibold font-figtree text-2xl lg:text-4xl text-center">
            Solusi Manajemen Sarana dan Prasarana Sekolah
          </h1>
          
          <div className="flex flex-col gap-4 lg:gap-6 flex-1 w-full min-h-0">
            <p className="text-center font-medium text-sm lg:text-base text-gray-600">
              Platform Manajemen Sarana dan Prasarana Sekolah yang membantu pengelolaan aset dan fasilitas secara efisien dan terstruktur, sehingga setiap sarana dapat digunakan secara optimal untuk mendukung kegiatan belajar mengajar.
            </p>

            <button 
              className="relative group mx-auto my-2 px-4 py-2 rounded-full font-semibold 
                       bg-linear-to-r from-blue-500 to-cyan-500 text-white text-base
                       hover:from-blue-600 hover:to-cyan-600
                       transform hover:scale-105 active:scale-95
                       transition-all duration-300 ease-out
                       shadow-lg hover:shadow-xl
                       flex items-center gap-2 shrink-0"
            >
              <span className="relative z-10 ">Gunakan Sekarang</span>
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
                <p className="text-center text-xs lg:text-sm font-medium font-quicksand ">Dirancang untuk semua orang, dengan fitur yang mudah dan inklusif.</p>
              </div>
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center gap-3
                            hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-blue-100">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center
                              shadow-lg transform group-hover:rotate-12 transition-transform duration-300 shrink-0">
                  <ScreenShare className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h3 className="font-bold text-base lg:text-lg text-center text-gray-800">Responsif</h3>
                <p className="text-center text-xs lg:text-sm font-medium font-quicksand">Akses sarpras dengan berbagai perangkat sehari-hari anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

<section className="bg-White/50 relative flex items-center justify-center h-auto w-full px-6 py-16 lg:py-32 2xl:py-32 md:px-10 lg:px-20 2xl:px-32">
        <TextureOverlay texture="dots" opacity={0.2} />
        <div className="z-20 flex flex-col items-center justify-center gap-8 w-full">
          <div className="flex flex-col w-full justify-center h-fit items-center gap-2">
            <h1 className="bg-linear-to-r font-figtree leading-relaxed from-cyan-500 to-blue-500 bg-clip-text text-[1.7rem] font-bold text-transparent md:text-4xl lg:text-5xl">
              Mulai Dengan Sarpras{" "}
            </h1>
            <p className="font-quicksand text-center text-base font-semibold lg:text-xl max-w-2xl">
              solusi modern dan intuitif untuk pengelolaan sarana prasarana di
              sekolah
            </p>
          </div>
            <div className="relative z-20 flex justify-center overflow-visible w-full">
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
      </section>

      <section className="relative w-full bg-White/50 px-6 py-16 md:px-10 md:py-20 lg:px-20 lg:py-28 2xl:px-32 2xl:py-32">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-cyan-100/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-12 text-center lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            <HelpCircle className="h-4 w-4" />
            <span className="font-quicksand">Pusat Bantuan</span>
          </div>
          
          <h2 className="font-figtree mb-4 bg-linear-to-r leading-relaxed from-cyan-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          
          <p className="font-quicksand mx-auto max-w-2xl text-base  md:text-lg">
            Temukan jawaban atas pertanyaan umum seputar Sistem Informasi Manajemen Sarana Prasarana sekolah
          </p>
        </div>

        {/* FAQ Accordion */}
         <Accordion className="space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem 
              key={index}
              className="rounded-2xl border border-gray-200 bg-white px-6 py-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-300 "
            >
              <AccordionButton className="font-figtree text-base font-semibold text-gray-800 md:text-lg">
                {faq.question}
              </AccordionButton>
              <AccordionPanel className="font-quicksand text-sm leading-relaxed text-gray-600 md:text-base">
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact Support CTA */}
        <div className="mt-12 text-center">
          <p className="font-quicksand mb-4 text-gray-600">
            Tidak menemukan jawaban yang Anda cari?
          </p>
        <ContactPopover/>
        </div>
      </div>
    </section>
    </>
  );
}
