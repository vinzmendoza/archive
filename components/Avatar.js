import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Avatar = ({ url }) => {
  const [parsedAvatarUrl, setParsedAvatarUrl] = useState(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        console.log(error);
        throw error;
      }
      const url = URL.createObjectURL(data);
      setParsedAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  return (
    <>
      {parsedAvatarUrl && (
        <Image
          src={parsedAvatarUrl}
          alt="Avatar"
          className="rounded-full"
          layout="fill"
          objectFit="cover"
        />
      )}
    </>
  );
};

export default Avatar;
