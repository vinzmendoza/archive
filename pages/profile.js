import { useCallback, useEffect, useState } from "react";
import Auth from "../components/Auth";
import PageLayout from "../components/Layout/PageLayout";
import { useRouter } from "next/router";

import { useAuth } from "../utils/context/Auth";
import { supabase } from "../utils/supabaseClient";
import Avatar from "../components/Avatar";
import { useAvatar } from "../utils/context/Avatar";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";

const Profile = () => {
  const { user } = useAuth();
  const { profile } = useAvatar();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState({});

  async function updateProfile(avatar_url) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      router.reload();
    }
  }

  async function uploadAvatar() {
    try {
      setLoading(true);

      if (
        !profileImage.target.files ||
        profileImage.target.files.length === 0
      ) {
        throw new Error("You must select an image to upload.");
      }

      const file = profileImage.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      updateProfile(filePath);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to upload image, please try again.", {
        theme: resolvedTheme,
      });
      setLoading(false);
    }
  }

  const getFile = async (file) => {
    try {
      setLoading(true);
      setProfileImage(file);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw new Error(err);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setIsActive(false);
    } catch (err) {
      throw new Error(err);
    } finally {
      router.push("/");
    }
  };

  if (!user) return <Auth />;

  if (profile.length === 0 || profile === undefined)
    return (
      <PageLayout title="loading">
        <div className="flex flex-col items-center justify-center">
          <div className={`relative w-32 h-32 overflow-hidden`}>
            <div className="w-32 h-32 rounded-full bg-zinc-600"></div>
          </div>
        </div>
      </PageLayout>
    );

  return (
    <PageLayout title="Profile">
      <div className="flex flex-col items-center justify-center ">
        <div className={`relative w-32 h-32 overflow-hidden mb-2`}>
          {profile.avatar_url ? (
            <Avatar url={profile.avatar_url} />
          ) : (
            <div
              className={`relative flex items-center justify-center w-32 h-32 overflow-hidden bg-zinc-300 dark:bg-zinc-400 rounded-full `}
            >
              <span className="text-5xl uppercase">{user.email.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center mb-24 space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={getFile}
            disabled={loading}
            className="block w-full text-sm transition ease-in-out text-zinc-500 file:bg-white file:text-blue-600 hover:file:bg-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold dark:file:bg-blue-50 dark:file:text-blue-600 dark:hover:file:bg-blue-100 "
          />
          <button
            type="submit"
            onClick={uploadAvatar}
            disabled={loading || Object.keys(profileImage).length < 1}
            className="px-6 py-2 transition ease-in-out bg-blue-500 rounded-md hover:bg-blue-600 text-zinc-100 disabled:cursor-not-allowed dark:disabled:bg-zinc-700 dark:disabled:hover:bg-zinc-600 disabled:bg-zinc-300 disabled:hover:bg-zinc-300 disabled:text-zinc-900 dark:disabled:text-zinc-100"
          >
            Update Profile Image
          </button>
        </div>
        <div className="flex flex-col gap-y-4">
          <label
            htmlFor="email"
            className="text-sm text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            name="email"
            className="p-2 text-center rounded-md bg-zinc-300 dark:bg-zinc-800 hover:cursor-not-allowed"
            defaultValue={profile.email}
            disabled
          />
          <button
            onClick={signOut}
            disabled={loading}
            className="px-2 py-1 mt-4 transition ease-in-out bg-red-500 rounded-md hover:bg-red-600 text-zinc-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
