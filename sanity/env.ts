// sanity/env.ts

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-17'

// For Sanity Studio deployment, provide fallback values
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production' // Your actual dataset name

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e3sm15j6' // Your actual project ID

// Optional: Keep this for development warnings but don't throw
export function validateEnv() {
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.warn('Warning: NEXT_PUBLIC_SANITY_DATASET is not set, using default: production')
  }
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn('Warning: NEXT_PUBLIC_SANITY_PROJECT_ID is not set, using default: e3sm15j6')
  }
}