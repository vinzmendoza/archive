import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../../utils/context/Auth";
import PageLayout from "../../../components/Layout/PageLayout";
import Auth from "../../../components/Auth";
import Item from "../../items/item";

const Tag = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);

  const router = useRouter();
  const { val } = router.query;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!val) return;

    try {
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

        setItems(data);
      };

      fetchItem();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [val, router]);

  if (!user) return <Auth />;

  if (loading) {
    return <PageLayout title="Home">loading...</PageLayout>;
  }

  if (!items.length) {
    return (
      <PageLayout title="Search Results">
        <p>No data to show</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Search Results">
      <p>Tags</p>
      <div className="flex flex-col mt-12 space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:space-y-0 sm:gap-4">
        {items.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Tag;
