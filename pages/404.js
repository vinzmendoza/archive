import { useRouter } from "next/router";

import NotFound from "../components/svg/NotFound";
import PageLayout from "../components/Layout/PageLayout";
import { useAuth } from "../utils/context/Auth";
import Auth from "../components/Auth";

const PageNotFound = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return <Auth />;

  return (
    <PageLayout title="Page not Found">
      <div className="flex flex-col items-center ">
        <div className="mb-16">
          <NotFound />
        </div>
        <h2 className="text-4xl font-bold">404 - Page not found</h2>
        <p className="mt-4 dark:text-gray-300">
          Sorry, we were unable to find the page you were looking for.
        </p>

        <div className="mt-4">
          <button
            type="button"
            className="px-6 py-2 transition ease-in-out rounded-md dark:hover:bg-blue-500 dark:text-gray-300 dark:hover:text-gray-50"
            onClick={() => router.push("/")}
          >
            Click here to return home
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default PageNotFound;
