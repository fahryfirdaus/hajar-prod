"use client";

import { useLogin } from "@/libs/hooks/useLogin";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button, Image } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoginModal } from "../LoginModal";

const NavbarComponent = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const { isOpen, onOpen, onClose, handleLogin } = useLogin();

  const handleSmoothScroll = (e, sectionId) => {
    e.preventDefault();

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar
        className={`bg-opacity-0 transition-all duration-500 py-1 ${
          isBlurred ? "backdrop-blur-md shadow-md bg-opacity-50 bg-white" : ""
        }`}
      >
        <NavbarContent>
          <NavbarBrand className="flex items-center">
            <Link href="#" className="flex gap-2 items-center">
              <Image alt="Logo" src="/logo/logo.png" className="w-11 h-12 md:w-6 md:h-6" />
              <p className=" hidden sm:block font-bold text-xl text-gray-700">
                HAJAR
              </p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="flex gap-3 sm:gap-6" justify="center">
          <NavbarItem className="text-xs sm:text-base text-gray-600 hover:font-semibold hover:text-black">
            <Link
              href="#cara-kerja"
              onClick={(e) => handleSmoothScroll(e, "cara-kerja")}
            >
              Cara Kerja
            </Link>
          </NavbarItem>
          <NavbarItem className="text-xs sm:text-base text-gray-600 hover:font-semibold hover:text-black ">
            <Link
              color="foreground"
              href="#hajar"
              onClick={(e) => handleSmoothScroll(e, "hajar")}
            >
              Hajar
            </Link>
          </NavbarItem>
          <NavbarItem className="text-xs sm:text-base text-gray-600 hover:font-semibold hover:text-black">
            <Link
              color="foreground"
              href="#footer"
              onClick={(e) => handleSmoothScroll(e, "footer")}
            >
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="">
          <NavbarItem className="flex">
            <Button onPress={onOpen} className="bg-red-500 text-white text-xs md:text-base font-semibold flex item-center">
              <Image
                alt="Google Logo"
                src="/icon/google.svg"
                className="hidden md:inline w-6"
              />
                Masuk
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <LoginModal isOpen={isOpen} onClose={onClose} handleLogin={handleLogin} />
    </>
  );
};

export default NavbarComponent;
