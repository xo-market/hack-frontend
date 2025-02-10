import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, WagmiProvider } from "wagmi";
import { supportedChains } from "@/chain/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WebSocketProvider } from "@/components/providers/WebSocketProvider";
import { PrivyProvider } from "@privy-io/react-auth";

const config = getDefaultConfig({
  appName: "xo-market",
  projectId: "87106bd465234d097b8a51ba585bf799",
  chains: supportedChains as any,
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://docs.privy.io/privy-logo-dark.png",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "all-users",
        },
      }}
    >
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <WebSocketProvider>
              <Component {...pageProps} />
            </WebSocketProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
        <ToastContainer />
      </WagmiConfig>
    </PrivyProvider>
  );
}
