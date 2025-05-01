CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_api_id_apiDocs_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apiDocs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sdkWrappers" DROP COLUMN "created_at";