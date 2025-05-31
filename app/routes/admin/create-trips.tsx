import Button from '@/components/Button'
import Header from '@/components/Header'
import type { Route } from './+types/create-trips'
import {ComboBoxComponent} from "@syncfusion/ej2-react-dropdowns"

export const loader = async({params}:Route.LoaderArgs)=>{
  const response = await fetch("https://restcountries.com/v3.1/all")
  const data = await response.json()
  console.log(data)
  return data.map((country:any)=>({
    name:country.flag + country.name.common,
    coordinates:country.latlng,
    value:country.name.common,
    openStreetMap:country.maps?.openStreetMap,
  }))
}

const createTrips = ({loaderData}:Route.ComponentProps) => {
  const countries = loaderData as Country[]
  const countryData = countries.map((country)=>({
    text:country.name,
    value:country.value,
  }))
  console.log(countryData)
  const sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
  const onHandleSubmit=()=>{}
  const handleChange=(key:keyof TripFormData,value:string | number)=>{}

  return (
    <main className=' wrapper'>
      <div className='flex-between'>
        <Header
          title='Add new Trips'
          description='view and generate AI travel plans'
        />
        <Button  text='Create a trip'/>
      </div>

      <section className='mt-2.5 wrapper-md border'>
        <form className='trip-form' onSubmit={onHandleSubmit} >
            <div className='flex flex-col'>
                <label htmlFor='country'className='block text-sm font-medium'>Country</label>
                <ComboBoxComponent
                    id='country'
                    dataSource={sportsData}
                    fields={{text:'text',value:'value'}}
                    className='combo-box flex'
                    placeholder='Select a Country'
                    change={(e:{value:string|undefined})=>{
                       if(e.value){
                            handleChange('country',e.value)
                       }
                    }}
                />                    
            </div>
            <div>
              Input
            </div>
        </form>
      </section>
    </main>
  )
}

export default createTrips