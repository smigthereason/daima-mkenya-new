// import { createClient } from 'next-sanity'
// import { apiVersion, dataset, projectId } from '../env'

// export const client = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   // NextAuth needs to write to Sanity, so we use a token and disable CDN for those requests
//   token: process.env.SANITY_API_TOKEN, 
//   useCdn: false, 
// })

// sanity/lib/client.ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // This token must be added to your .env.local with "Editor" permissions
  token: process.env.SANITY_API_TOKEN, 
  // useCdn must be false for authentication/writing data
  useCdn: false, 
})