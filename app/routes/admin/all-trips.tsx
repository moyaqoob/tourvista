import Button from "@/components/Button"
import Header from "@/components/Header"

const AllTrips = () => {
  return (
    <main className='dashboard wrapper'>
      <div className='flex-between'>
      <Header
        title=' Trips'
        description='view and generate AI travel plans'
      />
      <Button  text='Create a trip'/>

      </div>
    </main>
  )
}


export default AllTrips