import { persistor, store } from '@/store/store';
import '@/styles/globals.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Launcherr</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="agd-partner-manual-verification" />
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
        <link href="https://fonts.cdnfonts.com/css/avenir" rel="stylesheet" />
      </Head>

      {/* Zoho SalesIQ Inline Script */}
      <Script id="zoho-salesiq-inline" strategy="afterInteractive">
        {`
          window.$zoho = window.$zoho || {};
          $zoho.salesiq = $zoho.salesiq || { ready: function () {} };
        `}
      </Script>

      {/* Zoho SalesIQ Widget Script */}
      <Script
        id="zoho-salesiq-widget"
        src="https://salesiq.zohopublic.in/widget?wc=siqc504b6c33eb36d6cbf32565db6e9bffc5be45d333251ea23552a00c252e8d38e"
        strategy="afterInteractive"
      />

      {/* Meta Pixel Code */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function() {
              n.callMethod
                ? n.callMethod.apply(n, arguments)
                : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
          }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '374999835704930');
          fbq('track', 'PageView');
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=374999835704930&ev=PageView&noscript=1"
          alt="facebook-pixel"
        />
      </noscript>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster position="top-right" reverseOrder={false} />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}
