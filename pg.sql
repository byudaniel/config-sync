--- REFERENCE SCRIPT FOR CREATING TABLE
CREATE TABLE "public"."configuration_manager_values" (
    "id" serial PRIMARY KEY,
    "key" varchar,
    "value" json,
    "scope_key" varchar,
    "scope_value" varchar,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP,
    CONSTRAINT key_scope_key UNIQUE (key, scope_key)
);