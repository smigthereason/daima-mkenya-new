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
  token: process.env.SANITY_API_TOKEN, 
  useCdn: false, 
})