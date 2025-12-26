CREATE TABLE "branches" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"owner" text,
	"owner_phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"general_name" text DEFAULT '' NOT NULL,
	"name" jsonb NOT NULL,
	"image" text,
	"order" numeric DEFAULT '1' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "food_types" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"general_name" text DEFAULT '' NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb NOT NULL,
	"icon" text,
	"color" text DEFAULT '#4CAF50',
	"is_active" boolean DEFAULT true NOT NULL,
	"order" numeric DEFAULT '1' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" varchar NOT NULL,
	"name" jsonb NOT NULL,
	"short_description" jsonb NOT NULL,
	"long_description" jsonb NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"discounted_price" numeric(10, 2),
	"max_select" numeric,
	"image" text,
	"available" boolean DEFAULT true NOT NULL,
	"suggested" boolean DEFAULT false NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"materials" text[],
	"types" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"native_name" text DEFAULT '',
	"direction" text DEFAULT 'ltr',
	"flag_image" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false,
	"order" numeric DEFAULT '1' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"general_name" text DEFAULT '' NOT NULL,
	"name" jsonb NOT NULL,
	"icon" text,
	"color" text DEFAULT '#FF6B6B',
	"is_active" boolean DEFAULT true NOT NULL,
	"order" numeric DEFAULT '1' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"table_number" varchar,
	"branch_id" varchar NOT NULL,
	"items" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "schema_versions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "schema_versions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"version" text NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"description" text,
	CONSTRAINT "schema_versions_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_color" text DEFAULT '#4CAF50' NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"favicon" text,
	"currency_name" text DEFAULT 'US Dollar' NOT NULL,
	"currency_symbol" text DEFAULT '$' NOT NULL,
	"license_key" text,
	"license_expiry_date" timestamp,
	"default_language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tables" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_number" text NOT NULL,
	"branch_id" varchar NOT NULL,
	"capacity" numeric NOT NULL,
	"location" text,
	"status" text DEFAULT 'available' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"role" text DEFAULT 'chef' NOT NULL,
	"avatar" text,
	"phone" text,
	"branch_id" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "waiter_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" varchar,
	"branch_id" varchar,
	"status" text DEFAULT 'pending' NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
