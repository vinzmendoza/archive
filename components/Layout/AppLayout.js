import Head from "next/head";

const AppLayout = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Archive" />
        <meta name="author" content="Vinz Mendoza" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      {children}
    </>
  );
};

export default AppLayout;
