import { ThemeProvider } from "next-themes";

import "../styles/globals.css";
import AppLayout from "../components/Layout/AppLayout";
import { AuthProvider } from "../utils/context/Auth";
import { AvatarProvider } from "../utils/context/Avatar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from "../utils/context/Search";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <AvatarProvider>
          <SearchProvider>
            <AppLayout>
              <Component {...pageProps} />
              <ToastContainer
                toastClassName={() =>
                  "relative flex my-2 p-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer dark:bg-zinc-800 dark:text-zinc-100 bg-zinc-50 text-zinc-800 shadow-md"
                }
                bodyClassName={() =>
                  "flex text-sm font-white font-med block p-3"
                }
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                draggable={false}
                closeOnClick
                pauseOnHover={false}
              />
            </AppLayout>
          </SearchProvider>
        </AvatarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
