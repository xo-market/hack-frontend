import React, { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import HowItWorksPopup from "@/components/notifications/HowItWorksPopup";

const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="btn btn-primary text-xs px-2 py-1"
                  >
                    Connect
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="btn btn-secondary text-[10px] sm:text-xs px-2 py-1"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={openChainModal}
                    className="btn btn-secondary text-xs px-2 py-1"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={12}
                            height={12}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-[10px] sm:text-xs">{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="btn btn-primary text-[10px] sm:text-xs px-2 py-1"
                  >
                    {account.address}
                    {account.displayBalance ? (
                      <span className="hidden sm:inline ml-1">
                        ({account.displayBalance})
                      </span>
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    router.push(`/profile/${address}`);
  };

  return (
    <>
      <nav className="bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 mt-4">
            <div className="flex items-center space-x-8 w-[100%]">
              <Link href="/" className="flex items-center text-2xl font-bold">
                <span className="text-[var(--primary)]">XO.Market</span>
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="bg-white text-black px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-md"
                >
                  How it works
                </button>
                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="bg-white text-black px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-md"
                >
                  Dashboard
                </button>
                <button  className="bg-white text-black px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-md">
                  <Link href="/leaderboard">Leaderboard</Link>
                </button>
                <button className="bg-white text-black px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-md">
                  My Bets
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <CustomConnectButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-[var(--card2)] border-t border-[var(--card-boarder)]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => setShowHowItWorks(true)}
                className="bg-white text-black px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-sm inline-block"
              >
                How it works
              </button>

              <div className="pt-4 pb-3 border-t border-[var(--card-boarder)]">
                <div className="flex items-center px-5">
                  <button
                    onClick={() => router.push("/create")}
                    className="bg-[var(--primary)] text-black px-4 py-2 rounded-lg font-medium hover:bg-[var(--primary-hover)] w-full"
                  >
                    Create Poll
                  </button>
                </div>
              </div>
              <div className="pt-4 px-3">
                <CustomConnectButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      <HowItWorksPopup
        isVisible={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />
    </>
  );
};

export default Navbar;
