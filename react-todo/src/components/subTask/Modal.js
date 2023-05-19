import {useState} from 'react';
import { Cookies, useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';


const Modal=({mode, setShowModal,getData, task}) =>{
  const [cookies,setCookie,removeCookie]=useCookies(null)
  const accessToken = cookies.accessToken;
  const editMode = mode === "edit"? true : false ;
  const [action,setAction] = useState("text");
  const {taskId} = useParams();
  const [data, setData] = useState({
    parent_id: editMode? taskId:null,
    task_id:editMode? task._id:taskId,
    action: editMode ? action: null,
    text: editMode ? task.text: null,
    index: editMode ? task.index: 1,
    status:editMode? task.status : "uncompleted",
  });
  console.log(task);
  const [error,setError] = useState("");
  // getting data from database
const postData = async (e)=>{
  e.preventDefault()
  try{
const response= await fetch(`${"http://localhost:4000"}/subtask/create`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json',
  authorization : "bearer " + accessToken
},
  body: JSON.stringify(data)
})

let json = await response.json();
  if(json.error){
    setError(json.error);
  }  else{
    console.log('Worked!')
    setShowModal(false)
    getData()
  }
  }catch (err){
    console.error(err)
  }
}

const editData = async(e)=>{
  console.log(data);
  e.preventDefault()
  try{
 const response= await fetch(`${"http://localhost:4000"}/subtask/update`,{
  method: 'PATCH',
  headers: {'Content-Type': 'application/json',
  authorization : "bearer " + accessToken
},
  body: JSON.stringify(data)
 })
 let json = (await response.json());
 console.log(json)
 if(json.error){
  setError(json.error);
 }
 if(response.status===200){
  
  setShowModal(false)
  getData()
 }
  }catch (err){
    console.error(err)
  }
}
const handleChange=(e)=>{
  let {name, value} = e.target
  if(name == "index"){
    value = Number(value);
  }
  setData(data => ({
    ...data,
    [name]: value,
    action
  }))
}
    return (
      <div className="overlay" >
        <div className="modal">
          <div className="form-title-container">
            <h3>Let's {mode} Your Task</h3>
            <button onClick={()=>setShowModal(false)}>X</button>
          </div>

     {editMode? (<form>
        <button type='button' className='edit' onClick={()=>{setAction("text")}}>Text</button><button  className='edit' type='button' onClick={()=>{setAction("index")}}>Index</button><button className='edit' type='button' onClick={()=>{setAction("status")}}>Status</button>
        <input 
        required
        maxLength={30}
        placeholder="Your task goes here"
        name="text"
        value={data.text}
        onChange={handleChange}
        hidden= {action=="text"? false:true}
        />
        <input 
        required
        maxLength={30}
        placeholder="Your task goes here"
        name="index"
        value={data.index}
        onChange={handleChange}
        hidden= {action=="index"? false:true}
        />
        <select name="status" onChange={handleChange} hidden= {action=="status"? false:true}  value={data.status}>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
          <option value="canceled">Canceled</option>
        </select>
        <input className={mode} type="submit" onClick={editMode ? editData: postData}/>
      </form>):(<form>
        <input 
        required
        maxLength={30}
        placeholder="Your Task goes here"
        name="text"
        value={data.text}
        onChange={handleChange}
        />
        <input 
        required
        maxLength={30}
        placeholder="Your Task Priority goes here"
        name="index"
        value={data.index}
        onChange={handleChange}
        />
        <input className={mode} type="submit" onClick={editMode ? editData: postData}/>
      </form>)
        }
        <span>{error}</span>
        </div>
      </div>
    );
  }
  
  export default Modal;
  