import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

const Property = () => {
    const [currentUserProperty, setCurrentProperty] = useState([]);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);

        if (user) {
            setCurrentProperty(user.properties);
            console.log(user.properties);
        }

    }, []);

    const deleteProp = id => {
        UserService.deleteProperty(id).then((res) => {
            console.log(res.data);

        }).then(() => {
            
            UserService.getUser(currentUser.id).then((res) => {
                localStorage.setItem("currentUser", JSON.stringify(res.data));

                const user = AuthService.getCurrentUser();
                setCurrentUser(user);

                if (user) {
                    setCurrentProperty(user.properties);
                    console.log(user.properties);
                }
            })
        });
    };


    return <div>
        <div className="container fontCursive">
            <h1>Properties of {currentUser.firstName}</h1> <Link to="/propertyform" className="navLinks"><button className="btn btn-info">Add Properties</button></Link>
            <div className="row">
                <div className="col-sm-12">

                    <table className="table table-light table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Property Name</th>
                                <th scope="col">City</th>
                                <th scope="col">State</th>
                                <th scope="col">Country</th>
                                <th scope="col">Pin Code</th>
                                <th scope="col">Delete</th>
                                <th scope="col">Edit</th>
                                <th scope="col">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentUserProperty?.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.address.city}</td>
                                        <td>{item.address.state}</td>
                                        <td>{item.address.country}</td>
                                        <td>{item.address.pinCode}</td>

                                        <td >   <button className="btn btn-danger btn-sm navLinks" onClick={() => deleteProp(item.id)}>Delete</button>  </td>
                                        <td>  <Link to={`/property/edit/${item.id}`} className="navLinks">  <button className="btn btn-warning btn-sm">Edit</button> </Link> </td>
                                        <td> <Link to={`/property/view/${item.id}`} className="navLinks">  <button className="btn btn-success btn-sm">View Clients</button> </Link> </td>
                                    </tr>

                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
}

export default Property;