import { useState } from "react";
import axios from 'axios';

const Login = (props) => {
  const {handleLogin, createUser} = props
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const handleLoginSubmit = async () => {
    if (createUser) {
      const response = await axios.post("http://localhost:5000/users/register", {username, password}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      handleLogin(response.data)
    } else {
      const response = await axios.post("http://localhost:5000/users/login", {username, password}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      handleLogin(response.data)
    }
  }
  return (
    <div className="App">
      {createUser && <p>Register User</p>}
      <div class="form-group">
        <div className="row">
          <label for="formInput">User Name</label>
        </div>
        <input name="user_name" type="text" className="form-control row" onChange={(e) => setUserName(e.target.value)} placeholder="User Name" />
      </div>
      <div class="form-group">
        <div className="row">
          <label for="formInput">Password</label>
        </div>
        <input name="password" type="password" className="form-control row" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </div>
      
      <div class="form-group">
        <button type="button" onClick={() => handleLoginSubmit()} className="form-control row" >Submit</button>
      </div>
    </div>
  );
}

const GenerateLink = (props) => {
  const {userData, handleGenerateLink} = props
  const handleGenerateLinkSubmit = async() => {
    console.log("Printed");
    const response = await axios.post("http://localhost:5000/links/generate-link", {username: userData.username}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    handleGenerateLink(response.data)
  }
  return (
    <div class="form-group">
      <p>Generate Link</p>
      <button type="button" onClick={() => handleGenerateLinkSubmit()} className="form-control row" >Submit</button>
    </div>
  )
}
function App() {
  const [logindata, setLoginData] = useState("")
  const [link, setLink] = useState("")
  const [register, setRegisterUser] = useState("")

  const handleLogin = (e) => {
    if (!logindata) {
      setLoginData(e)
    }
    if (logindata && logindata.role === "ADMIN") {
      setRegisterUser(e)
      setTimeout(() => {
        setLoginData("")
        setRegisterUser("")
      }, 5000);
    }
  }

  const handleGenerateLink = (e) => {
    if (e.link) {
      setLink(e.link)
      setTimeout(() => {
        setLoginData("")
        setLink("")
      }, 5000);
    }
  }
  console.log("link", link);
  return (
    <div className="App">
      {!logindata && <Login handleLogin={(e) => handleLogin(e)} />}
      {logindata && logindata.role === "ADMIN" && <Login handleLogin={(e) => handleLogin(e)} createUser={true} />}
      {register && <p>User registered Successfully</p>}
      {logindata && logindata.role !== "ADMIN" && <GenerateLink userData={logindata} handleGenerateLink={(e) => handleGenerateLink(e)} />}
      {link && <p>Link generated Successfully {link}</p>}
    </div>
  );
}

export default App;
