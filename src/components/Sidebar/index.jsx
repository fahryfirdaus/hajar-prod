"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FiYoutube } from "react-icons/fi";
import { FaHistory, FaHome } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";

const Sidebar = () => {
  const [isCompact, setIsCompact] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const lastCompactMode = Cookies.get("last_sidebar_compact");

    if (lastCompactMode == "true") {
      setIsCompact(true);
    }
  }, []);

  const handleLogOut = () => {
    Cookies.remove("authorization");
    router.push("/");
  };

  const handleCompactChange = () => {
    const compactMode = isCompact;

    setIsCompact(!compactMode);
    Cookies.set("last_sidebar_compact", (!compactMode).toString());
  };

  return (
    <div
      className={`${
        isCompact ? "w-20" : "w-60"
      } m-4 rounded-lg bg-red-600 transition-all duration-300 p-4 space-y-3 hidden sm:flex flex-col justify-between shadow-lg shadow-red-800/40`}
    >
      <div className="space-y-3">
        <Button onPress={handleCompactChange} isIconOnly variant="light">
          {isCompact ? (
            <MdKeyboardDoubleArrowRight color="white" size={26} />
          ) : (
            <MdKeyboardDoubleArrowLeft color="white" size={26} />
          )}
        </Button>
        <div className="h-4"></div>
        <Button
          as={Link}
          href="/dashboard"
          isIconOnly={isCompact}
          className={`${
            isCompact ? "" : "flex justify-start"
          } w-full text-gray-800 ${
            pathname.endsWith("/dashboard") ? "bg-slate-50" : "bg-slate-50/50"
          } hover:bg-slate-50 transition-all duration-400`}
          startContent={<FaHome size={22} />}
        >
          <p className={isCompact ? "hidden" : ""}>Home</p>
        </Button>
        <Button
          as={Link}
          href="/dashboard/video"
          isIconOnly={isCompact}
          className={`${
            isCompact ? "" : "flex justify-start"
          } w-full text-gray-800 ${
            pathname === "/dashboard/video" ||
            pathname.startsWith("/dashboard/video/comments")
              ? "bg-slate-50"
              : "bg-slate-50/50"
          } hover:bg-slate-50 transition-all duration-400`}
          startContent={<FiYoutube size={22} />}
        >
          <p className={isCompact ? "hidden" : ""}>Video</p>
        </Button>
        <Button
          as={Link}
          href="/dashboard/history"
          isIconOnly={isCompact}
          className={`${
            isCompact ? "" : "flex justify-start"
          } w-full text-gray-800 ${
            pathname === "/dashboard/history"
              ? "bg-slate-50"
              : "bg-slate-50/50"
          } hover:bg-slate-50 transition-all duration-400`}
          startContent={<FaHistory size={22} />}
        >
          <p className={isCompact ? "hidden" : ""}>History</p>
        </Button>
      </div>
      <div>
        <Button
          onPress={handleLogOut}
          isIconOnly={isCompact}
          className={`${
            isCompact ? "" : "flex justify-start"
          } w-full bg-slate-50 text-gray-800`}
        >
          <SlLogout size={18} color="#ef4444" />{" "}
          <p className={isCompact ? "hidden" : "text-red-500"}>Log Out</p>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
