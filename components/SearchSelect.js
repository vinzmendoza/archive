import { useRouter } from "next/router";

import { useSearch } from "../utils/context/Search";

const SearchSelect = ({ categories, toggle, isActive, categoryRef }) => {
  const { category, setCategory, loading } = useSearch();
  return (
    <div className="relative w-24 h-auto ">
      <div
        onClick={toggle}
        ref={categoryRef}
        className="p-2 ml-2 rounded-md cursor-pointer dark:bg-zinc-800"
      >
        {!loading &&
          category.value.charAt(0).toUpperCase() + category.value.slice(1)}
      </div>
      <div
        className={`${
          isActive ? "inline" : "hidden"
        } absolute p-2 rounded-md bg-zinc-700`}
      >
        {categories.map((categoryItem) => (
          <div
            key={categoryItem.id}
            onClick={() => setCategory(categoryItem)}
            className="p-2 rounded-md cursor-pointer hover:bg-zinc-600"
          >
            {categoryItem.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSelect;
