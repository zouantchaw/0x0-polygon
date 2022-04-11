import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/global.css'
import { Provider as WagmiProvider } from 'wagmi';
import { providers } from 'ethers';

const provider = providers.getDefaultProvider('https://polygon-mumbai.g.alchemy.com/v2/Mjq0Kt-Ss5lzr2ZZ1uyFU5d0JIujPRw1');

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CNS</title>
      </Head>
      <WagmiProvider autoConnect provider={provider}>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </WagmiProvider>
    </>
  );
}

export default CustomApp;
