import { dummyDoc } from "./api_data";
import { sdkLines } from "./sdk_data";
import { z } from "zod";

// Schema for the endpoints
export const EndpointSchema = z.object({
  id: z.string(),
  path: z.string(),
  method: z.enum(["GET", "POST", "PATCH", "PUT", "DELETE"]),
  summary: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  security: z.string().optional(),
  headers: z.record(z.string()).optional(),

  queryParams: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        required: z.boolean(),
        description: z.string(),
        default: z.any().optional(),
      })
    )
    .optional(),

  pathParams: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        required: z.boolean(),
        description: z.string(),
      })
    )
    .optional(),

  request: z
    .object({
      required: z.boolean(),
      contentType: z.string(),
      example: z.any(),
    })
    .optional(),

  responses: z.record(
    z.string(),
    z.object({
      description: z.string(),
      example: z.any().optional(),
    })
  ),
});

export const wrapperSchema = z.object({
  language: z.string(),
  code: z.string().array(),
});

export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

// Main schema for the full document
export const DocSchema = z.object({
  apiName: z.string(),
  version: z.string(),
  description: z.string(),
  servers: z.array(
    z.object({
      url: z.string(),
      description: z.string(),
    })
  ),
  endpoints: z.array(EndpointSchema),
  sdkWrappers: z.array(wrapperSchema),
  faqs: z.array(faqSchema),
});

export { dummyDoc, sdkLines };
