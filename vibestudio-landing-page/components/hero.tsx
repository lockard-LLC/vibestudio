"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function Hero() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <>
      <section className="relative mx-auto mb-0 mt-28 flex w-full flex-col items-center text-center lg:mb-14">
        <div className="mb-10 max-w-[1070px] px-3">
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              staggerChildren: 0.1,
            }}
            className="relative mb-2 text-[44px] font-medium leading-tight tracking-tight text-black"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              The AI{" "}
              <motion.span
                initial={{ backgroundSize: "0% 100%" }}
                animate={{ backgroundSize: "100% 100%" }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeInOut" }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text bg-no-repeat text-transparent"
                style={{ backgroundPosition: "0% 100%" }}
              >
                Mood Adaptive
              </motion.span>{" "}
              IDE for Your Next Project.
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mx-auto max-w-4xl text-base font-normal text-[#666666] md:flex md:flex-col md:text-xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="inline-block"
            >
              Bring your ideas to life with the AI-powered mood adaptive
              development environment that adapts to your creative flow.{" "}
            </motion.span>
          </motion.p>
        </div>

        <div className="relative mb-4 w-[140%] overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0, x: ["-60%", "0%"] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.6 },
              y: { duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] },
              x: {
                duration: 70,
                repeat: Infinity,
                ease: "linear",
                delay: 1.2,
              },
            }}
            className="relative flex w-[140%]"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <Image
              src="/images/HeroImageLarge.svg"
              alt="VibeStudio Hero"
              width={1920}
              height={1080}
              priority
            />
            <Image
              src="/images/HeroImageLarge.svg"
              alt="VibeStudio Hero"
              width={1920}
              height={1080}
              priority
            />
            <Image
              src="/images/HeroImageLarge.svg"
              alt="VibeStudio Hero"
              width={1920}
              height={1080}
              priority
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.0,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="group hidden cursor-pointer items-center gap-2 font-mono text-sm text-black lg:flex"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            BACKED BY
          </motion.span>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1.4,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            whileHover={{
              rotate: 360,
              transition: { duration: 0.5 },
            }}
          >
            <Image
              src="/icons/YCLogo.svg"
              alt="Y Combinator Logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            COMBINATOR
          </motion.span>
          <motion.div
            className="pb-[1px]"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            whileHover={{
              x: 3,
              transition: { duration: 0.2 },
            }}
          >
            <ChevronRight className="h-4 w-4 stroke-[1.5px] text-[#666666] transition-colors duration-200 group-hover:text-black" />
          </motion.div>
        </motion.div>
      </section>
      <div className="relative my-[30px] block h-3 w-screen bg-[#F4F4F4] lg:hidden"></div>
    </>
  );
}
