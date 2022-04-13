import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/global.css'
import { Provider as WagmiProvider } from 'wagmi';
import { providers } from 'ethers';
import { QueryClient, QueryClientProvider, QueryCache } from 'react-query';
import { Toaster, toast } from 'react-hot-toast';


const provider = providers.getDefaultProvider('https://polygon-mumbai.g.alchemy.com/v2/Mjq0Kt-Ss5lzr2ZZ1uyFU5d0JIujPRw1');

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: () => {
      toast.error(
        'Network Error: Ensure Metamask is connected to the same network that your contract is deployed to.'
      );
    },
  }),
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CNS</title>
      </Head>
      {/* Inject Wagmi provider */}
      <WagmiProvider autoConnect provider={provider}>
        {/* Inject react-query client */}
        <QueryClientProvider client={queryClient}>
          <main className="app">
            <Component {...pageProps} />
          </main>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default CustomApp;
