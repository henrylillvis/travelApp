import { useState, useEffect, useContext } from "react";
//import Button from 'react-bootstrap/Button';
import { Button, Spinner, Alert, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ItemView, ItemList } from './utils/itemHandle';
import { DataContext } from "./TravelApp";

// Hakee käyttäjät rajapinnasta listanäkymään, josta valitsemalla käyttäjän, näyttää yksityiskohtaiseen korttinäkymän
export const UsersControl = (props) => {

    const url = 'http://localhost:3004/users?'  // props.url;

    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(<Alert variant="dark">Paina profiilia nähdäksesi tarkemmat tiedot</Alert>);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [getCounter, setGetCounter] = useState(0);
    const [infoText, setInfoText] = useState("");

    const dl = useContext(DataContext);
    const defaultGet = {
        method: 'GET',
        headers: {
          'authorization': 'bearer ' + dl.user.token
        },
      }
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                let response = await fetch(url + query, defaultGet);
                let c = await response.json();
                setLoading(false);
                console.log(c);
                if (c.status == 'NOT OK'){
                    setInfoText(c.message);
                    setError(true);
                }
                else if(c.statusCode == 401){
                    setInfoText("Ei oikeuksia!");
                    setError(true);
                }
                else if(c.users.length == 0){
                    setInfoText("Hakuehdoilla ei löytynyt yhtään matkaajaa!");
                    setError(true);
                } 
                else{
                    console.log("Asetetaan listaan käyttäjät: " + c.users);
                    setUsers(c.users);
                }           
                    
            } catch (error) {
                console.log(error);
                setInfoText("Tekninen virhe palvelimeen ei saada yhteyttä, kokeile myöhemmin uudelleen!");
                setError(true);
            }

        }
        fetchUsers();
    }, [getCounter, query]);

    const handleFetch = () => {
        setError(false);
        let m = "";
        if (firstName !== "" && lastName !== "") m = "etunimi=" + firstName + "&sukunimi=" + lastName;
        else if (firstName !== "") m = "etunimi=" + firstName;
        else if (lastName !== "") m = "sukunimi=" + lastName;
        setQuery(m);
        setGetCounter(getCounter + 1);
        setFirstName('');
        setLastName('');
    }

    const handleClickedUser = (user) => {
        console.log(user);
        setUser(<ItemView data={user} datatype={"user"} />);
    }

    const renderView = () => {
        if (loading) return <div className="d-flex justify-content-center d-inline-block"><Spinner animation="border"></Spinner></div>;
        else if (error) return <div className="d-flex justify-content-center d-inline-block"><Alert variant="danger">{infoText}</Alert></div>;
        else { 
            return <div className="d-flex justify-content-center d-inline-block">
                <div className="px-4 overflow-auto ">
                    <ItemList handleClick={handleClickedUser} datatype={"user"} data={users} />
                </div>
                <div className="col-sm-5 px-4">
                    {user}
                </div>
            </div>
        }
    }
    return (
        <div>
            <div className="d-flex justify-content-center py-2 " >
                <input type="text" placeholder="Etunimi" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="Sukunimi" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <Button onClick={() => handleFetch()}>Hae</Button>
            </div>
            {renderView()}
        </div>
    );
}




