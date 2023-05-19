import ListHeader from './components/ListHeader'
import Auth from './components/Auth'
import {useEffect, useState} from 'react'
import ListItem from './components/ListItem'
import { useCookies } from 'react-cookie'




const App=() =>{


  const [cookies,setCookie,removeCookie]=useCookies(null)
  const accessToken = cookies.accessToken;
const [tasks,setTasks] = useState(null)

  const getData =async()=>{

    try{

const response= await fetch(`${"http://localhost:4000"}/task`,{
  headers:{
    authorization:"bearer " + accessToken
  }
})
const json= await response.json()

setTasks(JSON.parse(json.result))
    }catch(err){
      console.error(err)

    }
  }
useEffect(()=> {
  if(accessToken){
    getData()
  }} 
, [])

  
  return (
   
    
    <div className='app'>
      {!accessToken && <Auth/>}
      {accessToken && 
      <>
      <ListHeader listName={' 😎 Daily Routine Tick List'} getData={getData}/>
      <p className='user-email'>Welcome back! 😇  </p>
      {tasks?.map((task)=> <ListItem key={task._id } task={task} getData={getData} />)}
      </> }
      <p className='copyright'> © Managing Daily Routine with Zoya</p>
      </div>
   
  );
}



 
export default App;
 