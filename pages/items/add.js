import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useRemark } from "react-remark";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { javascript } from "@codemirror/lang-javascript";
import { HiXCircle } from "react-icons/hi";
import { useRouter } from "next/router";

import Auth from "../../components/Auth";
import PageLayout from "../../components/Layout/PageLayout";
import { useAuth } from "../../utils/context/Auth";
import { useTheme } from "next-themes";
import { supabase } from "../../utils/supabaseClient";
import { toast } from "react-toastify";
import Spinner from "../../components/svg/Spinner";

const Add = () => {
  const [reactContent, setMarkdownSource] = useRemark();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [tags, setTags] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const checkKeyDown = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") e.preventDefault();
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const authUser = supabase.auth.user();

      //add title of item
      const { data: item_data, error: item_error } = await supabase
        .from("items")
        .insert([
          {
            title: data.title,
            content: data.markdown ? data.markdown : "",
            created_by: authUser.id,
          },
        ]);

      //if no tags added, return
      if (data.tags === undefined || data.tags === null) return;

      const asyncRes = await Promise.all(
        //check db if data input already exists
        data.tags.map(async (tag) => {
          const { data: dupe_tag, error: dupe_tag_error } = await supabase
            .from("tags")
            .select()
            .eq("name", tag);

          //if  tag exists in db, add relation in junction table
          if (dupe_tag.length !== 0) {
            const { data: item_tag_rel, error: item_tag_rel_error } =
              await supabase.from("items_tags").insert([
                {
                  item_id: item_data[0].id,
                  tag_id: dupe_tag[0].id,
                  created_by: authUser.id,
                },
              ]);
          }

          // if tag doesnt exist in db, add tag to tag table and relation in junction table
          if (dupe_tag.length === 0) {
            const { data: tag_data, error: tag_error } = await supabase
              .from("tags")
              .insert([
                {
                  name: tag,
                  created_by: authUser.id,
                },
              ]);

            const { data: item_tag_rel, error: item_tag_rel_error } =
              await supabase.from("items_tags").insert([
                {
                  item_id: item_data[0].id,
                  tag_id: tag_data[0].id,
                  created_by: authUser.id,
                },
              ]);
          }
        })
      );
    } catch (err) {
      toast.error("There seems to be a problem, please try again.", {
        theme: resolvedTheme,
      });
    } finally {
      setIsSubmitting(false);
      toast.success("Item successfully added!", {
        theme: resolvedTheme,
      });
      router.push("/");
    }
  };

  const { user, signOut } = useAuth();

  if (!user) return <Auth />;

  const handleOnChangeVal = (value, e) => {
    if (value === undefined || value === "") value = "";
    setMarkdownSource(value);
    setValue("markdown", value);
  };

  const addTags = (e) => {
    let input = e.target.value.replace(/[, !@#$%^&*]+/g, " ").trim();

    if (input.length === 0 || input[0] === "") return;

    if (tags.includes(input)) {
      setError("tags", {
        type: "duplicate",
        message: "No duplicate tags allowed",
      });
      return;
    } else {
      clearErrors("tags");
    }

    setTags([...tags, input]);
    setValue("tags", [...tags, input]);

    e.target.value = "";
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
    setValue(
      "tags",
      tags.filter((_, index) => index !== indexToRemove)
    );

    if (tags.length <= 7) {
      clearErrors("tags");
    }
  };

  return (
    <PageLayout title="Add Item">
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <h2 className="mb-4 text-2xl">Add Post</h2>

        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="mb-2 text-sm text-zinc-700 dark:text-zinc-200 after:content-['*'] after:ml-0.5"
          >
            Title
          </label>
          <input
            {...register("title", { required: true })}
            className={`px-4 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 ${
              errors?.title && "border-2 border-red-400"
            }`}
            placeholder="Title"
          />
          <span className="h-8 pt-1 text-xs text-red-400">
            {errors.title?.type === "required" && "Title is required"}
          </span>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="tags"
            className="mb-2 text-sm text-zinc-700 dark:text-zinc-200"
          >
            Tags
          </label>
          <div className="p-2 rounded bg-zinc-50 focus-within:outline focus-within:outline-2 dark:bg-zinc-800">
            <ul className="flex flex-wrap items-start justify-start">
              {tags.map((tag, index) => (
                <li
                  key={index}
                  className="flex items-center justify-center py-1 pl-3 pr-2 mb-2 mr-2 transition ease-in-out rounded-md bg-zinc-200 dark:bg-zinc-600 dark:hover:bg-zinc-700 hover:bg-zinc-300"
                >
                  {tag}
                  <i
                    onClick={() => removeTag(index)}
                    className="ml-1 cursor-pointer"
                  >
                    <HiXCircle
                      size={22}
                      className="transition ease-in-out hover:text-zinc-50 dark:hover:text-zinc-400"
                    />
                  </i>
                </li>
              ))}
            </ul>
            <input
              maxLength={45}
              className="w-full mt-2 ml-2 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
              placeholder="Enter a comma after each tag..."
              onKeyUp={(e) => (e.key === "," ? addTags(e) : null)}
              onBlur={(e) => addTags(e)}
            />
          </div>
          <span className="h-8 pt-1 text-xs text-red-400">
            {errors.tags && errors.tags?.message}
          </span>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="markdown"
            className="mb-2 text-sm text-zinc-700 dark:text-zinc-200"
          >
            Content
          </label>
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <CodeMirror
              {...register("markdown")}
              value=""
              height="70vh"
              extensions={[
                markdown({ base: markdownLanguage, codeLanguages: languages }),
                javascript({ jsx: "true" }),
              ]}
              onChange={(value, viewUpdate) => {
                handleOnChangeVal(value);
              }}
              className="w-full prose rounded-md dark:prose-invert focus-within:outline-2 focus-within:outline"
              theme={resolvedTheme === "dark" ? "dark" : "light"}
            />
            <div className="w-full p-4 prose rounded-md bg-zinc-50 dark:prose-invert dark:bg-zinc-800 h-70v">
              {reactContent}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="flex justify-center w-32 px-6 py-2 font-semibold bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 text-zinc-100"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Submit"}
          </button>
        </div>
      </form>
    </PageLayout>
  );
};

export default Add;
