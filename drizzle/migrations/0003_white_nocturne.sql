ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_api_id_apiDocs_id_fk";
--> statement-breakpoint
ALTER TABLE "sdkWrappers" DROP CONSTRAINT "sdkWrappers_api_id_apiDocs_id_fk";
--> statement-breakpoint
ALTER TABLE "servers" DROP CONSTRAINT "servers_apiId_apiDocs_id_fk";
--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_api_id_apiDocs_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apiDocs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sdkWrappers" ADD CONSTRAINT "sdkWrappers_api_id_apiDocs_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."apiDocs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servers" ADD CONSTRAINT "servers_apiId_apiDocs_id_fk" FOREIGN KEY ("apiId") REFERENCES "public"."apiDocs"("id") ON DELETE cascade ON UPDATE no action;