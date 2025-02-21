import React, { useState } from "react";
import Link from "next/link";
import { useLogin, usePrivy, useLogout } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import HowItWorksPopup from "@/components/notifications/HowItWorksPopup";
import { useDataContext } from "@/context/DataContext";
const Navbar: React.FC = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { address } = useAccount();
  const { tokenBalance } = useDataContext();
  const { ready, authenticated, user: privyUser } = usePrivy();
  const router = useRouter();
  const disableLogin = !ready || (ready && authenticated);
  const { login } = useLogin({
    onComplete: () => {
      router.push("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/");
    },
  });

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
      <nav className="flex items-center justify-between px-6 py-3 bg-white">
        {/* Logo & Search */}
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-black mt-4">
            <Link href="/">
              <span className="text-pink-500">XO.</span>Market
            </Link>
          </h1>
          <input
            type="text"
            placeholder="Search xo.market"
            className="px-4 py-2 w-64 bg-gray-100 rounded-md text-gray-600 text-sm focus:outline-none"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-pink-500 font-semibold">
            Market
          </Link>
          <Link
            href="/leaderboard"
            className="text-gray-600 hover:text-gray-900"
          >
            Leaderboard
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            My Bets
          </Link>
          <Link href="/create" className="text-gray-600 hover:text-gray-900">
            Create New
          </Link>
        </div>

        {/* Balance & Actions */}
        <div className="flex items-center space-x-8">
          <div className="text-right">
            <p className="text-xs text-gray-500">My balance</p>
            <p className="text-sm font-medium text-pink-500">
              {tokenBalance?.toString()} Token
            </p>
          </div>
          <button
            disabled={disableLogin}
            onClick={login}
            className="bg-pink-500 cursor-pointer text-white px-4 py-2 rounded-md text-sm"
          >
            {privyUser?.wallet
              ? privyUser?.wallet?.address.slice(0, 10) +
                "..." +
                privyUser?.wallet?.address.slice(-4)
              : "Login"}

              
          </button>
          {authenticated && (
            <div className="w-10 h-10 bg-pink-400 rounded-full"></div>
          )}
        </div>
      </nav>

      <HowItWorksPopup
        isVisible={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />
    </>
  );
};

export default Navbar;
