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
  security: z.string(),
  headers: z.record(z.string()),

  queryParams: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string(),
      default: z.any().optional(),
    })
  ),

  pathParams: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string(),
    })
  ),

  request: z
    .object({
      required: z.boolean(),
      contentType: z.string(),
      example: z.any(),
    })
    .nullable(),

  responses: z.record(
    z.string(),
    z.object({
      description: z.string(),
      example: z.any().optional(),
    })
  ),
});

// Main schema for the full document
export const DummyDocSchema = z.object({
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
});

export { dummyDoc, sdkLines };
