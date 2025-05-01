"use server";

import { DocSchema } from "@/constants";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export const generateDocs = async (lang: string, api: unknown) => {
  const { object } = await generateObject({
    model: google("gemini-2.0-flash-001", {
      structuredOutputs: false,
    }),
    schema: DocSchema,
    prompt: `
      You are a technical writer who's job is to generate API documentation and relatvant information of an API based on the given input.
      - Generate only the code, no extra text
      - Use the given schema 
      - The api input is: ${api}
      - In the sdkWrappers field, generate the full sdk wrapper with proper type safety (if applicable) in ${lang}
      - In the faqs field, generate FAQs related to the API

      Thank you <3
    `,
  });

  return object;
};
