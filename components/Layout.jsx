import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const router = useRouter();
  return (
    <div className='layout'>
      <Head>
        <title>Dreel Marketplace</title>
      </Head>
      <header>
        {!['/login', '/register', '/verify', '/verify/resend'].includes(
          router.pathname
        ) && <Navbar />}
      </header>
      <main className='main-container'>{children}</main>
      <footer>
        {!['/login', '/register'].includes(router.pathname) && <Footer />}
      </footer>
    </div>
  );
};

export default Layout;
