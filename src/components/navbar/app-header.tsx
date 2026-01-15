"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 border-b border-white/10 bg-white">
      <div className="flex items-center gap-3">
        <h1 className="text-blue-600 font-bold text-2xl">SARPRAS</h1>
      </div>
        <nav className="hidden lg:flex">
          <ul className="flex flex-row space-x-4">
            <li className="text-blue-600 hover:text-blue-800 text-md font-semibold transition duration-300">home</li>
            <li className="text-blue-600 hover:text-blue-800 text-md font-semibold transition duration-300">about</li>
            <li className="text-blue-600 hover:text-blue-800 text-md font-semibold transition duration-300">contact</li>
          </ul>
        </nav>
      <div>
        <Button className="hidden lg:block"><Link href={"auth/login"}>Login</Link></Button>
      </div>
        <SidebarTrigger className="lg:hidden text-blue-600" />
    </header>
  );
}
