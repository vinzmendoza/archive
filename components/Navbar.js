import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { HiSearch } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import Modal from "./Modal";
import { useDetectClickOutside } from "../utils/hooks/useDetectClickOutside";
import PopoverMenu from "./PopoverMenu";
import { useAvatar } from "../utils/context/Avatar";
import Avatar from "./Avatar";
import SearchSelect from "./SearchSelect";
import { useSearch } from "../utils/context/Search";

const Navbar = () => {
  const router = useRouter();
  const { profile } = useAvatar();
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectClickOutside(dropdownRef, false);

  const modalRef = useRef(null);
  const [isModalActive, setIsModalActive] = useDetectClickOutside(
    modalRef,
    false
  );

  const categoryRef = useRef(null);
  const [isCategoryActive, setIsCategoryActive] = useDetectClickOutside(
    categoryRef,
    false
  );

  const { searchValue, category } = useSearch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (searchValue !== "") {
      setValue("val", searchValue);
    } else {
      setValue("val", "");
    }
  }, [searchValue, setValue]);

  const onSubmit = (data) => {
    if (!data.val) return;
    const searchVal = data.val;
    const searchCateg = category.value;

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
    <nav className="sticky top-0 z-50 backdrop-filter backdrop-blur-xl ">
      <div className="flex items-center justify-between p-4 mx-auto">
        <div>
          <NextLink href="/" passHref>
            <a className="font-bold uppercase ">Archive</a>
          </NextLink>
        </div>

        <div className="hidden lg:basis-1/3 sm:inline">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex">
              <div className="flex items-center w-full mr-2 rounded-md bg-zinc-50 dark:bg-zinc-800 focus-within:outline-2 focus-within:outline">
                <button
                  className="p-2 transition ease-in-out rounded-l-md hover:bg-zinc-300 hover:dark:bg-zinc-600"
                  type="submit"
                >
                  <HiSearch size={24} />
                </button>
                <input
                  placeholder="Search"
                  {...register("val")}
                  className="w-full py-2 pl-1 focus:outline-none rounded-r-md bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
              <SearchSelect
                toggle={() => setIsCategoryActive(!isCategoryActive)}
                isActive={isCategoryActive}
                categoryRef={categoryRef}
                isModal={false}
              ></SearchSelect>
            </div>
          </form>
        </div>

        <button className="sm:hidden" onClick={handleOpenModal}>
          <p className="flex items-center hover:text-zinc-400">
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
        title="Search Items"
        type="Search"
        operation={onSubmit}
      >
        Search
      </Modal>
    </nav>
  );
};

export default Navbar;
