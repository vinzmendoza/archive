import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { HiOutlineMoon, HiOutlineSun, HiUser, HiLogout } from "react-icons/hi";

import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../utils/context/Auth";
import { useAvatar } from "../utils/context/Avatar";
import Avatar from "./Avatar";
// import { useAvatar } from "../utils/context/Avatar";
// import Avatar from "./Avatar";

const PopoverMenu = ({ state: isActive, setIsActive }) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const { user } = useAuth();
  const { profile } = useAvatar();

  // const { avatarUrl } = useAvatar();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleToggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setIsActive(false);
    } catch (err) {
      throw new Error(err);
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="absolute right-0 px-4 py-6 mt-1 z-[60] rounded shadow-lg dark:bg-zinc-600 bg-zinc-200">
      <div className="flex flex-row items-center mb-4">
        <div className={`relative w-12 h-12 overflow-hidden`}>
          {profile.avatar_url ? (
            <Avatar url={profile.avatar_url} size={12} />
          ) : (
            <div
              className={`relative flex items-center justify-center w-12 h-12 overflow-hidden bg-zinc-300 dark:bg-zinc-400 rounded-full `}
            >
              <span className="text-5xl">{user.email.charAt(0)}</span>
            </div>
          )}
        </div>
        <p className="ml-4">{user.email}</p>
      </div>
      <div>
        <NextLink href="/profile" passHref>
          <div className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-400">
            <HiUser size={18} />
            <p className="ml-2">Profile</p>
          </div>
        </NextLink>

        <div className="flex items-center justify-between p-2 cursor-pointer">
          <div className="flex items-center">
            {resolvedTheme === "dark" ? (
              <HiOutlineMoon size={18} />
            ) : (
              <HiOutlineSun size={18} />
            )}
            <p className="ml-2">Theme</p>
          </div>
          <div
            className="relative flex p-1 rounded-full w-14 bg-zinc-400 dark:bg-zinc-900 group"
            onClick={handleToggleTheme}
          >
            <button
              aria-label="Toggle Dark Mode"
              type="button"
              className={`relative flex items-center justify-center transition-all bg-gray-600 rounded-full w-6 h-6 ring-gray-900 group-hover:ring-2 dark:ring-gray-500 dark:bg-gray-400 ${
                resolvedTheme === "dark" ? "translate-x-6" : ""
              }`}
            ></button>
          </div>
        </div>

        <div
          onClick={signOut}
          className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-400"
        >
          <HiLogout size={18} />
          <p className="ml-2">Sign out</p>
        </div>
      </div>
    </div>
  );
};

export default PopoverMenu;
