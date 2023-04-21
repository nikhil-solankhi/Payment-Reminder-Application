import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service"


const PropertyEdit = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserProperty, setCurrentProperty] = useState([]);
  const [findProperty, setFindProperty] = useState(undefined);
  const [message, setMessage] = useState("");
  const [propReg, setPropReg] = useState({ id: 0, name: "", address: {}, ownerId: 0 });
  const [address, setAddress] = useState({ city: "", state: "", country: "", pinCode: "" });


  useEffect(() => {

    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setCurrentProperty(user.properties);
      setPropReg({ ...propReg, ["ownerId"]: parseInt(user.id) });
      
      console.log(id);
      console.log(user.properties);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFindProperty(currentUserProperty.find(obj => obj.id == id));
      console.log(findProperty);
     
    }
  })

  useEffect(() => {
    if (findProperty) {
      setPropReg({ ...propReg, ["id"]: parseInt(id) });
    }
  })


  const handleRegister = (e) => {
    e.preventDefault();
    console.log(propReg);
    
    UserService.updateProperty(propReg, address).then(
      (res) => {
        localStorage.setItem("currentUser", JSON.stringify(res.data));
        console.log(res.data);
       
        // window.location.reload();
        document.getElementById("messageRegDiv").innerHTML = "Property added succesfully";
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();


        setMessage("error occured");
        console.log(resMessage);
        document.getElementById("messageRegDiv").innerHTML = message;
      }
    ).then(()=>{UserService.getUser(currentUser.id).then((res) => {
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/property");
      window.location.reload();
  })});
  }
  console.log(propReg);
  return <div className="PropertyFormForm fontCursive">
    <h1>Property Form</h1>
    {findProperty ? (
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" name="name" placeholder={findProperty?.name} onChange={e => (setPropReg({ ...propReg, ["name"]: e.target.value }))}></input>
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" className="form-control" name="city" placeholder={findProperty?.address.city} onChange={e => (setAddress({ ...address, ["city"]: e.target.value }))}></input>
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input type="text" className="form-control" name="state" placeholder={findProperty?.address.state} onChange={e => (setAddress({ ...address, ["state"]: e.target.value }))}></input>
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input type="text" className="form-control" name="password" placeholder={findProperty?.address.country} onChange={e => (setAddress({ ...address, ["country"]: e.target.value }))}></input>
        </div>
        <div className="form-group">
          <label htmlFor="pinCode">Pincode</label>
          <input type="text" className="form-control" name="pinCode" placeholder={findProperty?.address.pinCode} onChange={e => (setAddress({ ...address, ["pinCode"]: e.target.value }))}></input>
        </div>
        <br></br>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    ) : (
      <div> Loading </div>)}

    <div id="messageRegDiv"></div>
  </div>
}

export default PropertyEdit;