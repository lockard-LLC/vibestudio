"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="bg-white-50 lg:bg-[#FBFBFB]" ref={ref}>
      <div className="my-[30px] block h-3 w-full bg-[#F4F4F4] lg:hidden"></div>

      <div className="flex items-center justify-center lg:pb-8">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md text-center text-4xl font-medium lg:max-w-2xl lg:text-[44px] lg:font-semibold"
        >
          VibeStudio{" "}
          <motion.span
            initial={{ backgroundSize: "0% 100%" }}
            animate={
              isInView
                ? { backgroundSize: "100% 100%" }
                : { backgroundSize: "0% 100%" }
            }
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text bg-no-repeat text-transparent"
          >
            Amplifies
          </motion.span>{" "}
          Your Productivity
        </motion.span>
      </div>

      <div className="my-[30px] block h-3 w-full bg-[#F4F4F4] lg:hidden"></div>

      <div className="items-center justify-center lg:flex-col lg:bg-[#FBFBFB] lg:px-6 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto w-full max-w-3xl rounded-xl px-3 lg:max-w-[1049px] lg:bg-[#F4F4F4] lg:p-7"
        >
          <div className="grid items-start lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="space-y-2"
            >
              <span className="text-2xl font-medium leading-tight">
                VibeStudio AI Router
              </span>
              <p className="text-base text-[#666666]">
                Experience intelligent AI model routing that adapts to your mood
                and project context. VibeStudio dynamically selects the optimal
                AI models for your specific tasks, ensuring peak performance and
                productivity. Get access to cutting-edge AI capabilities with a
                unified, professional development experience.
              </p>
            </motion.div>

            <div className="space-y-3 pt-7 lg:pl-10 lg:pt-0">
              {[
                {
                  name: "VibeStudio AI",
                  score: "94.10",
                  highlighted: true,
                  delay: 0.7,
                },
                {
                  name: "GPT-4o",
                  score: "80.53",
                  highlighted: false,
                  delay: 0.9,
                },
                {
                  name: "Meta Llama 3.1 405b",
                  score: "75.23",
                  highlighted: false,
                  delay: 1.1,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 30, scale: 0.9 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          x: 0,
                          scale: 1,
                        }
                      : {
                          opacity: 0,
                          x: 30,
                          scale: 0.9,
                        }
                  }
                  transition={{
                    duration: 0.6,
                    delay: item.delay,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-5 ${
                    item.highlighted
                      ? "border-2 border-[#A1DB4B] bg-[#B3F353] opacity-80"
                      : `bg-[#e6e6e6] ${index === 1 ? "w-[75%]" : "w-[65%]"}`
                  }`}
                >
                  <span
                    className={`font-medium ${item.name.includes("Meta") ? "text-nowrap" : ""}`}
                  >
                    {item.name}
                  </span>
                  <span className="font-mono font-medium text-[#666666]">
                    {item.score}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="my-[30px] block h-3 w-full bg-[#F4F4F4] lg:hidden"></div>

        {/* //Section 1 */}
        <div className="mx-auto grid w-full lg:mt-5 lg:max-w-[1049px] lg:grid-cols-2 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{
              duration: 0.8,
              delay: 1.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="mx-auto w-full max-w-3xl rounded-xl px-3 pb-0 lg:bg-[#F4F4F4] lg:px-0 lg:pt-7"
          >
            <div className="flex h-full flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.6,
                  delay: 1.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="space-y-1 lg:space-y-2 lg:px-7"
              >
                <div className="flex flex-col justify-between gap-1 lg:flex-row lg:items-end lg:gap-0">
                  <span className="text-2xl font-medium">
                    VibeStudio Creator <br />{" "}
                  </span>
                  <span className="flex text-base font-normal lg:hidden">
                    (Coming Soon)
                  </span>
                  <span className="mb-1 text-[#b3b3b3]">
                    Powered by Roo Code / Cline*
                  </span>
                </div>
                <span className="hidden text-base font-normal lg:flex">
                  (Coming Soon)
                </span>
                <p className="text-base text-[#666666]">
                  Build sophisticated applications from concept to deployment.
                  VibeStudio Creator ensures your projects leverage modern
                  architectures and industry best practices for
                  professional-grade results.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{
                  duration: 0.8,
                  delay: 1.7,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex items-center justify-center"
              >
                <Image
                  src="/images/vs-creator-vector.svg"
                  alt="VibeStudio Creator"
                  className="h-full w-full"
                  width={240}
                  height={240}
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 block h-28 bg-gradient-to-t from-[#FFFFFF] to-transparent lg:hidden"></div>
              </motion.div>
            </div>
          </motion.div>

          <div className="my-[30px] block h-3 w-full bg-[#F4F4F4] lg:hidden"></div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{
              duration: 0.8,
              delay: 1.9,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="mx-auto w-full max-w-3xl rounded-xl px-3 pb-0 lg:bg-[#F4F4F4] lg:p-7 lg:pb-0"
          >
            <div className="flex h-full flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.6,
                  delay: 2.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="space-y-1 lg:space-y-2"
              >
                <div className="flex flex-col justify-between gap-1 lg:flex-row lg:items-end lg:gap-0">
                  <span className="text-2xl font-medium">VibeStudio Agent</span>
                  <span className="mb-1 text-[#b3b3b3]">
                    Powered by Roo Code / Cline*
                  </span>
                </div>
                <p className="text-base text-[#666666]">
                  An intelligent AI assistant that autonomously develops
                  features, refactors code, and resolves issues with
                  professional precision.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{
                  duration: 0.8,
                  delay: 2.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="flex items-center justify-center"
              >
                <Image
                  src="/images/vs-agent-vector.svg"
                  alt="VibeStudio Agent"
                  className="h-auto w-full lg:pb-7"
                  width={240}
                  height={240}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="my-[30px] block h-3 w-full bg-[#F4F4F4] lg:hidden"></div>

        {/* //Section 2 */}
        <div className="mx-auto grid w-full lg:mt-5 lg:max-w-[1049px] lg:grid-cols-2 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{
              duration: 0.8,
              delay: 2.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="mx-auto w-full max-w-3xl rounded-xl px-3 pb-0 lg:bg-[#F4F4F4] lg:p-7 lg:pb-0"
          >
            <div className="flex h-full flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.6,
                  delay: 2.7,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="space-y-1 lg:space-y-2"
              >
                <div className="flex flex-col justify-between gap-1 lg:flex-row lg:items-end lg:gap-0">
                  <span className="text-2xl font-medium">VibeStudio Auth</span>
                  <span className="flex text-base font-normal lg:hidden">
                    (Coming Soon)
                  </span>
                  <span className="mb-1 text-[#b3b3b3]">
                    Powered by VibeStudio
                  </span>
                </div>
                <span className="hidden text-base font-normal lg:flex">
                  (Coming Soon)
                </span>
                <p className="text-base text-[#666666]">
                  Implement secure, scalable authentication systems
                  effortlessly. VibeStudio Auth provides enterprise-grade
                  security with modern authentication patterns and protocols.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{
                  duration: 0.8,
                  delay: 2.9,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex-col items-center justify-center"
              >
                <Image
                  src="/images/vs-login-vector.svg"
                  alt="VibeStudio Auth"
                  className="h-auto w-full lg:pb-7"
                  width={240}
                  height={240}
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 h-28 bg-gradient-to-t from-[#FFFFFF] to-transparent lg:from-[#F4F4F4]"></div>
              </motion.div>
            </div>
          </motion.div>

          <div className="my-[30px] block h-3 w-full bg-[#F4F4F4] lg:hidden"></div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{
              duration: 0.8,
              delay: 3.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="mx-auto w-full max-w-3xl rounded-xl pb-0 lg:bg-[#F4F4F4] lg:p-7 lg:pb-0"
          >
            <div className="flex h-full flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.6,
                  delay: 3.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="space-y-0 px-3 lg:space-y-2 lg:px-0"
              >
                <div className="flex flex-col justify-between gap-1 lg:flex-row lg:items-end lg:gap-0">
                  <span className="text-2xl font-medium">
                    VibeStudio Deploy
                  </span>
                  <span className="flex text-base font-normal lg:hidden">
                    (Coming Soon)
                  </span>
                  <span className="mb-1 text-[#b3b3b3]">
                    Powered by Netlify*
                  </span>
                </div>
                <span className="hidden text-base font-normal lg:flex">
                  (Coming Soon)
                </span>
                <p className="text-base text-[#666666]">
                  Deploy applications to production with confidence using
                  automated CI/CD pipelines and enterprise-grade infrastructure.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{
                  duration: 0.8,
                  delay: 3.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex items-center justify-center"
              >
                <Image
                  src="/images/vs-launch-vector.svg"
                  alt="VibeStudio Deploy"
                  className="h-auto w-full"
                  width={240}
                  height={240}
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 block h-28 bg-gradient-to-t from-[#FFFFFF] to-transparent lg:hidden"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="my-[30px] block h-3 w-full bg-[#F4F4F4] lg:hidden"></div>
    </div>
  );
}
