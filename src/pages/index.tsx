import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import HowItWorksPopup from "@/components/notifications/HowItWorksPopup";
import SEO from "@/components/seo/SEO";
import Spinner from "@/components/ui/Spinner";
import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { PrivyClient } from "@privy-io/server-auth";
import PredictionCard from "@/components/ui/PredictionCard";
import dummy_data from "@/utils/dummy_data.json";
import Link from "next/link";
const CATEGORIES = [
  "All",
  "Technologies",
  "Memes",
  "Socials",
  "Games",
  "NFTs",
  "Music",
  "Sports",
  "Tokens",
];
const TYPEWRITER_TEXTS = [
  {
    heading: "Predict viral trends,",
    subheading: "bet on social media success!",
  },
  {
    heading: "Engagement is currency,",
    subheading: "profit from the next big post!",
  },
  {
    heading: "Turn insights into rewards,",
    subheading: "leverage AI-driven predictions!",
  },
  {
    heading: "Bet on content before it blows up,",
    subheading: "win big with real-time data!",
  },
  {
    heading: "The future of social media bets,",
    subheading: "powered by blockchain & AI!",
  },
];

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

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/"),
  });
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState({
    heading: "",
    subheading: "",
  });
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeText = async () => {
      const currentText = TYPEWRITER_TEXTS[currentTextIndex];

      // Type heading
      for (let i = 0; i <= currentText.heading.length; i++) {
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 50);
        });
        setDisplayText((prev) => ({
          ...prev,
          heading: currentText.heading.slice(0, i),
        }));
      }

      // Type subheading
      for (let i = 0; i <= currentText.subheading.length; i++) {
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 50);
        });
        setDisplayText((prev) => ({
          ...prev,
          subheading: currentText.subheading.slice(0, i),
        }));
      }

      // Pause before deleting
      await new Promise((resolve) => {
        timeoutId = setTimeout(resolve, 2000);
      });

      // Delete text
      for (let i = currentText.subheading.length; i >= 0; i--) {
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 30);
        });
        setDisplayText((prev) => ({
          ...prev,
          subheading: currentText.subheading.slice(0, i),
        }));
      }

      for (let i = currentText.heading.length; i >= 0; i--) {
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 30);
        });
        setDisplayText((prev) => ({
          ...prev,
          heading: currentText.heading.slice(0, i),
        }));
      }

      // Move to next text
      setCurrentTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
    };

    if (isTyping) {
      typeText();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentTextIndex, isTyping]);

  return (
    <Layout>
      <SEO
        title="Create and Trade Memecoins Easily on XO-Market."
        description="The ultimate platform for launching and trading memecoins on Shibarium. Create your own tokens effortlessly and engage in fair, dynamic trading."
        image="seo/home.jpg"
      />
      <HowItWorksPopup
        isVisible={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col bg-white">
        <div className="text-center mb-4 ">
          <div className="h-[80px]">
            {" "}
            <h1 className="text-3xl text-black font-bold mb-1">
              {displayText.heading}
            </h1>
            <h2 className="text-2xl text-black mb-3">
              {displayText.subheading}
            </h2>
          </div>

          {/* {isLoading ? (
            <div className="flex justify-center items-center mt-10">
              <Spinner size="medium" />
            </div>
          ) : (
            <></>
          )} */}
        </div>
        <div className="flex gap-4 rounded-lg h-[180px]">
          {/* Left Input Section */}
          <div className="flex flex-col border border-red-300 h-[100%] rounded-lg w-[68%]">
            <div className="w-full gap-x-10 items-center  border-red-300 border-b h-2/3 px-12 py-2 flex">
              <div className="w-12 h-12 bg-red-400 rounded-full"></div>
              <div className="flex flex-col">
                <div className="bg-gray-300 px-2 py-2 flex items-center justify-center rounded-lg">
                  <p className="font-bold text-black">
                    What social media post you wanna bet on, Anon?{" "}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Paste a social media post link and then customize your market
                  parameters.{" "}
                </p>
              </div>
            </div>
            <div className="w-full h-1/3 py-2 flex justify-between px-2">
              <button
                className="bg-black py-1.5 px-6 text-white rounded-lg"
                onClick={login}
              >
                Connect Wallet
              </button>
              <button  className="border border-red-300 px-4 py-2 rounded-lg  text-red-500 hover:bg-red-100">
                <Link href="/create">Create Market</Link>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="border border-red-300 rounded-lg flex flex-col w-[32%] text-[#E84871]">
            <div className="w-full gap-x-10 items-center  border-red-300 border-b h-2/3 px-12 py-2 flex">
              <p className="text-lg  font-bold">US Politics Dashboard</p>
            </div>
            <div className="w-full h-1/3 py-2 items-center flex gap-x-4 px-4"> 
              <p>52 Market</p>
              <p className="text-xs">Add your Own</p>
           
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-transparent mt-8 flex">
          <nav className="flex flex-wrap gap-4">
            {CATEGORIES.map((category, index) => (
              <a
                key={index}
                href="#"
                className="whitespace-nowrap bg-[#F58EA9] border-[#E84871] inline-flex rounded-md focus:bg-[#E84871] py-2 px-3 text-sm text-white transition-all duration-200 ease-in-out hover:bg-[#E84871] "
              >
                {category}
              </a>
            ))}
          </nav>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-10">
          {dummy_data.map((data: any, index: any) => {
            return (
              <PredictionCard
                key={index}
                data={data}
                onClick={() => console.log("Clicked")}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Home;

