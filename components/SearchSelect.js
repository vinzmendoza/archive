import { useRouter } from "next/router";
import { HiChevronDown } from "react-icons/hi";
import { useSearch } from "../utils/context/Search";

const SearchSelect = ({ toggle, isActive, categoryRef, isModal }) => {
  const { category, setCategory, loading, categories } = useSearch();
  return (
    <div className={`relative h-auto ${isModal ? "w-28" : "w-36 ml-2"}`}>
      <div
        onClick={toggle}
        ref={categoryRef}
        tabIndex={0}
        className={`flex justify-between items-center p-2 rounded-md  cursor-pointer h-auto ${
          isModal
            ? "bg-zinc-50 dark:bg-zinc-700 "
            : "bg-zinc-50 dark:bg-zinc-800 "
        } ${isActive && "focus:outline focus:outline-2 focus:outline-inherit"}`}
      >
        {!loading &&
          category.value.charAt(0).toUpperCase() + category.value.slice(1)}

        <HiChevronDown
          size={18}
          className={`ml-4 ${
            isActive
              ? "rotate-180 transition ease-in-out"
              : "rotate-360 transition ease-in-out"
          }`}
        />
      </div>
      <div
        className={`${isActive ? "inline" : "hidden"} absolute p-2 rounded-md ${
          isModal
            ? "bg-zinc-50 dark:bg-zinc-600"
            : "bg-zinc-50 dark:bg-zinc-700"
        } w-32 mt-2`}
      >
        {categories.map((categoryItem, index) => (
          <div
            key={categoryItem.id}
            onClick={() => setCategory(categoryItem)}
            className="p-2 transition ease-in-out rounded-md cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-600"
          >
            {categoryItem.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSelect;
