"use server";

import { DocSchema } from "@/constants";
import { google } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";

export const generateDocs = async (lang: string, api: unknown) => {
  const { text } = await generateText({
    model: google("gemini-2.0-flash-001", {
      structuredOutputs: false,
    }),
    prompt: `
      Your job is to check the input api and say if what's given is enough or not.
      - Check if it's a proper swagger config or an API Document.
      - The inputed doc might be in just plain text. If it's in plain text, read the contents of the API doc before coming to a conclusion. It **will not** contain fields like openapi, info, paths etc. Extract paths, info etc. from the input if it's just plain text
      - If it's good enough say passed
      - Else, say failed
      - API Input: ${api}
      - Say **just passed/failed** no extra text
    `,
  });

  if (text.includes("passed")) {
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
        - IF the api input isn't enough, **ignore the schema** and return a message saying what's wrong
  
        Thank you <3
      `,
    });
    return object;
  } else {
    throw new Error("API doc not good enough");
  }
};
