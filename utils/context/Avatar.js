// import {
//   useContext,
//   useState,
//   useEffect,
//   createContext,
//   useCallback,
// } from "react";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "./Auth";

// const AvatarContext = createContext();

// export const useAvatar = () => {
//   return useContext(AvatarContext);
// };

// export const AvatarProvider = ({ children }) => {
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState([]);

//   useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);

//   const fetchProfile = useCallback(async () => {
//     try {
//       if (!user) return;
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
//   }, [user]);

//   // Will be passed down to Signup, Login and Dashboard components
//   const value = {
//     profile,
//     loading,
//     setLoading,
//   };

//   return (
//     <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
//   );
// };

import {
  useContext,
  useState,
  useEffect,
  createContext,
  useCallback,
} from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./Auth";

const AvatarContext = createContext();

export const useAvatar = () => {
  return useContext(AvatarContext);
};

export const AvatarProvider = ({ children }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    try {
      if (!user) return;
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, avatar_url")
          .eq("id", user?.id)
          .single();

        if (error) console.log(error);

        if (!data) return;

        setProfile(data);
      };
      fetchProfile();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Will be passed down to Signup, Login and Dashboard components
  const value = {
    profile,
  };

  return (
    <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
  );
};
