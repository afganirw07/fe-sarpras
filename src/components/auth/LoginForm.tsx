"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Layers } from "lucide-react";
import { Button } from "../ui/button";
import Lottie from "lottie-react";
import SarprasIlustration from "@/assets/lottie/sarpras-ilustration.json";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [show, setShow] = useState(false);

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute right-0 top-0 h-1/2 w-full rounded-b-full bg-blue-200 lg:left-0 lg:h-full lg:w-[51%] lg:rounded-l-none lg:rounded-r-full"
        />
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute right-0 top-0 h-[45%] w-full rounded-b-full bg-blue-400/70  lg:left-0 lg:h-full lg:w-[48%] lg:rounded-l-none lg:rounded-r-full"
        />
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute right-0 top-0 h-[40%] w-full rounded-b-full bg-blue-800 lg:left-0 lg:h-full lg:w-[45%] lg:rounded-l-none lg:rounded-r-full"
        />
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 px-8 pt-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-white"
        >
          <Layers size={20} />
          <span>Sarpras</span>
        </Link>
      </motion.div>

      <div className="relative z-10 flex flex-1 items-center">
        <div className="hidden w-1/2 mb-12 mr-36 items-center justify-center md:flex">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Lottie
                animationData={SarprasIlustration}
                loop
                className="h-[420px] w-[420px]"
              />
            </motion.div>
            <motion.div
             initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="max-w-xs text-center text-md leading-relaxed text-white">
                Kelola sarana dan prasarana sekolah secara digital, terstruktur,
                dan efisien.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="flex w-full justify-center md:w-1/2">
          <motion.form
          onSubmit={handleSubmit}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-lg rounded-3xl border border-gray-200 p-12 shadow-xl backdrop-blur-2xl lg:border-none lg:bg-transparent lg:shadow-none md:mr-12"
          >
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 shadow-md lg:hidden">
                <Lock size={20} className="text-white" />
              </div>

              <h2 className="hidden text-2xl font-semibold text-gray-900  lg:block">
                Masuk
              </h2>

              <p className="mt-2 text-sm lg:text-gray-600 text-white ">
                Selamat Datang! Mohon Masuk untuk Melanjutkan
              </p>
            </div>

            <div className="flex h-12 w-full items-center gap-3 rounded-full border border-gray-300 px-5 focus-within:border-blue-600">
              <Mail size={16} className="text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
                required
              />
            </div>

            <div className="mt-5 flex h-14 w-full items-center gap-3 rounded-full border border-gray-300 px-5 focus-within:border-blue-600">
              <Lock size={16} className="text-gray-500" />
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="text-gray-500 hover:text-gray-700"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className="mt-8 h-14 w-full rounded-full bg-blue-800 text-base text-white transition hover:bg-blue-900"
            >
              Masuk
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
