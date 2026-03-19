// // sanity/lib/client.ts
// import { createClient } from "next-sanity";
// import { apiVersion, dataset, projectId } from "../env";

// export const client = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   token: process.env.SANITY_API_TOKEN,
//   useCdn: false,
// });
// sanity/lib/client.ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // We keep the token for admin write-access
  token: process.env.SANITY_API_TOKEN,

  // OPTIMIZATION: Set to true.
  // This uses Sanity's Edge Cache (API CDN) which is faster for public users.
  // The client will still automatically bypass the CDN for mutations (writes).
  useCdn: true,
});
