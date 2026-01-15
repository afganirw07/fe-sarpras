"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeCloseIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import Label from "@/components/form/Label";

export default function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-7xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-8">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/images/LogoInstansi/logotb.png"
              alt="Logo"
              className="w-20 drop-shadow-xl"
            />
            <h1 className="mt-3 text-2xl font-bold text-[#173E67]">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm text-center">Sign in to continue</p>
          </div>
          <form className="space-y-4">
            <div>
              <Label className="text-sm text-[#173E67]">
                Email
              </Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                className="bg-gray-100 placeholder-gray-400 text-[#173E67] border border-[#173E67]"
              />
            </div>

            {/* Password */}
            <div>
              <Label className="text-sm text-[#173E67]">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-gray-100 placeholder-gray-400"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5 text-[#173E67]"/>
                  ) : (
                    <EyeCloseIcon className="w-5 h-5 text-[#173E67]"/>
                  )}
                </span>
              </div>
            </div>
            {/* Button */}
            <Button
              className="w-full text-white bg-[#173E67]"
              size="sm"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[#173E67]">
            Don’t have an account?{" "}
            <Link href="/signup" className="underline font-medium text-[#173E67]">
              Sign Up
            </Link>
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center relative"
          style={{ backgroundImage: "url('/images/dokumentasi/lorong.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 text-center text-white p-6">
            <p className="mt-4 font-semibold text-lg">
              Kamu kembali lagi, Calon Peserta Didik Baru!
            </p>
            <p className="text-sm mt-1">Yuk wujudkan mimpi dan masa depanmu bersama kami.</p>

            <Link
              href="/register"
              className="inline-block mt-4 px-6 py-2 bg-white font-medium rounded-lg hover:bg-gray-50 transition text-[#173E67]"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}