
import { useState } from 'react';
import Modal from './Modal';
import { useCookies } from 'react-cookie';


const ListHeader=({listName,getData}) =>{
  const[cookies,setCookie,removeCookie]= useCookies(null)
const [showModal,setShowModal]= useState(false)
  const signOut = ()=>{
    console.log('signout')
    removeCookie("accessToken")
  }


    return (
      <div className="list-header" >
        <h1>{listName}</h1>
        <div className="button-container">
          <button className="create" onClick={ ()=> setShowModal(true)}>Add New</button>
          <button className="signout" onClick={signOut}>Sign Out</button>
          </div>
      {showModal && <Modal mode= {'create'} setShowModal={setShowModal} getData={getData}/>}
      </div>
    );
  }
  
  export default ListHeader;
  