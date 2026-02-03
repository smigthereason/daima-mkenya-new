import AfricaDottedMap from '@/components/landing-page/AfricaDottedMap'
import Hero from '@/components/landing-page/Hero'
import NewArrivals from '@/components/landing-page/NewArrivals'
import SdgCommitment from '@/components/landing-page/SDGCommitment'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <AfricaDottedMap />
      <SdgCommitment />
    </div>
  )
}

export default page
