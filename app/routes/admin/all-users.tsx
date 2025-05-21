import Button from '@/components/Button'
import Header from '@/components/Header'
import React from 'react'

const AllUsers = () => {
  return (
    <main className='dashboard wrapper'>
      <div className='flex-between'>
        <Header
          title='Manage Users'
          description='Filter,sort, and access detailed user profiles'
        />

        <Button text='Add new user'/>
      </div>
    </main>
  )
}

export default AllUsers