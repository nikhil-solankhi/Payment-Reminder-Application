import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useParams } from "react-router-dom";

const Payment = () => {
    const { id } = useParams();
    const { p_id } = useParams();
    const [currentUser, setCurrentUser] = useState({});
    const [currentProperty, setCurrentProperty] = useState([]);
    const [propertyObj, setPropertyObj] = useState({});
    const [currentClient, setCurrentClient] = useState([]);
    const [clientObj, setClientObj] = useState({});
    const [currentPayement, setPayment] = useState([]);



    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
            setCurrentProperty(user.properties);
            console.log(id);
            console.log(user.properties);

        }
    }, []);

    useEffect(() => {
        if (currentProperty) {
            setPropertyObj(currentProperty.find(obj => obj.id == p_id));
            console.log(propertyObj);
        }
    })

    useEffect(() => {
        if (propertyObj) {
            setCurrentClient(propertyObj.clients);
            console.log(currentClient);
        }
    })

    useEffect(() => {
        if (currentClient) {
            setClientObj(currentClient.find(obj => obj.id == id));
            console.log(clientObj);
        }
    })

    useEffect(() => {
        if (clientObj) {
            setPayment(clientObj.payments);
            console.log(currentPayement);
        }
    })


    return <div>
        <div className="container fontCursive">
            <h1>Payments of {clientObj?.firstName}</h1> <Link to={`/payemntform/${id}/${p_id}`} className="navLinks"><button className="btn btn-info">Add Payment</button></Link>
            <div className="row">
                <div className="col-sm-12">

                    <table className="table table-light table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Amount</th>
                                <th scope="col">Paid on</th>
                                <th scope="col">Due Date</th>


                                {/* <th scope="col">Status</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {

                                currentPayement?.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.amount}</td>
                                        <td>{item.date}</td>
                                        <td>{item.dueDate}</td>
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

export default Payment;