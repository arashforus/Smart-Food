CREATE TABLE IF NOT EXISTS "analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_path" text NOT NULL,
	"referrer" text,
	"user_agent" text,
	"language" text,
	"session_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);