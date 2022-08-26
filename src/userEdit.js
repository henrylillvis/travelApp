import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userEdit.css';
import { DataContext } from "./TravelApp";
import { toFormData } from './utils/dataHandler';
import { ErrorAlert } from './utils/itemHandle';

//vastaanottaa propsissa käyttäjän id:n, hakee rajapinnasta käyttäjän tiedot id:llä ja täyttää formin vastaavasti
const UserEdit = () => {
  const dl = useContext(DataContext);
  const id = dl.user.idmatkaaja;
  const token = dl.user.token;
  const navigate = useNavigate();
  const [person, setPerson] = useState({});
  const [alert, setAlert] = useState();

  //hae data matkaajasta id:n perusteella
  useEffect(async () => {
    const fetchData = async () => {
      let response = await fetch(`http://localhost:3004/myinfo?id=${id}`);
      let data = await response.json();
      return data.user[0];
    }
    let user = await fetchData();
    setPerson(user);
  }, []);

  const inputChanged = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setPerson({...person, [name]:value});
  } 

  const imageChanged = (event) => {
    let name = event.target.name;
    let value = event.target.files[0]; 
    setPerson({...person, [name]:value});
  } 

  const saveChanges = async () => {
    const editUser = async () => {
      let data = toFormData(person);
      const options = {
        method: 'PUT',
        headers: {
          'authorization': 'bearer ' + dl.user.token
        },
        body: data
      };
      let response = await fetch(`http://localhost:3004/myinfo/${id}`, options);
      return await response.json();
    }
    let response = await editUser();
    if (response.status === 'OK'){
      console.log(response);
      dl.changeNickname(response.user[0].nimimerkki);
      navigate('/');
    }
      
    else
      setAlert(response);
  }

  const deleteUser = async () => {
    const deleteUser = async () => {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'authorization': 'bearer ' + dl.user.token
        }
      };
      let response = await fetch(`http://localhost:3004/myinfo/${id}`, options);
      return await response.json();
    }
    if (window.confirm('Haluatko varmasti poistaa omat tietosi pysyvästi?')){
      let status = await deleteUser();
      if(status.status === 'OK')
        dl.logoutDone();

    }
  }

  return (
    <Form>
      {(alert) ? <ErrorAlert status={alert}/> : null}
      <Form.Group className="mb-3" controlId="formImage">
        <Form.Label><h4 className='mb-0'>Kuva</h4></Form.Label>
        <Form.Control type="file" placeholder="Lataa kuvasi tähän" name="kuva" onChange={(e) => imageChanged(e)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicInfo">
        <Form.Label>Etunimi</Form.Label>
        <Form.Control type="text" placeholder="Etunimi" name="etunimi" value={person.etunimi} onChange={(e) => inputChanged(e)}/>
        <Form.Label>Sukunimi</Form.Label>
        <Form.Control type="text" placeholder="Sukunimi" name="sukunimi" value={person.sukunimi} onChange={(e) => inputChanged(e)}/>
        <Form.Label>Nimimerkki</Form.Label>
        <Form.Control type="text" placeholder="Nimimerkki" name="nimimerkki" value={person.nimimerkki} onChange={(e) => inputChanged(e)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formSpecialInfo">
        <Form.Label>Paikkakunta</Form.Label>
        <Form.Control type="text" placeholder="Paikkakunta" name="paikkakunta" value={person.paikkakunta} onChange={(e) => inputChanged(e)}/>
        <Form.Label>Esittely</Form.Label>
        <Form.Control as="textarea" placeholder="Esittely" name="esittely" value={person.esittely} onChange={(e) => inputChanged(e)}/>
      </Form.Group>
      <div className="buttonsDiv">
        <Button className="btn btn-primary" onClick={() => saveChanges()}>
          Tallenna
        </Button>
        <Button className="btn btn-danger" onClick={() => deleteUser()}>
          Poista tiedot
        </Button>
      </div>
    </Form>
  )
}

export { UserEdit }