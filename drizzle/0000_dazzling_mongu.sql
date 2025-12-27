CREATE TABLE "Todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"status" boolean DEFAULT false NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"googleId" varchar(255),
	"name" varchar(255),
	"profilePicture" varchar(1000),
	CONSTRAINT "User_username_unique" UNIQUE("username"),
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;