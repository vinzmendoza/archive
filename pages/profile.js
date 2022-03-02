// import { useCallback, useEffect, useState } from "react";
// import Auth from "../components/Auth";
// import PageLayout from "../components/Layout/PageLayout";

// import { useAuth } from "../utils/context/Auth";
// import { supabase } from "../utils/supabaseClient";
// import Avatar from "../components/Avatar";

// const Profile = () => {
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState([]);

//   useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);

//   const fetchProfile = useCallback(async () => {
//     try {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("id, email, avatar_url")
//         .eq("id", user?.id)
//         .single();

//       if (error) console.log(error);

//       if (!data) return;

//       setProfile(data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.id]);

//   async function updateProfile(avatar_url) {
//     try {
//       setLoading(true);

//       const updates = {
//         id: user.id,
//         avatar_url,
//         updated_at: new Date(),
//       };

//       let { error } = await supabase.from("profiles").upsert(updates, {
//         returning: "minimal",
//       });

//       if (error) {
//         throw error;
//       }
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function uploadAvatar(event) {
//     try {
//       setLoading(true);

//       if (!event.target.files || event.target.files.length === 0) {
//         throw new Error("You must select an image to upload.");
//       }

//       const file = event.target.files[0];
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${Math.random()}.${fileExt}`;
//       const filePath = `${fileName}`;

//       let { error: uploadError } = await supabase.storage
//         .from("avatars")
//         .upload(filePath, file);

//       if (uploadError) {
//         throw uploadError;
//       }

//       updateProfile(filePath);
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!user) return <Auth />;

//   if (loading)
//     return (
//       <PageLayout title="loading">
//         <div className={`relative w-16 h-16 overflow-hidden`}>
//           <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
//         </div>
//       </PageLayout>
//     );

//   return (
//     <PageLayout title="Profile">
//       {/* <Avatar url={profile.avatar_url} size={48} /> */}
//       <div className={`relative w-16 h-16 overflow-hidden`}>
//         {profile.avatar_url !== null ? (
//           <Avatar url={profile.avatar_url} size={16} />
//         ) : (
//           <div
//             className={`relative flex items-center justify-center w-16 h-16 overflow-hidden bg-zinc-300 dark:bg-zinc-400 rounded-full `}
//           >
//             <span className="text-5xl">{user.email.charAt(0)}</span>
//           </div>
//         )}
//         {/* <Avatar url={profile.avatar_url} size={16} /> */}
//       </div>
//       <div>
//         <label className="block p-2 bg-blue-400 rounded" htmlFor="single">
//           {loading ? "Uploading ..." : "Upload"}
//         </label>
//         <input
//           style={{
//             visibility: "hidden",
//             position: "absolute",
//           }}
//           type="file"
//           id="single"
//           accept="image/*"
//           onChange={uploadAvatar}
//           disabled={loading}
//         />
//       </div>
//     </PageLayout>
//   );
// };

// export default Profile;

import { useCallback, useEffect, useState } from "react";
import Auth from "../components/Auth";
import PageLayout from "../components/Layout/PageLayout";
import { useRouter } from "next/router";

import { useAuth } from "../utils/context/Auth";
import { supabase } from "../utils/supabaseClient";
import Avatar from "../components/Avatar";
import { useAvatar } from "../utils/context/Avatar";

const Profile = () => {
  const { user } = useAuth();
  const { profile } = useAvatar();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

  async function uploadAvatar(event) {
    try {
      setLoading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
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
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <Auth />;

  if (profile.length === 0 || profile === undefined)
    return (
      <PageLayout title="loading">
        <div className={`relative w-16 h-16 overflow-hidden`}>
          <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
        </div>
      </PageLayout>
    );

  return (
    <PageLayout title="Profile">
      <div className={`relative w-32 h-32 overflow-hidden`}>
        {profile.avatar_url ? (
          <Avatar url={profile.avatar_url} />
        ) : (
          <div
            className={`relative flex items-center justify-center w-32 h-32 overflow-hidden bg-zinc-300 dark:bg-zinc-400 rounded-full `}
          >
            <span className="text-5xl">{user.email.charAt(0)}</span>
          </div>
        )}
      </div>
      <div>
        <label
          className="block p-2 bg-blue-400 rounded cursor-pointer"
          htmlFor="single"
        >
          {loading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={loading}
        />
      </div>
    </PageLayout>
  );
};

export default Profile;
