import { useEffect, useState } from "react";
import NextLink from "next/link";

import Auth from "../components/Auth";
import PageLayout from "../components/Layout/PageLayout";
import { useAuth } from "../utils/context/Auth";
import { supabase } from "../utils/supabaseClient";
import Item from "./items/item";
import Loader from "../components/Loader";
import EmptyData from "../components/svg/EmptyData";

const Home = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [user?.id]);

  const fetchPosts = async () => {
    try {
      let { data, error } = await supabase
        .from("items")
        .select(
          `
          id, title, content,
          tags (id, name)
      `
        )
        .order("id", { ascending: false })
        .order("id", { foreignTable: "tags", ascending: true });

      if (error) console.log("error", error);
      setItems(data);
      setLoadingData(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!user) return <Auth />;

  if (loadingData) {
    return (
      <PageLayout title="Home">
        <Loader />
      </PageLayout>
    );
  }

  if (!items.length) {
    return (
      <PageLayout title="Home">
        <NextLink href="/items/add" passHref>
          <a className="px-6 py-3 text-lg font-bold transition ease-in-out bg-blue-400 rounded-full hover:bg-blue-500 text-zinc-50">
            Add Item
          </a>
        </NextLink>
        <div className="flex flex-col items-center justify-center h-50v">
          <EmptyData />
          <div className="flex flex-col items-center justify-center">
            <h2 className="mt-16 mb-4 text-4xl">It&apos;s empty here</h2>
            <p className="text-center">
              Click the{" "}
              <span className="text-zinc-400">&quot;Add Item&quot; </span>{" "}
              button
              <br /> to create a new item
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Home">
      <NextLink href="/items/add" passHref>
        <a className="px-6 py-3 text-lg font-bold transition ease-in-out bg-blue-400 rounded-full hover:bg-blue-500 text-zinc-50">
          Add Item
        </a>
      </NextLink>

      <div className="flex flex-col mt-12 space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:space-y-0 sm:gap-8">
        {items.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Home;
