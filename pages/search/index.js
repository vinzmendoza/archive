// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";

// import { supabase } from "../../utils/supabaseClient";
// import { useAuth } from "../../utils/context/Auth";
// import PageLayout from "../../components/Layout/PageLayout";
// import Auth from "../../components/Auth";
// import Item from "../items/item";

// const Search = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { val, categ } = router.query;

//   const [loadingData, setLoadingData] = useState(false);
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     setLoadingData(true);

//     if (!val || !categ) return;

//     let query = supabase.from("items").select(
//       `
//           id, title, content,
//           tags!inner(id, name)
//       `
//     );

//     switch (categ) {
//       case "title":
//         query = query.textSearch("title", `${val}`, {
//           type: "websearch",
//           config: "english",
//         });
//         break;

//       case "tags":
//         query = query.textSearch("tags.name", `${val}`, {
//           type: "websearch",
//           config: "english",
//         });
//         break;

//       case "content":
//         query = query.textSearch("content", `${val}`, {
//           type: "websearch",
//           config: "english",
//         });
//         break;

//       default:
//         break;
//     }

//     try {
//       const fetchItem = async () => {
//         let { data, error } = await query;

//         if (error) {
//           console.log(error);
//           // router.push("/404");
//           return;
//         }

//         setFilteredData(data);
//       };

//       fetchItem();
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoadingData(false);
//     }
//   }, [val, categ, router]);

//   if (!user) return <Auth />;

//   if (loadingData) {
//     return <PageLayout title="Home">loading...</PageLayout>;
//     // console.log(loadingData);
//   }

//   if (filteredData.length === 0 && !loadingData) {
//     return (
//       <PageLayout title={`Results "asdasd"`}>
//         <p>no data to show</p>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout title={`Results "red"`}>
//       <p>Search</p>
//       <div className="flex flex-col mt-12 space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:space-y-0 sm:gap-4">
//         {filteredData &&
//           filteredData.map((item) => <Item item={item} key={item.id} />)}
//       </div>
//     </PageLayout>
//   );
// };

// export default Search;

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
      const fetchItems = async () => {
        let { data, error } = await query;

        if (error) {
          console.log(error);
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
            <h2 className="mt-16 mb-4 text-4xl">
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
      <p>Search Results</p>
      <div className="flex flex-col mt-12 space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:space-y-0 sm:gap-4">
        {items &&
          items.length !== 0 &&
          items.map((item) => <Item item={item} key={item.id} />)}
      </div>
    </PageLayout>
  );
};

export default Search;
