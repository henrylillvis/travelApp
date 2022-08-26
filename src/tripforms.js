import { useState, useEffect, useContext } from "react";
import { Form, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createListGroup, populatePersonItems, populateTripItems, populatePlaceItems} from './utils/sw_utils';
import { toFormData } from './utils/dataHandler';
import { DataContext } from "./TravelApp";
import 'bootstrap/dist/css/bootstrap.min.css';
import './tripforms.css';

const FormStory = (props) =>{
  const dl = useContext(DataContext);
  const navigate = useNavigate();
  const {data, ids, setMainPanel, setAlert} = props;
  let init = {};
  let initDate = {min:'',max:''};
  if (data){
    init = data;
    initDate = {min:init.alkupvm,max:init.loppupvm};
  }

  const [story, setStory] = useState(init);
  const [selectedPlace, setSelectedPlace] = useState({});
  const [selectedTrip, setSelectedTrip] = useState({});
  const [tripDate, setTripDate] = useState(initDate);
  const [placeLG, setPlaceLG] = useState();
  const [tripLG, setTripLG] = useState();

  const defaultGet = {
    method: 'GET',
    headers: {
      'authorization': 'bearer ' + dl.user.token
    },
  }
  
  //hae data matkaajista, matkoista & matkakohteista, luo 2 listgrouppia & laita ne FormStory komponenttiin
  useEffect(async () => {
    const fetchData = async () => {
      let data = {};
      let response = await fetch('http://localhost:3004/trips', defaultGet);
      let tmp = await response.json();
      data['trips'] = tmp.data;
      response = await fetch('http://localhost:3004/destinations', defaultGet);
      tmp = await response.json();
      data['places'] = tmp.data;
      return data;
    }
    let data = {}; //trips & places

    if (Object.keys(story).length === 0){
      data = await fetchData();
      if(data['places']) setPlaceLG(createListGroup(data.places, populatePlaceItems, {placeSelected:placeSelected}));
      if(data['trips']) setTripLG(createListGroup(data.trips, populateTripItems, {tripSelected:tripSelected, editTrip:openTripForm}));
    }
  }, []);

  useEffect(async () => {
    const fetchData = async () => {
      //matkakohteet, joista ei ole vielä kirjoitettu kyseisestä matkasta tarinaa
      let data = [];
      let id = Object.keys(selectedTrip)[0];
      console.log(id);
      let response = await fetch(`http://localhost:3004/availabledestinations/${id}`, defaultGet);
      let tmp = await response.json();
      data = tmp.data;
      return data;
    }
    if(Object.keys(selectedTrip).length != 0){
      let places = await fetchData();
      setPlaceLG(createListGroup(places, populatePlaceItems, {placeSelected:placeSelected}));
      // aseta pvm kentälle matkan mukainen rajaus
      let id = Object.keys(selectedTrip)[0];
      setTripDate({min:selectedTrip[id].alkupvm,max:selectedTrip[id].loppupvm})
    }
    setSelectedPlace(null);
  }, [selectedTrip])

  const inputChanged = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setStory({...story, [name]:value});
  } 

  const imageChanged = (event) => {
    let name = event.target.name;
    let value = event.target.files[0]; 
    setStory({...story, [name]:value});
  } 

  const tripSelected = (ids, data) =>{
    let trip = {};
    trip[ids.matka] = data;
    setSelectedTrip(trip);
  }

  const placeSelected = (ids, data) =>{
    let place = {};
    place[ids.matkakohde] = data;
    setSelectedPlace(place);
  }

  const addStory = async () => {
    const storySend = async () => {
      let tripId = parseInt(Object.keys(selectedTrip)[0]);
      let placeId = parseInt(Object.keys(selectedPlace)[0]);
      let data = toFormData(story);
      data.set('idmatka',tripId);
      data.set('idmatkakohde',placeId);
      const options = {
        method: 'POST',
        headers: {
          'authorization': 'bearer ' + dl.user.token
        },
        body: data
      };
      let response = await fetch('http://localhost:3004/story', options);
      let json = await response.json();
      return json;
    }
    let status;
    if(selectedTrip && selectedPlace && story.pvm && story.teksti){
      status = await storySend();
      if(status.status === 'OK'){
        setAlert(null);
        setMainPanel(null);
      } else setAlert(status);

    }
    else{
      status = {status:'INFO',msg:'Tarkista että kentät on täytetty.'};
      setAlert(status);
    }
    //tänne error message ym. handlaus

  }

  const editStory = async (ids) => {
    const storySend = async () => {
      let data = toFormData(story);
      const options = {
        method: 'PUT',
        headers: {
          'authorization': 'bearer ' + dl.user.token
        },
        body: data
      };
      let response = await fetch(`http://localhost:3004/story?idmatka=${ids.matka}&idmatkakohde=${ids.matkakohde}`, options);
      let json = await response.json();
      return json;
    }
    let status;
    if(story.pvm && story.teksti){
      status = await storySend();
      if(status.status === 'OK'){
        setAlert(null);
        setMainPanel(null);
      } else setAlert(status);

    }
    else{
      status = {status:'INFO',msg:'Tarkista että kentät on täytetty.'};
      setAlert(status);
    }
    //tänne error message ym. handlaus
    console.log(status);

  }

  const deleteStory = async (ids) => {
    const deleteStory = async () => {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'authorization': 'bearer ' + dl.user.token
        }
      };
      let response = await fetch(`http://localhost:3004/story?idmatka=${ids.matka}&idmatkakohde=${ids.matkakohde}`, options);
      return await response.json();
    }
    if (window.confirm('Haluatko varmasti poistaa tarinan pysyvästi?')){
      let status = await deleteStory();
      if(status.status === 'OK'){
        setAlert(null);
        setMainPanel(null);
      } else setAlert(status);

      console.log(status);
    }
  }

  const openTripForm = (editIds, editData) => {
      setMainPanel(<FormTrip data={editData} ids={editIds} setMainPanel={setMainPanel} setAlert={setAlert}/>);
  }



  return(
    <div>
      <h1 className='mb-3'>Matkakertomuksen {data ? 'muokkaus' : 'luonti'}</h1>
        <div className="listGroupParent bg-light mb-1">
        {(init.kuva) ? <Image src={init.kuva}/> :null}
        {(tripLG) ? 
          <div className="listGroup">
            <h4 className='mb-0'>Matka</h4>
            <div className="mb-1 overflow-auto">
              {tripLG}
            </div>
            <h5>Valittu matkan id</h5>
            {(selectedTrip) ?
              <p>{Object.keys(selectedTrip)[0]}</p>
            : null}
            <Button className="btn btn-secondary" onClick={() => {setMainPanel(<FormTrip setMainPanel={setMainPanel} setAlert={setAlert}/>)}}>
              Luo matka
            </Button>
          </div>: null}
        {(placeLG) ? 
          <div className="listGroup">
            <h4 className='mb-0'>Matkakohde</h4>
            <div className=" mb-1 overflow-auto">
              {placeLG}
            </div>
            <h5>Valittu matkakohde</h5>
            {(selectedPlace) ?
              <p>{Object.values(selectedPlace)[0].kohdenimi}</p>
            : null}
            <Button className="btn btn-secondary" onClick={() => {navigate("/destinations")}}>
              Luo matkakohde
            </Button>
          </div>: null}
        </div>
      <Form>
        <Form.Group className="mb-3" controlId="formImage">
          <Form.Label><h4 className='mb-0'>Kuva</h4></Form.Label>
          <Form.Control type="file" placeholder="Lataa kuva tähän" name="kuva" onChange={(e) => imageChanged(e)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formTextDate">
          <Form.Label><h4 className='mb-0'>Päivämäärä</h4></Form.Label>
          <Form.Control type="date" placeholder="Pvm" name="pvm" value={story.pvm} min={tripDate.min} max={tripDate.max} onChange={(e) => inputChanged(e)}/>
          <Form.Label><h4 className='mb-0'>Tarina {(story.teksti)?story.teksti.length:0}/500</h4></Form.Label>
          <Form.Control as="textarea" maxlength="500" placeholder="Syötä tarina tähän" name="teksti" value={story.teksti} onChange={(e) => inputChanged(e)} />
        </Form.Group>
        <div className="buttonSpan">
          <Button className="btn btn-dark" onClick={() => {setMainPanel(null)}}>
            Sulje
          </Button>
            {data ?
              <div>
                <Button className="btn btn-danger" onClick={() => deleteStory(ids)}>
                  Poista
                </Button>
                <Button className="btn btn-primary" onClick={() => {editStory(ids)}}>
                  Tallenna
                </Button>
              </div>
            :
              <Button className="btn btn-primary" onClick={() => {addStory()}}>
                Lisää tarina
              </Button>}
        </div>
      </Form>
    </div>
  )
}

const FormTrip = (props) => {
  const dl = useContext(DataContext);
  const {data, ids, setMainPanel, setAlert} = props;
  let init = {alkupvm:'',loppupvm:'',yksityinen:false};
  let person = {nimimerkki:'', etunimi:'', sukunimi:''};
  if (data){
    init = {alkupvm:data.alkupvm,loppupvm:data.loppupvm,yksityinen:data.yksityinen};
    person = {nimimerkki:data.nimimerkki, etunimi:data.etunimi, sukunimi:data.sukunimi};
  }
  
  const [trip, setTrip] = useState(init);

  const defaultGet = {
    method: 'GET',
    headers: {
      'authorization': 'bearer ' + dl.user.token
    },
  }

  const addTrip = async () => {
    //matkaajan id saadaan tokenista
    const tripSend = async () => {
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization': 'bearer ' + dl.user.token
        },
        body: JSON.stringify({...trip})
      };
      let response = await fetch('http://localhost:3004/trip', options);
      let json = await response.json();
      return json;
    }
    let status;
    if(trip.alkupvm && trip.loppupvm){
      status = await tripSend();
      if(status.status === 'OK'){
        setAlert(null);
        setMainPanel(null);
      } else setAlert(status);

    }
    else
      status = 'Tarkista että kentät on täytetty.';
    //tänne error message ym. handlaus
    console.log(status);
  }

  const editTrip = async (ids) => {
    //tähän rajapinta kutsu lähettämään tiedot
    const tripSend = async () => {
      const options = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'authorization': 'bearer ' + dl.user.token
        },
        body: JSON.stringify({...trip})
      };
      let response = await fetch(`http://localhost:3004/trip/${ids.matka}`, options);
      let json = await response.json();
      return json;
    }
    let status;
    if(trip.alkupvm && trip.loppupvm){
      status = await tripSend();
      if(status.status === 'OK'){
        setAlert(null);
        setMainPanel(null);
      } else setAlert(status);

    }
    else
      status = 'Tarkista että kentät on täytetty.';
    //tänne error message ym. handlaus
    console.log(status);


  }

  const deleteTrip = async (ids) => {
    const deleteTrip = async () => {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'authorization': 'bearer ' + dl.user.token
        }
      };
      let response = await fetch(`http://localhost:3004/trip/${ids.matka}`, options);
      return await response.json();
    }
    if (window.confirm('Haluatko varmasti poistaa matkan, sekä sen tarinat pysyvästi?')){
      let status = await deleteTrip();
      if(status.status === 'OK'){
        setAlert(null);
        setMainPanel(null);
      } else setAlert(status);

      console.log(status);
    }
  }

  const inputChanged = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setTrip({...trip, [name]:value});
  } 

  const checkChanged = (event) => {
    let name = event.target.name;
    setTrip({...trip, [name]:!trip.yksityinen});
  }

  return(
    <div>
      <h1 className='mb-3'>Matkan {data ? 'muokkaus' : 'luonti'}</h1>
      <Form>
        <Form.Group className="mb-3 inline-block" controlId="formDate">
          <Form.Label><h4 className='mb-0'>Alku päivämäärä</h4></Form.Label>
          <Form.Control type="date" placeholder="Alkupvm" name="alkupvm" value={trip.alkupvm} onChange={(e) => inputChanged(e)} />
          <Form.Label><h4 className='mb-0'>Loppu päivämäärä</h4></Form.Label>
          <Form.Control type="date" placeholder="Loppupvm" name="loppupvm" value={trip.loppupvm} onChange={(e) => inputChanged(e)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formCheck">
          <Form.Check type="checkbox" label="Yksityinen" name="yksityinen" checked={trip.yksityinen} onChange={(e) => checkChanged(e)}/>
        </Form.Group>
        <div className="buttonSpan">
          <Button className="btn btn-dark" onClick={() => {setMainPanel(null)}}>
            Sulje
          </Button>
            {data ?
              <div>
                <Button className="btn btn-danger" onClick={() => deleteTrip(ids)}>
                  Poista
                </Button>
                <Button className="btn btn-primary" onClick={() => {editTrip(ids)}}>
                  Tallenna
                </Button>
              </div>
            :
              <Button className="btn btn-primary" onClick={() => {addTrip()}}>
                Lisää matka
              </Button>}
        </div>
      </Form>
    </div>
  )
}



export { FormStory, FormTrip }
