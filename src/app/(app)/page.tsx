"use client";
import Image from "next/image";

import * as React from "react";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Mail, MailQuestionIcon } from "lucide-react";

export default function Home() {

  return (
    <>
      <main className="flex-grow bg-gray-800 text-white flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <div className="flex flex-col justify-center items-center space-y-8 max-w-sm md:max-w-2xl lg:max-w-4xl">

          <div className="mt-8 space-y-8 text-center md:mb-12">

            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              Dive into the World of Anonymous Feedback
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">True Feedback - Where your identity remains a secret.</p>


          </div>

        
            <Carousel
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
              className="w-full max-w-lg md:max-w-xl"
              // onMouseEnter={plugin.current.stop}
              // onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="p-4">
                    <Card className="">
                      <CardHeader>

                      <CardTitle className="lg:text-2xl">{message.title}</CardTitle>
                      </CardHeader>

                      <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Mail />
                        <div>
                          <div>{message.content}</div>
                          <div className="text-xs
                          text-muted-foreground ">{message.received}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          

        </div>
      </main>

      <footer className="bg-gray-900 text-white text-center p-6 md:p-8">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
