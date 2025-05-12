
import React from 'react';
import '@/App.css';
import '@/index.css';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';

function MyApp({ Component, pageProps }: { Component: React.ComponentType<any>, pageProps: any }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster />
    </Layout>
  );
}

export default MyApp;
