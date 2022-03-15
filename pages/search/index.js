import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../utils/context/Auth";
import PageLayout from "../../components/Layout/PageLayout";
import Auth from "../../components/Auth";
import Item from "../items/item";
import Loader from "../../components/Loader";
import NoData from "../../components/svg/NoData";

const Search = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { val, categ } = router.query;

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!val || !categ) return;

    let query = supabase.from("items").select(
      `
          id, title, content,
          tags!inner(id, name)
      `
    );

    switch (categ) {
      case "title":
        query = query.textSearch("title", `${val}`, {
          type: "websearch",
          config: "english",
        });
        break;

      case "tags":
        query = query.textSearch("tags.name", `${val}`, {
          type: "websearch",
          config: "english",
        });
        break;

      case "content":
        query = query.textSearch("content", `${val}`, {
          type: "websearch",
          config: "english",
        });
        break;

      default:
        break;
    }

    try {
      setLoading(true);
      const fetchItems = async () => {
        let { data, error } = await query;

        if (error) {
          router.push("/404");
          return;
        }

        if (data) {
          const finalData = await Promise.all(
            data.map(async (item) => {
              let { data, error } = await supabase
                .from("items")
                .select(
                  `
              id, title, content,
              tags (id, name)
          `
                )
                .eq("id", item.id)
                .single();
              return data;
            })
          );
          setItems(finalData);
          setLoading(false);
        }
      };

      fetchItems();
    } catch (err) {
      console.log(err);
    }
  }, [val, categ, router]);

  if (!user) return <Auth />;

  if (loading)
    return (
      <PageLayout title="Loading">
        <Loader />
      </PageLayout>
    );

  if (!items.length) {
    return (
      <PageLayout title="No Data">
        <div className="flex flex-col items-center justify-center">
          <NoData />
          <div className="flex flex-col items-center justify-center">
            <h2 className="mt-16 mb-4 text-4xl text-center">
              Sorry we couldn&apos;t find <br />
              any <span className="italic dark:text-gray-500">
                {categ}
              </span>{" "}
              that matches{" "}
              <span className="italic dark:text-gray-500">{val}</span>
            </h2>
            <p className="">
              Please check the spelling or try searching with a different term
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Results">
      <h2 className="mb-4 text-3xl">Search Results </h2>
      <p className="text-sm dark:text-gray-300">
        Found {items.length} matches for &quot;{val}&quot;
      </p>
      <div className="flex flex-col mt-12 space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:space-y-0 sm:gap-4">
        {items &&
          items.length !== 0 &&
          items.map((item) => <Item item={item} key={item.id} />)}
      </div>
    </PageLayout>
  );
};

export default Search;
