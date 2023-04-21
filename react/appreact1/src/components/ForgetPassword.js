import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

//   const onChangePassword = (e) => {
//     const password = e.target.value;
//     setPassword(password);
//   };

  const handleForgotPassword = (e) => {

    e.preventDefault();
    AuthService.ForgotPassword(email).then(
      (res) => {
        
        // setMessage(res);
        console.log(res)
        document.getElementById("messageDiv").innerHTML=res;
        // if(res){
        // alert(res);
        // }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

       
        // setMessage(error);
        console.log(error);
        document.getElementById("messageDiv").innerHTML=error;
        // alert(error);
      }
    );
  }



  return <div className="ForgotPasswordForm fontCursive">
    {/* <h1>Sign In</h1> */}
    <form onSubmit={handleForgotPassword}>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input type="email" className="form-control" placeholder="Enter email" value={email}
          onChange={onChangeEmail}></input>
        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <br></br>

      
      <button type="submit" className="btn btn-primary" >Submit</button>
    </form>
    <div id="messageRegDiv"></div>
  </div>
}

export default ForgotPassword;