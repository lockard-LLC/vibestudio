"use client";

import React from "react";
import Footer from "./footer";
import CTA from "./cta";
import Image from "next/image";

const AboutComponent: React.FC = () => {
  return (
    <>
      <div className="w-full px-6">
        <section className="mx-auto mb-[68px] mt-[122px] flex max-w-[1049px] flex-col gap-[68px]">
          <div className="flex flex-col gap-5">
            <div className="font-mono text-sm text-black">
              VIBESTUDIO IS MADE FOR YOUR NEXT PROJECT.
            </div>
            <h2 className="text-[44px] font-semibold text-black">About Us</h2>
            <p className="text-xl text-[#666666]">
              Any idea you have, VibeStudio is here to help you build it.
              VibeStudio is an AI mood-adaptive IDE with a suite of the best AI
              tools to allow you to make what you want. Not just for
              prototyping, but for a long lifespan of added features and growth.
            </p>
            <span className="text-xl text-[#666666]">
              Just remember to make what excites!
            </span>
          </div>

          <div className="flex flex-col gap-10">
            <span className="text-[44px] font-semibold text-black">
              Features - stay tuned for VibeStudio V2!
            </span>

            <div className="items-center justify-center lg:flex-col">
              {/* //Section 1 */}
              <div className="mx-auto grid w-full max-w-3xl gap-5 lg:max-w-[1049px] lg:grid-cols-2">
                <div className="mx-auto w-full rounded-xl bg-[#F4F4F4] p-7 pb-0">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-medium">
                          VibeStudio Creator
                          <br />
                          (Coming Soon)
                        </span>
                        <span className="mb-1 text-sm font-normal text-[#b3b3b3]">
                          Powered by Roo Code / Cline
                        </span>
                      </div>
                      <p className="text-base text-[#666666]">
                        Create new projects from scratch! VibeStudio ensures
                        your project adheres to the latest technologies and best
                        practices.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Image
                        src="/images/vs-creator-vector.svg"
                        alt="VibeStudio Creator"
                        className="h-auto w-full"
                        width={240}
                        height={240}
                      />
                    </div>
                  </div>
                </div>

                <div className="mx-auto w-full rounded-xl bg-[#F4F4F4] p-7 pb-0">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-medium">
                          VibeStudio Agent
                        </span>
                        <span className="mb-1 text-sm font-normal text-[#b3b3b3]">
                          Powered by Roo Code / Cline
                        </span>
                      </div>
                      <p className="text-base text-[#666666]">
                        Coding agent that can automatically code features and
                        fix bugs for you.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Image
                        src="/images/vs-agent-vector.svg"
                        alt="VibeStudio Agent"
                        className="h-auto w-full"
                        width={240}
                        height={240}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* //Section 2 */}
              <div className="mx-auto mt-5 grid w-full max-w-3xl gap-5 lg:max-w-[1049px] lg:grid-cols-2">
                <div className="mx-auto w-full rounded-xl bg-[#F4F4F4] p-7 pb-0">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-medium">
                          VibeStudio Router
                        </span>
                      </div>
                      <p className="text-base text-[#666666]">
                        Automatically use the best AI on the market.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Image
                        src="/images/vs-router-vector.svg"
                        alt="VibeStudio Router"
                        className="h-auto w-full"
                        width={240}
                        height={240}
                      />
                    </div>
                  </div>
                </div>

                <div className="mx-auto w-full rounded-xl bg-[#F4F4F4] p-7 pb-0">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-medium">
                          VibeStudio Chat
                        </span>
                        <span className="mb-1 text-sm font-normal text-[#b3b3b3]">
                          Powered by Continue
                        </span>
                      </div>
                      <p className="text-base text-[#666666]">
                        Make edits in your codebase.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Image
                        src="/images/vs-chat-vector.svg"
                        alt="VibeStudio Chat"
                        className="h-auto w-full"
                        width={240}
                        height={240}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* //Section 3 */}
              <div className="mx-auto mt-5 grid w-full max-w-3xl gap-5 lg:max-w-[1049px] lg:grid-cols-2">
                <div className="mx-auto w-full rounded-xl bg-[#F4F4F4] p-7 pb-0">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-medium">
                          VibeStudio Login
                          <br />
                          (Coming Soon)
                        </span>
                        <span className="mb-1 text-sm font-normal text-[#b3b3b3]">
                          Powered by VibeStudio
                        </span>
                      </div>
                      <p className="text-base text-[#666666]">
                        Almost all projects require users to login. Let
                        VibeStudio help you with this with best practices and
                        the latest tools.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Image
                        src="/images/vs-login-vector.svg"
                        alt="VibeStudio Login"
                        className="h-auto w-full"
                        width={240}
                        height={240}
                      />
                    </div>
                  </div>
                </div>

                <div className="mx-auto w-full rounded-xl bg-[#F4F4F4] p-7 pb-0">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-medium">
                          VibeStudio Launch
                          <br />
                          (Coming Soon)
                        </span>
                        <span className="mb-1 text-sm font-normal text-[#b3b3b3]">
                          Powered by Netlify
                        </span>
                      </div>
                      <p className="text-base text-[#666666]">
                        Launches your web projects onto to internet so you can
                        share with everyone.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Image
                        src="/images/vs-launch-vector.svg"
                        alt="VibeStudio Launch"
                        className="h-auto w-full"
                        width={240}
                        height={240}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-center text-2xl font-medium text-[#666666]">
                ...and many more!
              </div>
            </div>
          </div>
        </section>
      </div>
      <CTA />
      <Footer />
    </>
  );
};

export default AboutComponent;
