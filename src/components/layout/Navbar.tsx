import React, { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import HowItWorksPopup from "@/components/notifications/HowItWorksPopup";
import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const cookieAuthToken = req.cookies["privy-token"];
//   if (!cookieAuthToken) return { props: {} };
//   const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
//   const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
//   const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

//   try {
//     const claims = await client.verifyAuthToken(cookieAuthToken);
//     console.log({ claims });
//     return {
//       props: {},
//       redirect: { destination: "/dashboard", permanent: false },
//     };
//   } catch (error) {
//     return { props: {} };
//   }
// };

const Navbar: React.FC = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  const { login } = useLogin({
    onComplete: () => router.push("/"),
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
          <Link href="/"><span className="text-pink-500">XO.</span>Market</Link>
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
        <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900">
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
          <p className="text-sm font-medium text-pink-500">0 Token</p>
        </div>
        <button onClick={login} className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm">
          Login
        </button>
        <div className="w-10 h-10 bg-pink-400 rounded-full"></div>
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
