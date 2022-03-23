import Head from "next/head";
import Navbar from "../Navbar";

const PageLayout = ({ children, title }) => {
  return (
    <>
      {title && (
        <Head>
          <title>{title} - Archive</title>
        </Head>
      )}

      <Navbar />

      <main className="px-4 pt-4 pb-12 mx-auto max-w-7xl xs:p-0">
        {children}
      </main>
    </>
  );
};

export default PageLayout;
