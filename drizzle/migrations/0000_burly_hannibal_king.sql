CREATE TABLE "apiDocs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(355) NOT NULL,
	"baseURL" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "endpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_id" uuid NOT NULL,
	"method" text NOT NULL,
	"path" text NOT NULL,
	"summary" text,
	"description" text,
	"request_body" jsonb,
	"responses" jsonb,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sdkWrappers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_id" uuid NOT NULL,
	"language" text NOT NULL,
	"code" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "servers" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"apiId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_api_id_apiDocs_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apiDocs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sdkWrappers" ADD CONSTRAINT "sdkWrappers_api_id_apiDocs_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apiDocs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servers" ADD CONSTRAINT "servers_apiId_apiDocs_id_fk" FOREIGN KEY ("apiId") REFERENCES "public"."apiDocs"("id") ON DELETE no action ON UPDATE no action;