import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Profile=()=>{
    const [currentUser, setCurrentUser] = useState(undefined);
    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            console.log(user)
        }
    });
    return <div className="fontCursive profile">
        <h1>Profile</h1> <Link to="/property" className="navLinks"><button className="btn btn-info">Edit Profile</button></Link>
        <br></br>
        <br></br>
       <h3>First Name: {currentUser?.firstName}</h3>
        <br></br>
        <h3>Last Name:{currentUser?.lastName}</h3>
        <br></br>
        <h3>Email:{currentUser?.email}</h3>

    </div>
}

export default Profile;