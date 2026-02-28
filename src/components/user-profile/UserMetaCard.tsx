"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { User } from 'lucide-react';

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const {data: session} = useSession();
  console.log(session)
  const namaUser = session?.user?.username
  const idUser = session?.user?.id
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
               <Image
                          width={85}
                          height={85}
                          src="https://lms.smktarunabhakti.sch.id/pluginfile.php/1/core_admin/logocompact/300x300/1760106345/Logo%20TB%20Teks%20Putih.png"
                          alt="User"
                        />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {namaUser}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SMK TARUNA BHAKTI
                </p>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
}
