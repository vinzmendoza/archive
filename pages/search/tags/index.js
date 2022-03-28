import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../../utils/context/Auth";
import PageLayout from "../../../components/Layout/PageLayout";
import Auth from "../../../components/Auth";
import Item from "../../../components/Item";
import Loader from "../../../components/Loader";
import NoData from "../../../components/svg/NoData";

const Tag = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);

  const router = useRouter();
  const { val } = router.query;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!val) return;

    try {
      setLoading(true);
      const fetchItem = async () => {
        let { data, error } = await supabase
          .from("items")
          .select(
            `
                id, title, content,
                tags!inner(id, name)
            `
          )
          .like("tags.name", `%${val}%`);

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

      fetchItem();
    } catch (err) {
      console.log(err);
    }
  }, [val, router]);

  if (!user) return <Auth />;

  if (loading) {
    return (
      <PageLayout title="Home">
        <Loader />
      </PageLayout>
    );
  }

  if (!items.length) {
    return (
      <PageLayout title="Search Results">
        <div className="flex flex-col items-center justify-center">
          <NoData />
          <div className="flex flex-col items-center justify-center">
            <h2 className="mt-16 mb-4 text-4xl text-center">
              Sorry we couldn&apos;t find <br />a tag that matches{" "}
              <span className="italic text-zinc-400 dark:text-zinc-500">
                &quot;{val}&quot;
              </span>
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
    <PageLayout title="Search Results">
      <h2 className="mb-4 text-3xl">Tags Results </h2>
      <p className="text-sm dark:text-zinc-300">
        Found {items.length} {items.length > 1 ? "matches" : "match"} with tag
        including <span className="italic ">&quot;{val}&quot;</span>
      </p>
      <div className="flex flex-col mt-12 space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:space-y-0 sm:gap-4">
        {items.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Tag;
