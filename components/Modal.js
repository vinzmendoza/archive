import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";

import { HiX } from "react-icons/hi";

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
          <div className="w-full h-full p-8 rounded dark:bg-zinc-800 bg-zinc-400">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl">{title}</h2>
              <button
                className="p-1 rounded hover:bg-blue-400"
                onClick={handleCloseClick}
              >
                <HiX size={24} />
              </button>
            </div>
            <div className="py-2">
              <form onSubmit={handleSubmit(onSearch)} className="">
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
              {children}
            </div>
            <div className="flex justify-between">
              <button
                className="w-16 p-2 rounded hover:bg-blue-500"
                onClick={handleCloseClick}
              >
                Close
              </button>
              <button
                className="w-16 p-2 bg-blue-500 divide-x rounded hover:bg-red-700"
                onClick={operation}
              >
                {title}
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="fixed inset-0 z-50 flex flex-col w-full h-full p-4 sm:items-center sm:justify-center dark:bg-zinc-900/70 bg-zinc-400/70">
        <div className="sm:w-96" ref={modalRef}>
          <div className="w-full h-full p-8 rounded dark:bg-zinc-800 bg-zinc-400">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl">{title}</h2>
              <button
                className="p-1 rounded hover:bg-blue-400"
                onClick={handleCloseClick}
              >
                <HiX size={24} />
              </button>
            </div>
            <div className="py-2">{children}</div>
            <div className="flex justify-between">
              <button
                className="w-16 p-2 rounded hover:bg-blue-500"
                onClick={handleCloseClick}
              >
                Close
              </button>
              <button
                className="w-16 p-2 bg-red-500 divide-x rounded hover:bg-red-700"
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
