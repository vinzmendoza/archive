import { useEffect, useRef } from "react";
import NextLink from "next/link";
import { HiSearch, HiUser } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

import Modal from "./Modal";
import { useDetectClickOutside } from "../utils/hooks/useDetectClickOutside";
import PopoverMenu from "./PopoverMenu";
import { useAvatar } from "../utils/context/Avatar";
import Avatar from "./Avatar";

const Navbar = () => {
  const router = useRouter();
  // const { user } = useAuth();
  const { profile } = useAvatar();
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectClickOutside(dropdownRef, false);

  const modalRef = useRef(null);
  const [isModalActive, setIsModalActive] = useDetectClickOutside(
    modalRef,
    false
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(d)
    if (!data.val) return;
    const searchVal = data.val;
    const searchCateg = data.categ;

    router.push(`/search?val=${searchVal}&categ=${searchCateg}`);
  };

  const handleToggleMenu = () => {
    setIsActive(!isActive);
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsModalActive(true);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-filter backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 mx-auto">
        <div>
          <NextLink href="/" passHref>
            <a className="">Archive</a>
          </NextLink>
        </div>

        <div className="basis-1/3">
          <form onSubmit={handleSubmit(onSubmit)} className="hidden sm:inline">
            <div className="flex w-fullbasis-1/3 sm:border-2 sm:rounded">
              <input
                placeholder="Search..."
                {...register("val")}
                className="w-full px-4 py-2 "
              />

              <select
                {...register("categ")}
                className="pl-2"
                defaultValue="title"
              >
                <option value="title">Title</option>
                <option value="tags">Tags</option>
                <option value="content">Content</option>
              </select>
            </div>
          </form>
        </div>

        <button className="sm:hidden" onClick={handleOpenModal}>
          <p className="flex items-center hover:text-gray-400">
            <HiSearch size={18} className="" />{" "}
            <span className="ml-2">Search...</span>
          </p>
        </button>

        <div className="relative ml-2 sm:ml-0" ref={dropdownRef}>
          <button
            className="overflow-hidden "
            type="button"
            onClick={handleToggleMenu}
          >
            {profile.length === 0 ? (
              <div className="w-12 h-12 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
            ) : profile.avatar_url ? (
              <div className="relative w-12 h-12">
                <Avatar url={profile.avatar_url} />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-full bg-zinc-300 dark:bg-zinc-600">
                <span className="text-2xl uppercase">
                  {profile.email?.charAt(0)}
                </span>
              </div>
            )}
          </button>

          {isActive && <PopoverMenu state={{ isActive, setIsActive }} />}
        </div>
      </div>
      <Modal
        modalRef={modalRef}
        onClose={() => setIsModalActive(false)}
        show={isModalActive}
        title="Search"
        type="Search"
        operation={onSubmit}
      >
        Search
      </Modal>
    </nav>
  );
};

export default Navbar;
