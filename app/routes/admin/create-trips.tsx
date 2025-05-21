import Button from '@/components/Button'
import Header from '@/components/Header'
import React from 'react'

const createTrips = () => {
  return (
    <main className='dashboard wrapper'>
      <div className='flex-between'>
      <Header
        title='Add new Trips'
        description='view and generate AI travel plans'
      />
      <Button  text='Create a trip'/>

      </div>
    </main>
  )
}

export default createTrips