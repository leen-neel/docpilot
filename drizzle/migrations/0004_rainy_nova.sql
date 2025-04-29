CREATE TABLE "pathParams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"required" boolean NOT NULL,
	"description" text NOT NULL,
	"endpointId" uuid
);
--> statement-breakpoint
CREATE TABLE "queryParams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"required" boolean NOT NULL,
	"description" text NOT NULL,
	"endpointId" uuid
);
--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "security" text;--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "headers" jsonb;--> statement-breakpoint
ALTER TABLE "pathParams" ADD CONSTRAINT "pathParams_endpointId_endpoints_id_fk" FOREIGN KEY ("endpointId") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queryParams" ADD CONSTRAINT "queryParams_endpointId_endpoints_id_fk" FOREIGN KEY ("endpointId") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;