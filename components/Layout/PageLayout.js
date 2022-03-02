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

      <main className="p-4 mx-auto max-w-7xl xs:p-0">{children}</main>
    </>
  );
};

export default PageLayout;
