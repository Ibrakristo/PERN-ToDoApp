import { useState } from "react";
import { useCookies } from "react-cookie";
const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogin, setIsLogin] = useState(true)
  const [firstname,setFirstName] = useState(null);
  const [lastname,setLastName] = useState(null);
  const [username,setUserName] = useState(null);
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirm_password, setConfirmPassword] = useState(null)

  const [error, setError] = useState(null)


  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    if (!isLogin && password !== confirm_password) {
      setError('Make sure passwords match!')
      return
    }

    const response = await fetch("http://localhost:4000/account/"+endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({firstname,lastname,username, email, password,confirm_password })
    })
    const data = await response.json();
    console.log(data);
    if (!data.result && endpoint=="register") {
      setError(data.msg||data.error);
    }
    else if ((!data.result || data.error) && endpoint=="login") {
      setError(data.msg||data.error);
      
    }
     else {
      if(endpoint =="register"){
        setIsLogin(true);
        setError("");
      }
      else{
        setCookie('accessToken', data.accessToken,{SameSite:"None"})  
      }

    }

  }




  return (
    <div className="auth-container" >
      <div className="auth-container-box">
      <h2>{isLogin ? 'Please log in ' : 'Please sign up!'}</h2>

        <form>
          {!isLogin && <input type="text"
            placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />}

          {!isLogin && <input type="text"
            placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />}

           <input type="text"
            placeholder="User Name" onChange={(e) => setUserName(e.target.value)} />



          {!isLogin && 
            <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
}
          <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
          {!isLogin && <input type="password"
            placeholder="confirm password" onChange={(e) => setConfirmPassword(e.target.value)} />}
          <input type="submit" className="create" onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'register')} />
          {error && <p>{error} </p>}
        </form>
        <div className="auth-options">
          <button onClick={() => viewLogin(false)}
            style={{ backgroundColor: !isLogin ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}
          >Sign Up</button>
          <button onClick={() => viewLogin(true)}
            style={{ backgroundColor: isLogin ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}
          >Login</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
