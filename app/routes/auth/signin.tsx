import { account, appwriteConfig } from '@/auth/client';
import { Button } from '@/components/ui/button'
import { FaGoogle } from "react-icons/fa"
import { redirect } from 'react-router';
import { loginWithgoogle } from '@/auth/auth';

export async function clientLoader() {
    try {
        const user = await account.get();
        if(user.$id) return redirect('/');
        console.log(user.name,"from signin")
    } catch (e) {
        console.log('Error fetching user', e)
    }
}


const signin = () => {
  return (
   <main className="auth">
  <section className="w-full h-full glassmorphism flex-center">
    <div className="sign-in-card bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
      <header className="header">
        <img src={'/icons/logo.svg'}/>
        <h1 className="text-2xl font-bold text-dark-100">Tourvisto</h1>
      </header>

      <article className='text-center gap-y-2'>
        <h2 className="p-28-semibold text-center ">Admin Dashboard Login</h2>
        <p className='text-gray-500 min-w-20'>Sign in with Google to manage destinations,
            itineraries, and user activity with ease. </p>
      </article>
    
    <Button onClick={()=>loginWithgoogle()} variant={"default"} className='text-xl gap-3 text-center'>
        <FaGoogle size={24}/>
        <h2> Sign in with Google</h2>
    </Button>
    
      
    </div>
  </section>
</main>

  )
}

export default signin