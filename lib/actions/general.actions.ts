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

  console.log(text);

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
        - If the input is json or yml, extract the response, request etc. from the given input. **DO NOT** infer any of those contents by yourself if they're provided.
        - In the sdkWrappers field, generate the full sdk wrapper with proper type safety (if applicable) in ${lang}. Ensure that the code is formatted properly and is readable. Add proper comments and documentation to the code. Make sure to add all the necessary imports. Also, add proper error handling and logging. If required, add documentation to the code at the top of the file as a multi-line comment.
        - In the faqs field, generate 5 FAQs related to the API
        - Give the API a proper name. For example: Weather Forecast API, Task Manager API
        - Give the API a proper description which says what the API does in a concise way
        - Extract the responses and requests from the input given

        Thank you <3
      `,
    });

    return object;
  } else {
    throw new Error("API doc not good enough");
  }
};
