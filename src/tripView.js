import { useState, useEffect, useContext } from 'react';
import { ListGroupItem, Card, CardImg, Button, Image, Alert, Badge} from 'react-bootstrap';
import { FormStory, FormTrip } from './tripforms';
import { combineStoryData, wholeStoryMap, briefStoryMap, tripsPersons} from './utils/dataHandler';
import { createListGroup } from './utils/sw_utils';
import { ErrorAlert } from './utils/itemHandle';
import { DataContext } from "./TravelApp";
import 'bootstrap/dist/css/bootstrap.min.css';
import './tripView.css';


const StoryView = () => {
  const dl = useContext(DataContext);
  const [ownTrips, setOwnTrips] = useState(false); // false -> porukan matkat, true -> omat matkat
  //koko lista tarinoiden tiedoista, jota käytetään listan itemeissä
  //lisää myöhemmin tarkistuksia yksityisyydestä ym.
  const [storyData, setStoryData] = useState([]);
  
  //valitussa tiedossa id:t (.ids)
  const [chosenItem, setChosenItem] = useState({});

  const itemSelected = (ids) => {
    setChosenItem({ids:ids});
  }

  const [mainPanel, setMainPanel] = useState(null); //formien ja avattujen tarinoiden näyttämiseen
  const [alert, setAlert] = useState({}); //virheiden näyttämiseen rajapinnan palauttamen statuksen perusteella

  const defaultGet = {
    method: 'GET',
    headers: {
      'authorization': 'bearer ' + dl.user.token
    },
  }

  useEffect(() => { //jotta menu päivittyisi, nollataan näkymä
    setMainPanel(null);
  },[ownTrips]);

  useEffect(() => {
    const fetchData = async (own) => {
      let response;
      if (own)
        response = await fetch('http://localhost:3004/ownstories', defaultGet);
      else
        response = await fetch('http://localhost:3004/publicstories', defaultGet);
      let stories = await response.json();
      setStoryData(stories.data);
    }
    if(mainPanel === null){
      setAlert(null);
      fetchData(ownTrips); //hae joko omat tai porukan matkat riippuen state muuttujasta
    }
  }, [mainPanel, ownTrips]);

  // jatkossa rajapinta, joka palauttaa tarinan id:llä siihen liittyvät tiedot
  const getStorysData = async (ids) => { //idt: matka, matkakohde
    let response = await fetch(`http://localhost:3004/story?idmatka=${ids.matka}&idmatkakohde=${ids.matkakohde}`, defaultGet);
    let story = await response.json();
    return wholeStoryMap(story.data);
  }

  useEffect(() => {
    const createSelectedItem = async (ids) => { //idt: matka, matkakohde
      const storyData = await getStorysData(ids); // palauttaa datan sekä id:t
      const data = storyData.data;
      const card = <Card className="bg-light" style={{ color: "#000", width: '25rem'}}>                
      <CardImg style={{ height: '15rem'}} variant="top" src={data.kuva} alt="Card image cap"/>
        <Card.Header>
          <Card.Title>{data.kohdenimi}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{data.maa} - {data.paikkakunta}</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <h6>{'Matkaaja: ' + data.nimimerkki}</h6> {/* Jatkossa linkit käyttäjiin tähän? */}
          <div className="border rounded">
            <p>{data.teksti}</p>
          </div>
          <Card.Text>Matkan ajankohta: {data.alkupvm}/{data.loppupvm}</Card.Text>
        </Card.Body>
          <Card.Footer>
            <div className='d-flex justify-content-between'>
            <Button className="btn btn-dark" onClick={() => {setMainPanel(null)}}>Sulje</Button>
            {(ownTrips) ?
              <div>
                <Button className="btn btn-primary" onClick={() => openStoryForm(ids, data)}>Muokkaa tarinaa</Button>
                <Button className="btn btn-secondary" onClick={() => openTripForm(ids, data)}>Muokkaa matkaa</Button>
              </div>
            : null}
            </div>
          </Card.Footer>
      </Card>
      setMainPanel(card);
    }
    if (chosenItem.ids) createSelectedItem(chosenItem.ids);
  }, [chosenItem]);



  //palauta matkakertomuksen listgroupitem
  const populateStoryItems = (source, methods) => {
    let briefStory = briefStoryMap(source);
    return <StoryItem data={briefStory.data} ids={briefStory.ids} itemSelected={methods.itemSelected} own={ownTrips}></StoryItem>
  }


  //avaa pääpaneeliin matkakertomuksen luonti/muokkaus lomake
  const openStoryForm = (editIds, editData) => {
      setMainPanel(<FormStory data={editData} ids={editIds} setMainPanel={setMainPanel} setAlert={setAlert}/>);
  }

  //avaa pääpaneeliin matkakertomuksen luonti lomake
  const openTripForm = (editIds, editData) => {
      setMainPanel(<FormTrip data={editData} ids={editIds} setMainPanel={setMainPanel} setAlert={setAlert}/>);
  }

  //pää-näkymä
  return(
    <div className="storyview-whole">
      <div className="mainUI">
        <div className="mainList overflow-auto">
          <h2>{(ownTrips) ? 'Omat tarinat': 'Julkiset tarinat'}</h2>
          {createListGroup(storyData, populateStoryItems, {itemSelected:itemSelected})}
        </div>
        <div className='buttons'>
           <div>
            <Button disabled={(mainPanel != null)} className="btn btn-primary" onClick={() => openStoryForm()}>Luo tarina</Button>
            <Button disabled={(mainPanel != null)} className="btn btn-secondary" onClick={() => openTripForm()}>Luo uusi matka</Button>
          </div>
          <Button className="btn btn-secondary" onClick={() => setOwnTrips(!ownTrips)}>{(ownTrips) ? 'Julkiset tarinat': 'Omat tarinat'}</Button>
        </div>
      </div>
      <div className="mainPanel">
        {(alert) ? <ErrorAlert status={alert}/> : null}
        {mainPanel}
      </div>
    </div>
  )
}

//luo listgroupitem, propseina käytettävä data
const StoryItem = (props) =>{
  const {data, ids, itemSelected, own} = props;
  return(<ListGroupItem key={ids.matka + '.' + ids.matkakohde} action onClick={() => itemSelected(ids)}>
     <div className='d-flex align-items-center justify-content-between'>
       <Image src={data.kuva} width={50} height={50} roundedCircle={true}></Image>
       {(own) ? <Badge bg="secondary">{(data.yksityinen) ? 'Yksityinen' : 'Julkinen'}</Badge> : null}
     </div>
     <div className="lead">{(own) ? <b>Matka {ids.matka}: </b> : null}{data.kohdenimi}</div>
     <div className="d-flex justify-content-between align-items-start">
       <p>{data.pvm} - {data.maa}</p>
       {(!own) ? <p>{data.nimimerkki}</p> :null}
     </div>
    </ListGroupItem>)
}



export { StoryView, StoryItem };