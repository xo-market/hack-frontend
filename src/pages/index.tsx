import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import HowItWorksPopup from "@/components/notifications/HowItWorksPopup";
import SEO from "@/components/seo/SEO";
import Spinner from "@/components/ui/Spinner";

import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import PredictionCard from "@/components/ui/PredictionCard";
import dummy_data from "@/utils/dummy_data.json";
import Link from "next/link";
const CATEGORIES = [
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

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 flex flex-col bg-white">
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
        {/* <div className="flex gap-4 rounded-lg h-[180px]">

          <div className="flex flex-col border border-red-300 h-[100%] rounded-lg w-[68%]">
        
            <div className="w-full h-1/3 py-2 flex justify-between px-2">
            
              <button  className="border border-red-300 px-4 py-2 rounded-lg  text-red-500 hover:bg-red-100">
                <Link href="/create">Create Market</Link>
              </button>
            </div>
          </div>


          <div className="border border-red-300 rounded-lg flex flex-col w-[32%] text-[#E84871]">
            <div className="w-full gap-x-10 items-center  border-red-300 border-b h-2/3 px-12 py-2 flex">
              <p className="text-lg  font-bold">US Politics Dashboard</p>
            </div>
            <div className="w-full h-1/3 py-2 items-center flex gap-x-4 px-4 justify-between"> 
              <p>52 Market</p>
              <p className="text-xs underline"><Link href="/">Add your Own</Link></p>
           
            </div>
          </div>
        </div> */}

        <div className="flex items-center gap-3 overflow-x-auto p-4">
          {/* Category Buttons */}
          <button className="px-4 py-2 rounded-md bg-pink-500 text-white font-medium">
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className="px-4 py-2 text-xs border border-pink-500 text-pink-500 rounded-md hover:bg-pink-500 hover:text-white transition"
            >
              {category}
            </button>
          ))}

          {/* Dropdowns */}
          <div className="ml-auto flex gap-2">
            <select className="px-4 py-2 border text-black text-xs border-black rounded-md focus:outline-none">
              <option>Tokens</option>
            </select>
            <select className="px-4 py-2 text-black text-xs border border-black rounded-md focus:outline-none">
              <option>Trending</option>
            </select>
          </div>
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
