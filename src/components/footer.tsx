"use client";

import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import BackgroundWave from "./common/BackgroundWave";

export default function Footer() {


  


  return (
    <>
     

      <footer className="relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        {/* <BackgroundWave className="rotate-180"/> */}
        <div className="relative z-10 mx-auto max-w-7xl px-6  pb-16 pt-24">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                Sarpras Taruna Bhakti
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Sistem pengelolaan sarana dan prasarana sekolah untuk mendukung
                kegiatan belajar mengajar.
              </p>
              <div className="flex space-x-4 pt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative transform rounded-full bg-gray-800 text-white p-3 transition-all duration-300 hover:scale-110 hover:bg-blue-600"
                >
                  <Facebook className="h-5 w-5" />
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 blur-xl transition-opacity group-hover:opacity-20"></div>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative transform rounded-full bg-gray-800 text-white p-3 transition-all duration-300 hover:scale-110 hover:bg-pink-600"
                >
                  <Instagram className="h-5 w-5" />
                  <div className="absolute inset-0 rounded-full bg-pink-500 opacity-0 blur-xl transition-opacity group-hover:opacity-20"></div>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative transform rounded-full bg-gray-800 text-white p-3 transition-all duration-300 hover:scale-110 hover:bg-red-600"
                >
                  <Youtube className="h-5 w-5" />
                  <div className="absolute inset-0 rounded-full bg-red-500 opacity-0 blur-xl transition-opacity group-hover:opacity-20"></div>
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">
                Navigasi
              </h4>
              <ul className="space-y-3">
                {["Home", "About", "Contact", "Faq"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group flex-row items-center text-slate-300 transition-colors duration-200 hover:text-white"
                    >
                      <span className="h-0.5 w-0 bg-cyan-400 transition-all duration-200 group-hover:w-6"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">
                Kontak Kami
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-slate-300">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-white" />
                  <span className="text-sm">
                    Jalan Raya pekapuran RT 02 RW 07. Kelurahan/Desa, Curug
                  </span>
                </li>
                <li className="flex items-center space-x-3 text-slate-300">
                  <Phone className="h-5 w-5 shrink-0 text-white" />
                  <span className="text-sm">(021) 8744810</span>
                </li>
                <li className="flex items-center space-x-3 text-slate-300">
                  <Mail className="h-5 w-5 shrink-0 text-white" />
                  <span className="text-sm">taruna@smktarunabhakti.net</span>
                </li>
              </ul>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl"></div>
              <div className="absolute -right-10 top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl"></div>
              <div className="absolute -bottom-8 left-1/3 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl"></div>

              <div className="relative rounded-2xl bg-white/5 p-4 backdrop-blur-md">
                <Image
                  alt="Logo Sarpras"
                  src="/images/logo/image.png"
                  width={260}
                  height={260}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          <div className="mb-8 border-t border-slate-700"></div>
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-center text-sm text-slate-400 md:text-left">
              © 2026 SMK Taruna Bhakti. All rights reserved.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-32 top-1/2 h-112 w-md rounded-full bg-cyan-500/10 blur-3xl"></div>
      </footer>
    </>
  );
}
