import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";

import { HiSearch, HiX } from "react-icons/hi";
import { useDetectClickOutside } from "../utils/hooks/useDetectClickOutside";
import SearchSelect from "./SearchSelect";

const Modal = ({
  onClose,
  show,
  title,
  type,
  children,
  modalRef,
  operation,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = "");
  }, [show]);

  const categoryRef = useRef(null);
  const [isCategoryActive, setIsCategoryActive] = useDetectClickOutside(
    categoryRef,
    false
  );

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const onSearch = (data) => {
    if (!data.val) return;
    operation(data);
    onClose();
  };

  const modalContent = show ? (
    type === "Search" ? (
      <div className="fixed inset-0 z-50 flex flex-col w-full h-full p-4 sm:items-center sm:justify-center dark:bg-zinc-900/70 bg-zinc-400/70">
        <div className="sm:w-96" ref={modalRef}>
          <div className="relative w-full h-full p-8 rounded-md dark:bg-zinc-800 bg-zinc-200">
            <button
              className="absolute top-0 right-0 p-1 mt-2 mr-2 rounded-md hover:bg-zinc-400 group"
              onClick={handleCloseClick}
            >
              <HiX size={24} className="group-hover:text-zinc-100" />
            </button>
            <h2 className="my-4 text-xl font-bold">{title}</h2>
            <form onSubmit={handleSubmit(onSearch)}>
              <div className="pb-4">
                <div className="flex flex-col">
                  <div className="flex items-center w-full mb-2 bg-white rounded-md focus-within:outline-2 focus-within:outline dark:bg-zinc-700">
                    <button
                      className="p-2 transition ease-in-out rounded-l-md hover:bg-zinc-300 hover:dark:bg-zinc-600"
                      type="submit"
                    >
                      <HiSearch size={24} />
                    </button>
                    <input
                      placeholder="Search"
                      {...register("val")}
                      className="w-full p-2 rounded-md focus:outline-none dark:bg-zinc-700"
                    />
                  </div>
                  <SearchSelect
                    toggle={() => setIsCategoryActive(!isCategoryActive)}
                    isActive={isCategoryActive}
                    categoryRef={categoryRef}
                    isModal={true}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  className="px-6 py-2 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  onClick={handleCloseClick}
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 bg-blue-500 divide-x rounded-md text-zinc-100 hover:bg-blue-600"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) : (
      <div className="fixed inset-0 z-50 flex flex-col w-full h-full p-4 sm:items-center sm:justify-center dark:bg-zinc-900/70 bg-zinc-400/70">
        <div className="sm:w-96" ref={modalRef}>
          <div className="relative w-full h-full p-8 rounded-md dark:bg-zinc-800 bg-zinc-200">
            <button
              className="absolute top-0 right-0 p-1 mt-2 mr-2 rounded-md hover:bg-zinc-400 group"
              onClick={handleCloseClick}
            >
              <HiX size={24} className="group-hover:text-zinc-100" />
            </button>
            <h2 className="my-4 text-xl font-bold">{title}</h2>

            <div className="py-2">{children}</div>
            <div className="flex justify-between">
              <button
                className="px-6 py-2 font-semibold rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600"
                onClick={handleCloseClick}
              >
                Close
              </button>
              <button
                className="px-6 py-2 font-semibold bg-red-500 divide-x rounded-md hover:bg-red-600 text-zinc-100"
                onClick={operation}
              >
                {title}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
