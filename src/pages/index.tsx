import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import HowItWorksPopup from "@/components/notifications/HowItWorksPopup";
import SEO from "@/components/seo/SEO";
import Spinner from "@/components/ui/Spinner";
import PredictionCard from "@/components/ui/PredictionCard";
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

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="text-center mb-4 ">
          <div className="h-[80px]">
            {" "}
            {/* Reduced height from 120px to 80px */}
            <h1 className="text-3xl font-bold mb-1">{displayText.heading}</h1>
            <h2 className="text-2xl mb-3">{displayText.subheading}</h2>
          </div>

          {/* {isLoading ? (
            <div className="flex justify-center items-center mt-10">
              <Spinner size="medium" />
            </div>
          ) : (
            <></>
          )} */}
        </div>
        <div className="flex gap-4 rounded-lg">
          {/* Left Input Section */}
          <div className="flex flex-1 items-center gap-4 border border-red-300 rounded-lg p-4">
            <div className="w-10 h-10 bg-red-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-lg font-semibold">
                What social media post you wanna bet on, Anon?
              </p>
              <p className="text-sm text-gray-500">
                Paste a social media post link and then customize your market
                parameters.
              </p>
              <button className="border border-red-300 px-4 py-2 rounded-lg mt-4 text-red-500 hover:bg-red-100">
                Create Market
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="border border-red-300 text-sm rounded-lg p-4 flex flex-col">
            <p className="text-red-500 font-semibold underline">
              US Politics Dashboard
            </p>
            <p className="text-red-500 mt-2">
              <span className="font-semibold">52 Market.</span>{" "}
              <span className="underline">Add your own.</span>
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-transparent mt-8 flex">
          <nav className="flex flex-wrap gap-4">
            {CATEGORIES.map((category, index) => (
              <a
                key={index}
                href="#"
                className="whitespace-nowrap bg-gray-200 inline-flex rounded-lg py-2 px-3 text-sm font-medium text-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-900"
              >
                {category}
              </a>
            ))}
          </nav>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-10">
          <PredictionCard/>
          <PredictionCard/>
          <PredictionCard/>
          <PredictionCard/>
          <PredictionCard/>
          <PredictionCard/>
          <PredictionCard/>
          <PredictionCard/>
          <PredictionCard/>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
