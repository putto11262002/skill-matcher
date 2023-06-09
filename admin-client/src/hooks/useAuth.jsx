import { useRouter }  from 'next/router'
import  { useEffect,  } from 'react'
import { useSelector } from 'react-redux'

const useAuth = () => {
  
    const {isLoggedIn} = useSelector(state => state.auth)

    const router = useRouter()
    useEffect(() => {
        if(!isLoggedIn) router.push('/sign-in')
    }, [isLoggedIn])
   
  return null
}
export default useAuth