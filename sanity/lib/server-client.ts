// sanity/lib/server-client.ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Server-side client with no caching for admin operations
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Always false for server operations
});

// Client-side client (if needed for browser operations)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production", // Use CDN in production for reading
});
