import React, { useState } from "react";
import Link from "next/link";
import { useLogin, usePrivy, useLogout } from "@privy-io/react-auth";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import numeral from "numeral";
import HowItWorksPopup from "@/components/notifications/HowItWorksPopup";
import { useDataContext } from "@/context/DataContext";
const Navbar: React.FC = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { address } = useAccount();
  const { tokenBalance, getFaucet } = useDataContext();
  const { ready, authenticated, user: privyUser } = usePrivy();
  const router = useRouter();
  const disableLogin = !ready || (ready && authenticated);
  const [showProfile, setShowProfile] = useState(false);
  const toggleShowProfile = () => setShowProfile(!showProfile);
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
  const { data, isError, isLoading } = useBalance({
    address,
  });

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

          <Link
            href="/create"
            className="text-pink-600 font-bold hover:text-gray-900"
          >
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
              ? privyUser?.wallet?.address.slice(0, 4) +
                "..." +
                privyUser?.wallet?.address.slice(-4) +
                " | " +
                numeral(data?.formatted).format("0.0a") +
                " " +
                data?.symbol
              : "Login"}
          </button>
          {authenticated && (
            <>
              <button
                onClick={toggleShowProfile}
                className="relative inline-flex items-center rounded-lg"
              >
                <span className="h-10 w-10 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
                  <img
                    src="https://randomuser.me/api/portraits/men/68.jpg"
                    alt="user profile photo"
                    className="h-full w-full object-cover"
                  />
                </span>
              </button>
              <div
                className="absolute top-20 right-4 text-xs bg-white border border-pink-400 rounded-md p-2 w-48"
                style={{ display: showProfile ? "block" : "none" }}
              >
                <div className="p-2 text-black hover:bg-blue-200 cursor-pointer">
                  <Link href="/dashboard"> My Bets</Link>
                </div>
                <div
                  onClick={getFaucet}
                  className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md text-sm mt-2"
                >
                  Get Drip Faucet
                </div>
                <div
                  onClick={logout}
                  className="bg-pink-500 cursor-pointer text-white px-4 py-2 rounded-md text-sm mt-2"
                >
                  Logout
                </div>
              </div>
            </>
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
