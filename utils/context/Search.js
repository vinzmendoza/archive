import { useContext, useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";

const SearchContext = createContext();

export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});

  const { val, categ } = router.query;

  useEffect(() => {
    if (categ || val) {
      setCategory({ value: categ });
      setSearchValue(val);
      setLoading(false);
    }
    if (router.pathname !== "/search") {
      setCategory({ value: "title" });
      setSearchValue("");
      setLoading(false);
    }
  }, [val, categ, loading, router.pathname]);

  const categories = [
    { id: 1, title: "Title", value: "title" },
    { id: 2, title: "Tags", value: "tags" },
    { id: 3, title: "Content", value: "content" },
  ];

  const value = {
    searchValue,
    category,
    setSearchValue,
    setCategory,
    categories,
    loading,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
