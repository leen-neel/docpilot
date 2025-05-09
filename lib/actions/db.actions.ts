import * as schema from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { DocSchema } from "@/constants";
import { z } from "zod";
import { db } from "@/lib/db";

const {
  apiDocs,
  servers,
  endpoints: endpointsTable,
  queryParams,
  pathParams,
  faqs,
  responses,
  requests,
  sdkWrappers,
  users,
} = schema;

type APIDoc = z.infer<typeof DocSchema>;

export const createUser = async (userId: string) => {
  await db.insert(users).values({
    id: userId,
  });

  return "ok";
};

export const deleteUser = async (userId: string) => {
  await db.delete(users).where(eq(users.id, userId));

  return "ok";
};

export const getDocsByUserId = async (userId: string) => {
  const docs = await db.query.apiDocs.findMany({
    where: eq(apiDocs.userId, userId),
  });

  return docs;
};

export const getDocById = async (id: string, userId: string) => {
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
    where: and(eq(apiDocs.id, id), eq(apiDocs.userId, userId)),
  });

  return doc;
};

export const addDoc = async (doc: APIDoc, userId: string) => {
  const apiDoc = await db
    .insert(apiDocs)
    .values({
      name: doc.name,
      baseURL: doc.baseURL,
      description: doc.description,
      userId,
    })
    .returning({
      id: apiDocs.id,
    });

  await db.insert(servers).values(
    doc.servers.map((server) => ({
      apiId: apiDoc[0].id,
      url: server.url,
      description: server.description,
    }))
  );

  for (const endpoint of doc.endpoints) {
    const endpointEntry = await db
      .insert(endpointsTable)
      .values({
        apiId: apiDoc[0].id,
        method: endpoint.method,
        path: endpoint.path,
        summary: endpoint.summary,
        security: endpoint.security,
        headers: endpoint.headers,
        description: endpoint.description,
        cateogry: endpoint.category,
      })
      .returning({
        id: endpointsTable.id,
      });

    // QUERY PARAMS
    if (endpoint.queryParams?.length) {
      await db.insert(queryParams).values(
        endpoint.queryParams.map((qp) => ({
          endpointId: endpointEntry[0].id,
          name: qp.name,
          type: qp.type,
          required: qp.required,
          description: qp.description,
        }))
      );
    }

    // PATH PARAMS
    if (endpoint.pathParams?.length) {
      await db.insert(pathParams).values(
        endpoint.pathParams.map((pp) => ({
          name: pp.name,
          type: pp.type,
          required: pp.required,
          description: pp.description,
          endpointId: endpointEntry[0].id,
        }))
      );
    }

    // REQUEST
    if (endpoint.request) {
      for (const request of endpoint.request) {
        await db.insert(requests).values({
          endpointId: endpointEntry[0].id,
          description: request.description,
          example: request.example,
        });
      }
    }

    // RESPONSES
    if (endpoint.responses) {
      for (const response of endpoint.responses) {
        await db.insert(responses).values({
          endpointId: endpointEntry[0].id,
          status: response.status.toString(),
          description: response.description,
          example: response.example ?? {},
        });
      }
    }
  }

  if (doc.sdkWrappers?.length > 0) {
    await db.insert(sdkWrappers).values(
      doc.sdkWrappers.map((sdk) => ({
        apiId: apiDoc[0].id,
        language: sdk.language,
        code: sdk.code,
      }))
    );
  }

  if (doc.faqs?.length > 0) {
    await db.insert(faqs).values(
      doc.faqs.map((faq) => ({
        apiId: apiDoc[0].id,
        question: faq.question,
        answer: faq.answer,
      }))
    );
  }

  return "ok";
};

export const deleteDoc = async (id: string, userId: string) => {
  await db
    .delete(apiDocs)
    .where(and(eq(apiDocs.id, id), eq(apiDocs.userId, userId)));

  return "ok";
};

export async function getMockResponse(
  apiId: string,
  path: string,
  method: string
) {
  // Get all endpoints for this API
  const allEndpoints = await db.query.endpoints.findMany({
    where: eq(endpointsTable.apiId, apiId),
    with: {
      responses: true,
    },
  });

  // Find the best matching endpoint
  const matchingEndpoint = allEndpoints.find(
    (endpoint: typeof endpointsTable.$inferSelect) => {
      // Convert both paths to lowercase for comparison
      const storedPath = endpoint.path.toLowerCase();
      const requestPath = path.toLowerCase();

      // Check if the paths match (allowing for path parameters)
      const storedPathSegments = storedPath.split("/");
      const requestPathSegments = requestPath.split("/");

      if (storedPathSegments.length !== requestPathSegments.length) {
        return false;
      }

      // Check each segment
      for (let i = 0; i < storedPathSegments.length; i++) {
        const storedSegment = storedPathSegments[i];
        const requestSegment = requestPathSegments[i];

        // If the stored segment is a parameter (e.g., {id}), skip comparison
        if (storedSegment.startsWith("{") && storedSegment.endsWith("}")) {
          continue;
        }

        if (storedSegment !== requestSegment) {
          return false;
        }
      }

      // Check if methods match (case-insensitive)
      return endpoint.method.toLowerCase() === method.toLowerCase();
    }
  );

  if (!matchingEndpoint) {
    console.error(
      `No matching endpoint found for path: ${path}, method: ${method}`
    );
    throw new Error("Endpoint not found");
  }

  const response = matchingEndpoint.responses[0];
  if (!response) {
    console.error(`No response found for endpoint: ${matchingEndpoint.path}`);
    throw new Error("No response example found");
  }

  return {
    data: response.example,
    status: Number(response.status),
  };
}
