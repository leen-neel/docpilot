import * as schema from "@/drizzle/schema";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

const pg = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: pg, schema: schema });

const {
  apiDocs,
  servers,
  endpoints,
  queryParams,
  pathParams,
  faqs,
  responses,
  requests,
  sdkWrappers,
} = schema;

export const getDocs = async () => {
  const docs = await db.query.apiDocs.findMany();

  return docs;
};

export const getDocById = async (id: string) => {
  const doc = await db.query.apiDocs.findFirst({
    with: {
      servers: true,
      endpoints: {
        with: {
          pathParams: true,
          queryParams: true,
          request: true,
          responses: true,
        },
      },
      sdkWrappers: true,
      faqs: true,
    },
    where: eq(apiDocs.id, id),
  });

  return doc;
};

export const seed = async () => {
  await db.insert(apiDocs).values({
    id: "11111111-1111-1111-1111-111111111111",
    name: "Weather Forecast API",
    description: "Provides real-time and forecasted weather data.",
    baseURL: "https://api.weatherpro.com/v1",
    userId: "user_2wGJLNIxBmL5M3tCQG5TbbTwdx1",
  });

  await db.insert(servers).values([
    {
      id: "22222222-2222-2222-2222-222222222222",
      apiId: "11111111-1111-1111-1111-111111111111",
      url: "https://api.weatherpro.com/v1",
      description: "Primary production server",
    },
  ]);

  await db.insert(endpoints).values([
    {
      id: "33333333-3333-3333-3333-333333333333",
      apiId: "11111111-1111-1111-1111-111111111111",
      method: "GET",
      path: "/forecast",
      summary: "Get 7-day weather forecast",
      security: "API key required in header",
      headers: {
        Authorization: "Bearer <API_KEY>",
      },
      tags: ["forecast", "weather"],
      description: "Returns a 7-day forecast for a specific location.",
    },
  ]);

  await db.insert(queryParams).values([
    {
      id: "44444444-4444-4444-4444-444444444444",
      endpointId: "33333333-3333-3333-3333-333333333333",
      name: "lat",
      type: "float",
      required: true,
      description: "Latitude of the location",
    },
    {
      id: "55555555-5555-5555-5555-555555555555",
      endpointId: "33333333-3333-3333-3333-333333333333",
      name: "lon",
      type: "float",
      required: true,
      description: "Longitude of the location",
    },
  ]);

  await db.insert(requests).values([
    {
      id: "66666666-6666-6666-6666-666666666666",
      endpointId: "33333333-3333-3333-3333-333333333333",
      description: "Example request for forecast endpoint",
      example: {
        method: "GET",
        url: "https://api.weatherpro.com/v1/forecast?lat=37.7749&lon=-122.4194",
        headers: {
          Authorization: "Bearer demo_api_key",
        },
      },
    },
  ]);

  await db.insert(responses).values([
    {
      id: "77777777-7777-7777-7777-777777777777",
      endpointId: "33333333-3333-3333-3333-333333333333",
      status: "200",
      description: "Successful response with forecast data",
      example: {
        location: "San Francisco",
        forecast: [
          { day: "Monday", temp: 20, condition: "Sunny" },
          { day: "Tuesday", temp: 18, condition: "Cloudy" },
        ],
      },
    },
  ]);

  await db.insert(sdkWrappers).values([
    {
      id: "88888888-8888-8888-8888-888888888888",
      apiId: "11111111-1111-1111-1111-111111111111",
      language: "JavaScript",
      code: [
        `async function getForecast(lat, lon) {`,
        `  const response = await fetch(\`https://api.weatherpro.com/v1/forecast?lat=\${lat}&lon=\${lon}\`, {`,
        `    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }`,
        `  });`,
        `  return response.json();`,
        `}`,
      ],
    },
  ]);

  console.log("✅ SEED DATA INSERTED");
};

export const faqSeed = async () => {
  await db.insert(faqs).values([
    {
      apiId: "11111111-1111-1111-1111-111111111111",
      question: "Question 1",
      answer: "Answer 1",
    },
    {
      apiId: "11111111-1111-1111-1111-111111111111",
      question: "Question 2",
      answer: "Answer 2",
    },
  ]);

  console.log("SEED DATA SEEDED");
};
