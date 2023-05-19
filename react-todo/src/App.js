import ListHeader from './components/ListHeader'
import Auth from './components/Auth'
import {useEffect, useState} from 'react'
import ListItem from './components/ListItem'
import { useCookies } from 'react-cookie'
import {Chart} from 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js'

const App=() =>{


  const [cookies,setCookie,removeCookie]=useCookies(null)
  const accessToken = cookies.accessToken;
const [tasks,setTasks] = useState(null);
  const[compTasks,setCompTasks] = useState(0);
  const[avgCompTasks,setAvgCompTasks] = useState([]);
  const[avgDay,setAvgDay] = useState(0);
  const getData =async()=>{

    try{

const response= await fetch(`${"http://localhost:4000"}/task`,{
  headers:{
    authorization:"bearer " + accessToken
  }
})
const json= await response.json()
  let fs=  JSON.parse(json.result);
  let temp = 0;
  let tr = [];
  let avg = 0;
  for(let task of fs){
    if(task.status == "completed"){
      temp++;
      let time = (new Date()).getTime() - new Date(task.completed_date).getTime();
      let diff = Math.round(time / (24 * 60 * 60 * 1000));
      if(diff<7){
        avg++;
      }
      if(tr[diff] == null){
        tr[diff]  = 1;
        continue;
      }
      tr[diff] = tr[diff]+1;
      console.log(diff)
    }
  }
  setAvgDay(((avg/7).toFixed(3)));
  setAvgCompTasks(tr);
  console.log(tr);
  setCompTasks(temp);
  setTasks(fs);
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
    let params = new URLSearchParams({ col_name: e.target.value});
    if(e.target.value =="completed_date"){
       params = new URLSearchParams({ col_name: e.target.value,order:-1});
    }
    let response = await fetch(`http://localhost:4000/task?${params}`,{
      headers:{
        "Content-Type":"application/json",
        authorization:"bearer " + accessToken
      },
    })
    let datas = await  response.json();
    console.log(datas.result);
    setTasks(JSON.parse(datas.result));
  }

  useEffect(()=>{
    const script = document.createElement('script');
    script.innerHTML = `var xValues = ["day 1", "day 2", "day 3", "day 4", "day 5", "day 6", "day 7"];
    var yValues = [${avgCompTasks[0]?avgCompTasks[0]:0}, ${avgCompTasks[1]?avgCompTasks[1]:0}, ${avgCompTasks[2]?avgCompTasks[2]:0}, ${avgCompTasks[3]?avgCompTasks[3]:0}, ${avgCompTasks[4]?avgCompTasks[4]:0},${avgCompTasks[5]?avgCompTasks[5]:0},${avgCompTasks[6]?avgCompTasks[6]:0}];
    var barColors = ["red", "green","blue","orange","brown","purple","yellow"];
    new Chart("myChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }] } ,options: {
          legend: {display: false},
          title: {
            display: true,
            text: "Completed Tasks Per Day"
          }   }});`
          
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };


  },[avgCompTasks])
    
    
  return (
   
    
    <div className='app'>
      <script
    src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js">
</script>
      {!accessToken && <Auth/>}
      {accessToken && 
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
        <p>{tasks?compTasks?((compTasks/tasks.length).toFixed(3)*100) + "% of Completed Tasks":"There Is No Completed Tasks":"There Is No Completed Tasks"}</p>
      <p className='user-email'>Welcome back! 😇  </p>
      </div>
      {tasks?.map((task)=> <ListItem key={task._id } task={task} getData={getData} />)}
      <canvas id="myChart" style={{"width":"100%","maxWidth":"700px"}}></canvas> </> }
      <div style={{textAlign:'center'}}>{avgDay?avgDay + " Average Completed Tasks Per Day":"Calculating The Average"}</div>
      </div>
   
  );
}


 
export default App;
 