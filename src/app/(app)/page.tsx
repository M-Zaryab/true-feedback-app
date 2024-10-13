"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const page = () => {
  return (
    <main className="max-h-screen flex flex-col flex-grow items-center justify-start px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl font-bold md:text-5xl ">
          Dive into the mystery world
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore mystery message - where your identity remains the secret
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-md"
      >
        <CarouselContent className="">
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="">
                <Card className="h-40">
                  <CardHeader className="text-2xl font-semibold">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <span className="text-sm">{message.content}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default page;
