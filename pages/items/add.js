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

const Add = () => {
  const [reactContent, setMarkdownSource] = useRemark();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [tags, setTags] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // const notify = useCallback((type, message) => {
  //   toast({ type, message });
  // }, []);

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
    console.log(data.tags.length);
    try {
      setIsSubmitting(true);
      const authUser = supabase.auth.user();

      //if no tags added, return
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

      //add title of item
      const { data: item_data, error: item_error } = await supabase
        .from("items")
        .insert([
          {
            title: data.title,
            content: data.markdown,
            created_by: authUser.id,
          },
        ]);

      const asyncRes = await Promise.all(
        //check db if data input already exists
        data.tags.map(async (tag) => {
          const { data: dupe_tag, error: dupe_tag_error } = await supabase
            .from("tags")
            .select()
            .eq("name", tag);

          console.log(dupe_tag);

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
      // notify("error", "There seems to be a problem, please try again.");
    } finally {
      setIsSubmitting(false);
      if (data.tags.length > 6) return;
      toast.success("Item successfully added!", {
        theme: resolvedTheme,
      });
      router.push("/");

      // notify("success", "Item successfully added!");
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
          <label htmlFor="title" className="mb-2 text-sm text-gray-200">
            Title
          </label>
          <input
            {...register("title", { required: true })}
            className="px-4 py-2 rounded-md shadow bg-gray-50 dark:bg-gray-800"
            placeholder="Title"
          />
          <span className="h-8 pt-1 text-xs text-red-400">
            {errors.title?.type === "required" && "Title is required"}
          </span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="tags" className="mb-2 text-sm text-gray-200">
            Tags
          </label>
          <div className="p-2 rounded bg-gray-50 focus-within:outline focus-within:outline-2 dark:bg-gray-800">
            <ul className="flex flex-wrap items-start justify-start">
              {tags.map((tag, index) => (
                <li
                  key={index}
                  className="flex items-center justify-center py-1 pl-3 pr-2 mb-2 mr-2 bg-gray-600 rounded-md"
                >
                  {tag}
                  <i
                    onClick={() => removeTag(index)}
                    className="ml-1 cursor-pointer"
                  >
                    <HiXCircle size={22} />
                  </i>
                </li>
              ))}
            </ul>
            <input
              maxLength={45}
              className="w-full mt-2 ml-2 bg-white dark:bg-gray-800 focus:outline-none"
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
          <label htmlFor="markdown" className="mb-2 text-sm text-gray-200">
            Content
          </label>
          <div className="flex flex-col sm:grid sm:grid-cols-2 auto-cols-auto sm:gap-x-4 gap-y-4">
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
              className="prose rounded-md shadow dark:prose-invert focus-within:outline-2 focus-within:outline"
              theme={resolvedTheme === "dark" ? "dark" : "light"}
            />
            <div className="p-4 overflow-y-auto prose bg-white rounded-md shadow-xl dark:bg-gray-800 dark:prose-invert h-70v">
              {reactContent}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <input
            type="submit"
            className="p-2 bg-green-600 rounded cursor-pointer hover:bg-green-800"
            value={isSubmitting ? "Submitting" : "Submit"}
          />
        </div>
      </form>
    </PageLayout>
  );
};

export default Add;
