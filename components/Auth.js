import Head from "next/head";

import { supabase } from "../utils/supabaseClient";
import { FcGoogle } from "react-icons/fc";

async function signInWithGoogle() {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "google",
  });
}

const Auth = () => {
  return (
    <>
      <Head>
        <title>Login - Archive</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <div className="p-2 ">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-center">
              Welcome to Archive
            </h2>
            <p className="text-sm text-center dark:text-zinc-400 text-zinc-500">
              Note-taking web application with markup integration
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={signInWithGoogle}
              className="flex items-center justify-center w-full px-6 py-2 rounded-full bg-zinc-300 hover:bg-zinc-200 dark:bg-zinc-700 hover:dark:bg-zinc-600"
            >
              <FcGoogle size={24} className="mr-4" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
