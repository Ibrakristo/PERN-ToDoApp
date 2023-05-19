import ListHeader from './ListHeader'
import {useEffect, useState} from 'react'
import ListItem from './ListItem'
import { useCookies } from 'react-cookie'
import { useNavigate, useParams } from 'react-router-dom'



const App=() =>{


  const [cookies,setCookie,removeCookie]=useCookies(null)
  const accessToken = cookies.accessToken;
  const {taskId} = useParams();
const [tasks,setTasks] = useState(null);
const navigate = useNavigate();
const [shouldRedirect,setShouldRedirect] = useState(false);

  useEffect(()=>{
    if(!accessToken){
      navigate("/");
      setShouldRedirect(true);
    }
  },[])
  const getData =async()=>{

    try{
    let params = new URLSearchParams({ task_id: taskId});
const response= await fetch(`${"http://localhost:4000"}/subtask?${params}`,{
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

  async function handleSubmit(e){
    let params = new URLSearchParams({ col_name: e.target.value, task_id:taskId});
    if(e.target.value =="completed_date"){
       params = new URLSearchParams({ col_name: e.target.value,order:-1});
    }
    let response = await fetch(`http://localhost:4000/subtask?${params}`,{
      headers:{
        "Content-Type":"application/json",
        authorization:"bearer " + accessToken
      },
    })
    let datas = await  response.json();
    console.log(datas);
    setTasks(JSON.parse(datas.result));
  }
  
  return (
   
    (shouldRedirect?"":<div className='app'>
    <>
    <ListHeader listName={' 😎 Daily Routine Tick List'} getData={getData}/>
    <div className='sorting_container'>
      <div>
          <select name="col_name" id="col_name" defaultValue="default" onChange={handleSubmit}>
            <option value="default" disabled  >default</option>
            <option value="created_date" >Created Date</option>
            <option value="completed_date" >Completed Date</option>
            <option value="index" >Priority</option>
          </select>
      </div>
    </div>
    {tasks?.map((task)=> <ListItem key={task._id } task={task} getData={getData} />)}
    </> 
    </div>)
    
   
  );
}


 
export default App;
 