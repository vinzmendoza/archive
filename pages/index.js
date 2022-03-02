import { useEffect, useState } from "react";
import NextLink from "next/link";

import Auth from "../components/Auth";
import PageLayout from "../components/Layout/PageLayout";
import { useAuth } from "../utils/context/Auth";
import { supabase } from "../utils/supabaseClient";
import Item from "./items/item";

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
        .order("id", { ascending: false });

      if (error) console.log("error", error);
      setItems(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  if (!user) return <Auth />;

  if (loadingData) {
    return <PageLayout title="Home">loading...</PageLayout>;
  }

  if (!items?.length) {
    return (
      <PageLayout title="Home">
        <p>No data to show</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Home">
      <NextLink href="/items/add" passHref>
        <a className="p-2 border rounded">Add Item</a>
      </NextLink>
      <div className="flex flex-col mt-12 space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:space-y-0 sm:gap-4">
        {items.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Home;
