import { useRouter } from "next/router";
import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRemark } from "react-remark";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { javascript } from "@codemirror/lang-javascript";
import { toast } from "react-toastify";

import Auth from "../../components/Auth";
import PageLayout from "../../components/Layout/PageLayout";
import { useAuth } from "../../utils/context/Auth";
import { supabase } from "../../utils/supabaseClient";
import { useTheme } from "next-themes";
import { HiXCircle } from "react-icons/hi";
import { useDetectClickOutside } from "../../utils/hooks/useDetectClickOutside";
import Modal from "../../components/Modal";

const Item = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [removedTags, setRemovedTags] = useState([]);

  const [reactContent, setMarkdownSource] = useRemark();
  const { resolvedTheme } = useTheme();

  const modalRef = useRef(null);
  const [isActive, setIsActive] = useDetectClickOutside(modalRef, false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      let { data, error } = await supabase
        .from("items")
        .select(
          `
              id, title, content,
              tags (id, name)
          `
        )
        .eq("id", id)
        .single();

      if (error) {
        router.push("/404");
        return;
      }

      setItem(data);
      setMarkdownSource(data.content);
      setIsLoading(false);
    };

    fetchItem();
  }, [id, setMarkdownSource, router]);

  const checkKeyDown = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") e.preventDefault();
  };

  const addTags = (e) => {
    let input = e.target.value.replace(/[, !@#$%^&*]+/g, " ").trim();
    if (input.length === 0 || input[0] === "") return;
    // //check if input tag is present already
    if (item.tags.filter((tag) => tag.name === input).length > 0) {
      setError("tags", {
        type: "duplicate",
        message: "No duplicate tags allowed",
      });
      return;
    } else {
      clearErrors("tags");
    }

    // setPrevTags([...prevTags, input]);
    setItem({ ...item, tags: [...item.tags, { name: input }] });
    setValue("tags", [...item.tags, { name: input }]);

    e.target.value = "";
  };

  const removeTag = (indexToRemove) => {
    setItem({
      ...item,
      tags: item.tags.filter((_, index) => index !== indexToRemove),
    });

    setRemovedTags([
      ...removedTags,
      item.tags.filter((_, index) => index === indexToRemove),
    ]);

    setValue(
      "tags",
      item.tags.filter((_, index) => index !== indexToRemove)
    );
  };

  const onUpdate = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      // update title and markdown
      const { data: item_data, error: item_error } = await supabase
        .from("items")
        .update([{ title: data.title, content: data.markdown }])
        .eq("id", item.id);

      //check input tags
      if (data.tags === undefined || data.tags === null) return;
      if (data.tags.length > 6) {
        setError("tags", {
          type: "exceed",
          message: "Maximum of 6 tags only",
        });
        return;
      } else {
        clearErrors("tags");
      }
      //add new tags
      const addNewTags = await Promise.all(
        data.tags.map(async (tag) => {
          //check if tag is found on db
          const { data: db_tag, error: db_tag_error } = await supabase
            .from("tags")
            .select()
            .eq("name", tag.name);

          // add new tag if it doesnt exists yet.
          if (Object.keys(db_tag).length === 0) {
            // console.log(tag);
            const { data: added_tag, error: added_tag_error } = await supabase
              .from("tags")
              .insert([
                {
                  name: tag.name,
                  created_by: user.id,
                },
              ]);

            //get id of newly created tag
            const { data: new_tag_id, error: new_tag_id_error } = await supabase
              .from("tags")
              .select("id")
              .eq("name", tag.name);

            //add row to junction table
            const { data: new_tag_item_rel, error: new_tag_item_rel_error } =
              await supabase.from("items_tags").insert([
                {
                  item_id: item.id,
                  tag_id: new_tag_id[0].id,
                  created_by: user.id,
                },
              ]);

            return;
          }
          // if tag exists, do not add existing tag but add relation of existing tag to junction table.
          // check also if items_tags has existing tag and item relationship already.
          const { data: rel_data, error: rel_error } = await supabase
            .from("items_tags")
            .select()
            .eq("tag_id", db_tag[0].id)
            .eq("item_id", item.id);

          if (rel_data.length !== 0) return;
          const { data: existing_tag_rel, error: existing_tag_rel_error } =
            await supabase.from("items_tags").insert([
              {
                item_id: item.id,
                tag_id: db_tag[0].id,
                created_by: user.id,
              },
            ]);
        })
      );

      const deleteTags = await Promise.all(
        removedTags.map(async (removedTag) => {
          //find in db the tag to be removed
          const { data: tag_to_delete, error: tag_to_delete_error } =
            await supabase.from("tags").select().eq("name", removedTag[0].name);

          if (tag_to_delete.length === 0) return;
          const { data: item_tag_data, error: item_tag_data_error } =
            await supabase
              .from("items_tags")
              .select()
              .eq("item_id", item.id)
              .eq("tag_id", tag_to_delete[0].id);
          //delete row from items_tags table
          if (item_tag_data.length !== 0) {
            const { data: del_item_tag, error: del_item_tag_error } =
              await supabase
                .from("items_tags")
                .delete()
                .match({ item_id: item.id, tag_id: tag_to_delete[0].id });
            // return;
          }
          //delete tag from tags table if a tag has no more relation in items_tags table
          console.log("deleting tag if no junction row related");
          const { data: del_tag, error: del_tag_error } = await supabase
            .from("tags")
            .delete()
            .match({ id: tag_to_delete[0].id });
        })
      );
    } catch (error) {
      console.log(error);
      // notify("error", "There seems to be a problem, please try again.");
      toast.error("There seems to be a problem, please try again.", {
        theme: resolvedTheme,
      });
    } finally {
      setIsSubmitting(false);
      console.log("submitted");
      // notify("success", "Item successfully updated!");
      toast.success("Item successfully updated!", {
        theme: resolvedTheme,
      });
    }

    // for testing
    // try {
    //   setIsSubmitting(true);
    //   const { data, error } = await supabase
    //     .from("items")
    //     .select()
    //     .eq("id", id);
    //   if (error) console.log(error);
    // } catch (err) {
    //   console.log(err);
    //   // notify("error", "Error!");
    //   throw new Error(err);
    // } finally {
    //   setIsSubmitting(false);
    //   // notify("success", "Item successfully updated!");
    //   toast.success("Item successfully updated!", { theme: resolvedTheme });
    // }
  });

  const openModal = (e) => {
    e.preventDefault();
    setIsActive(true);
  };

  const onDelete = handleSubmit(async (data) => {
    let tempTags = [];

    try {
      setIsDeleting(true);
      item.tags.map((tag) => {
        if (!tag.id) return;
        tempTags = [...tempTags, tag];
      });

      //delete the item's relation from junction table
      const { data: item_tag_rel, error: item_tag_rel_error } = await supabase
        .from("items_tags")
        .delete()
        .match({ item_id: item.id });

      //check if item's tags has other relations with other items. if none, delete tag from tags table
      const checkTags = await Promise.all(
        tempTags.map(async (tag) => {
          // console.log(tag);
          const { data: tag_in_junction, error: tag_in_junction_error } =
            await supabase
              .from("items_tags")
              .select()
              .match({ tag_id: tag.id });

          // console.log(tag_in_junction);
          if (tag_in_junction.length !== 0) return;

          const { data: delete_tag, error: delete_tag_error } = await supabase
            .from("tags")
            .delete()
            .match({ id: tag.id });
        })
      );

      //delete the item
      const { data: item_del, error: item_del_error } = await supabase
        .from("items")
        .delete()
        .match({ id: item.id });

      router.push("/");
    } catch (err) {
      toast.error("There seems to be a problem, please try again.", {
        theme: resolvedTheme,
      });
    } finally {
      setIsDeleting(false);
      toast.success("Item successfully deleted!", { theme: resolvedTheme });
    }
  });

  const handleOnChangeVal = (value, e) => {
    if (value === undefined || value === "") value = "";
    setMarkdownSource(value);
    setValue("markdown", value);
  };

  if (!user) return <Auth />;

  if (isLoading) {
    return (
      <PageLayout title="Archive">
        <p>loading...</p>
      </PageLayout>
    );
  }

  if (!item && Object.keys(item).length === 0) {
    return (
      <PageLayout title="">
        <p>Can&apos;t retrieve item. Please try again</p>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout title="Item">
        <form onKeyDown={(e) => checkKeyDown(e)}>
          <div className="flex items-center justify-between mb-4">
            <button
              className="flex p-2 bg-green-400 rounded cursor-pointer dark:bg-green-600 dark:hover:bg-green-500 hover:bg-green-500 disabled:bg-gray-500"
              disabled={isSubmitting}
              onClick={onUpdate}
            >
              {/* {isSubmitting && (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 ..."
                      viewBox="0 0 24 24"
                    ></svg>
                  )} */}
              {isSubmitting ? "Updating" : "Update"}
            </button>
            <button
              className="p-2 text-gray-100 bg-red-500 rounded cursor-pointer hover:bg-red-600"
              onClick={openModal}
            >
              {isDeleting ? "Deleting" : "Delete"}
            </button>
          </div>
          <div className="flex flex-col mb-4 space-y-2">
            <input
              {...register("title", { required: true })}
              className="px-4 py-2 rounded shadow bg-zinc-50 dark:bg-zinc-700"
              placeholder="Title..."
              defaultValue={item.title}
            />

            <span>
              {errors.title?.type === "required" && "Title is required"}
            </span>

            <div className="p-2 rounded shadow bg-zinc-50 focus-within:outline focus-within:outline-2 dark:bg-zinc-700 ">
              <ul className="flex flex-wrap items-start justify-start">
                {item.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-center px-3 py-1 mb-2 mr-2 bg-blue-400 rounded"
                  >
                    {tag.name}
                    <i
                      onClick={() => removeTag(index)}
                      className="ml-1 cursor-pointer"
                    >
                      <HiXCircle size={22} className="hover:text-gray-800" />
                    </i>
                  </li>
                ))}
              </ul>
              <input
                // {...register("tags")}
                maxLength={45}
                className="w-full mt-2 ml-2 bg-zinc-50 dark:bg-zinc-700 focus:outline-none"
                placeholder="Enter a comma after each tag..."
                onKeyUp={(e) => (e.key === "," ? addTags(e) : null)}
                onBlur={(e) => addTags(e)}
              />
            </div>
            <span>{errors.tags && errors.tags?.message}</span>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 auto-cols-auto sm:gap-x-4 gap-y-4">
            <CodeMirror
              {...register("markdown")}
              value={item ? item.content : ""}
              height="60vh"
              extensions={[
                markdown({
                  base: markdownLanguage,
                  codeLanguages: languages,
                }),
                javascript({ jsx: "true" }),
              ]}
              onChange={(value, viewUpdate) => {
                handleOnChangeVal(value);
              }}
              className="prose rounded shadow dark:prose-invert focus-within:outline-2 focus-within:outline"
              theme={resolvedTheme === "dark" ? "dark" : "light"}
            />

            <div className="p-4 overflow-y-auto prose bg-white rounded shadow-xl dark:bg-zinc-800 dark:prose-invert h-60v">
              {reactContent}
            </div>
          </div>
        </form>
        <Modal
          modalRef={modalRef}
          onClose={() => setIsActive(false)}
          show={isActive}
          title="Delete"
          type="Warning"
          operation={onDelete}
        >
          Are you sure you want to delete this item? This item will be deleted
          permanently and cannot be retrieved.
        </Modal>
      </PageLayout>
    </>
  );
};

export default Item;
