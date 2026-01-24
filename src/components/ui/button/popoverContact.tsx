import React from "react"
import { Instagram, Facebook, Phone } from "lucide-react"
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
} from "@/components/ui/popover"

// Icon untuk X (Twitter)
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function ContactPopover() {
  const handleSocialClick = (platform: string) => {
    console.log(`Opening ${platform}`)
  }

  const handleCallClick = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <PopoverRoot>
        <PopoverTrigger className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 font-quicksand text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:px-8 md:py-4 md:text-lg h-auto border-0">
          Hubungi Developer
        </PopoverTrigger>

        <PopoverContent className="md:w-155 w-[320px] h-auto">
          <div className="relative">
            {/* Header dengan Close Button */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-600 px-4 py-3">
              <h3 className="text-base font-figtree font-semibold text-zinc-900 dark:text-zinc-100">
                Hubungi Kami
              </h3>
              <PopoverCloseButton />
            </div>

            {/* Social Media Icons */}
            <div className="border-b border-zinc-200 dark:border-zinc-600 px-4 py-4">
              <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Media Sosial
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSocialClick("Instagram")}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </button>
                <button
                  onClick={() => handleSocialClick("Facebook")}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button
                  onClick={() => handleSocialClick("X")}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-all duration-300 hover:scale-110 hover:shadow-lg dark:bg-white dark:text-black"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="px-4 py-4">
              <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Nomor Telepon
              </p>
              <div className="space-y-3 md:flex">
                {/* Contact 1 */}
                <button
                  onClick={() => handleCallClick("+6281234567890")}
                  className="flex w-full items-start gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-600"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      +62 898-6794-615
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Ahsan Rosikhan Yusri
                    </p>
                  </div>
                </button>

                {/* Contact 2 */}
                <button
                  onClick={() => handleCallClick("+6289876543210")}
                  className="flex w-full items-start gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-600"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      +62 898-5720-808
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Afgan Irwansyah Hidayat
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleCallClick("+6289876543210")}
                  className="flex w-full items-start gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-600"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      +62 898-5720-808
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Zefanya Lau Prasetyo
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  )
}