// import Navbar from '@/Components/Navbar'
// import { persistor, store } from '@/store/store'
import '@/styles/globals.css'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'


export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Launcherr</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
        <link href="https://fonts.cdnfonts.com/css/avenir" rel="stylesheet" />
      </Head>
      {/* <Provider store={store}> */}
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <Toaster position='top-right' />
      <Component {...pageProps} />
      {/* </PersistGate> */}
      {/* </Provider> */}
    </>
  )
}
