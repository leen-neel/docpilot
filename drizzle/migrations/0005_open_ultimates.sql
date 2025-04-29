CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"example" jsonb NOT NULL,
	"description" text NOT NULL,
	"endpointId" uuid
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"example" jsonb NOT NULL,
	"description" text NOT NULL,
	"status" numeric NOT NULL,
	"endpointId" uuid
);
--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_endpointId_endpoints_id_fk" FOREIGN KEY ("endpointId") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_endpointId_endpoints_id_fk" FOREIGN KEY ("endpointId") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN "request_body";--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN "responses";