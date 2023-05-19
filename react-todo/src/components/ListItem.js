import { useState } from 'react';
import TickIcon from './TickIcon';
import Modal from './Modal';
import { Cookies, useCookies } from 'react-cookie';


const ListItem=({task,getData}) =>{
  const [showModal,setShowModal]= useState(false)
  const [cookies,setCookie,removeCookie]=useCookies(null)
  let accessToken = cookies.accessToken;
   const deleteItem = async()=>{
    
    try{
      const response= await fetch(`${"http://localhost:4000"}/task/delete`,
      {
        method: 'DELETE',
        headers:{
          "Content-Type":"application/json",
          authorization : "bearer " + accessToken

        },
        body:JSON.stringify({task_id:task._id})
      })
      if(response.status===200){
        getData()
      }
    }catch(err){
      console.log(err)
    }
   }

    return (
      <li className="list-item ">
        <div className="info-container">
          <TickIcon/>
          
        <span>{task.index + " -"} </span>
        <p className="task-title"> {task.text}</p>
        </div>
        <div className='button-container'>
        <button className='edit' onClick={ ()=> setShowModal(true)}>Edit</button>
        <button className='delete' onClick={deleteItem}>Delete</button>
          
        </div>
        {showModal && <Modal mode= {'edit'} setShowModal={setShowModal} getData={getData} task={task}/>}
        </li>
    );
  }
  
  export default ListItem;
  