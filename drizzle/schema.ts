import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const subscriptionEnum = pgEnum("subscription", [
  "Runway",
  "Takeoff",
  "Cruise",
]);

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  subscriptionStatus: subscriptionEnum("subscriptionStatus")
    .default("Cruise")
    .notNull(),
});

export const apiDocs = pgTable("apiDocs", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 355 }).notNull(),
  baseURL: varchar("baseURL", { length: 255 }).notNull(),
  userId: varchar("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const servers = pgTable("servers", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  apiId: uuid("apiId")
    .references(() => apiDocs.id, { onDelete: "cascade" })
    .notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  description: varchar("description", { length: 355 }),
});

export const endpoints = pgTable("endpoints", {
  id: uuid("id").primaryKey().defaultRandom().primaryKey(),
  apiId: uuid("api_id")
    .references(() => apiDocs.id, { onDelete: "cascade" })
    .notNull(),
  method: text("method").notNull(),
  path: text("path").notNull(),
  summary: text("summary"),
  security: text("security"),
  headers: jsonb("headers"),
  description: text("description"),
  cateogry: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const queryParams = pgTable("queryParams", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  required: boolean("required").notNull(),
  description: text("description").notNull(),
  endpointId: uuid("endpointId").references(() => endpoints.id, {
    onDelete: "cascade",
  }),
});

export const pathParams = pgTable("pathParams", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  required: boolean("required").notNull(),
  description: text("description").notNull(),
  endpointId: uuid("endpointId").references(() => endpoints.id, {
    onDelete: "cascade",
  }),
});

export const requests = pgTable("requests", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  example: jsonb("example").notNull(),
  description: text("description").notNull(),
  endpointId: uuid("endpointId").references(() => endpoints.id, {
    onDelete: "cascade",
  }),
});

export const responses = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom().primaryKey(),
  example: jsonb("example").notNull(),
  description: text("description").notNull(),
  status: numeric("status").notNull(),
  endpointId: uuid("endpointId").references(() => endpoints.id, {
    onDelete: "cascade",
  }),
});

export const sdkWrappers = pgTable("sdkWrappers", {
  id: uuid("id").primaryKey().defaultRandom().primaryKey(),
  apiId: uuid("api_id")
    .references(() => apiDocs.id, { onDelete: "cascade" })
    .notNull(),
  language: text("language").notNull(),
  code: text("code").notNull().array(),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom().primaryKey(),
  apiId: uuid("api_id")
    .references(() => apiDocs.id, { onDelete: "cascade" })
    .notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

// RELATIONS

export const userRelations = relations(users, ({ many }) => ({
  docs: many(apiDocs),
}));

export const apiRelations = relations(apiDocs, ({ many }) => ({
  servers: many(servers),
  endpoints: many(endpoints),
  sdkWrappers: many(sdkWrappers),
  faqs: many(faqs),
}));

export const serverRelations = relations(servers, ({ one }) => ({
  api: one(apiDocs, {
    fields: [servers.apiId],
    references: [apiDocs.id],
  }),
}));

export const endpointRelations = relations(endpoints, ({ one, many }) => ({
  api: one(apiDocs, {
    fields: [endpoints.apiId],
    references: [apiDocs.id],
  }),
  queryParams: many(queryParams),
  pathParams: many(pathParams),
  responses: many(responses),
  request: many(requests),
}));

export const sdkWrapperRelations = relations(sdkWrappers, ({ one }) => ({
  api: one(apiDocs, {
    fields: [sdkWrappers.apiId],
    references: [apiDocs.id],
  }),
}));

export const faqRelations = relations(faqs, ({ one }) => ({
  api: one(apiDocs, {
    fields: [faqs.apiId],
    references: [apiDocs.id],
  }),
}));

export const pathParamsRelations = relations(pathParams, ({ one }) => ({
  endpoint: one(endpoints, {
    fields: [pathParams.endpointId],
    references: [endpoints.id],
  }),
}));

export const queryParamsRelations = relations(queryParams, ({ one }) => ({
  endpoint: one(endpoints, {
    fields: [queryParams.endpointId],
    references: [endpoints.id],
  }),
}));

export const requestRelations = relations(requests, ({ one }) => ({
  endpoint: one(endpoints, {
    fields: [requests.endpointId],
    references: [endpoints.id],
  }),
}));

export const responseRelations = relations(responses, ({ one }) => ({
  endpoint: one(endpoints, {
    fields: [responses.endpointId],
    references: [endpoints.id],
  }),
}));
