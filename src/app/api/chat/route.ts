// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt =
      "create a list of three open-ended questions formatting as a single string. Each question should be seperated by '||' These questions are for social anonymous messaging platform like Qooh.me and should be suitable for diverse audience. Avoid personal or sensitive topics, focusing instead of personal themes that encourage friendly interactions. For Example, your output should be structured like this: 'What's your hobby you'v recently started?||If you have a dinner with any historical figure then who would it be?||What's simple thing that make you happy?'. Ensure that the questions are intriguing, foster curiosity and contribute to positive and welcoming conversational environment.";

    const result = await streamText({
      model: google("gemini-1.5-pro-latest"),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log("Error in generating ai");
  }
}
