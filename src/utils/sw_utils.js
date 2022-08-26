import { ListGroup, ListGroupItem, Button, Badge, Image} from 'react-bootstrap';
import { briefPersonMap, briefPlaceMap, briefTripMap } from './dataHandler';
import 'bootstrap/dist/css/bootstrap.min.css';

//luo listgroup annetun datan ja rakenne funktion perusteella
export const createListGroup = (data, populateRule, methods) => {
  return (
    <ListGroup>
      {(data.length != 0) ? data.map((p) => {
        return populateRule(p, methods);
      }):
      <p>Dataa ei löytynyt.</p>}
    </ListGroup>
  )
}

//palauta matkaajien listgroupitem
export const populatePersonItems = (source, methods) => {
  let briefPerson = briefPersonMap(source);
  return <PersonItem data={briefPerson.data} ids={briefPerson.ids} selectMethod={methods.personSelected}></PersonItem>
}

//source datana yhdistetty yksittäisen matkan kaikki matkaajat
export const populateTripItems = (source, methods) => {
  let briefTrip = briefTripMap(source);
  return <TripItem data={briefTrip.data} ids={briefTrip.ids} selectMethod={methods.tripSelected} editMethod={methods.editTrip}></TripItem>
}

//source datana pelkästään matkakohteet
export const populatePlaceItems = (source, methods) => {
  let briefPlace = briefPlaceMap(source);
  return <PlaceItem data={briefPlace.data} ids={briefPlace.ids} selectMethod={methods.placeSelected}></PlaceItem>
}


//matkaajan listgroupitem
const PersonItem = (props) =>{
  const {data, ids, selectMethod} = props;
  return(<ListGroupItem key={ids.matkaaja} action onClick={() => selectMethod(ids, data)}>
     <Image src={data.kuva} width={50} height={50} roundedCircle={true}></Image>
     <div className="lead">{data.etunimi} {data.sukunimi}</div>
     <div className="d-flex">
      <p>{data.nimimerkki}</p>
     </div>
    </ListGroupItem>)
}

//matkakohteen listgroupitem
const PlaceItem = (props) =>{
  const {data, ids, selectMethod} = props;
  return(<ListGroupItem key={ids.matkakohde} action onClick={() => selectMethod(ids, data)}>
     <Image src={data.kuva} width={50} height={50} roundedCircle={true}></Image>
     <div className="lead">{data.kohdenimi}</div>
     <div className="d-flex">
      <p>{data.maa} - {data.paikkakunta}</p>
     </div>
    </ListGroupItem>)
}

//matkan listgroupitem
const TripItem = (props) =>{
  const {data, ids, selectMethod, editMethod} = props;
  return(<ListGroupItem key={ids.matka} action onClick={() => selectMethod(ids, data)}>
      <div className="lead d-flex justify-content-between align-items-start">
        {data.alkupvm} - {data.loppupvm}
        <Badge bg="primary" pill>
          {ids.matka}
        </Badge> 
      </div>
      <div className="d-flex justify-content-between align-items-start">
        <p>Matkaaja: {data.nimimerkki}</p>
      </div>
      <Button className="btn btn-secondary" onClick={() => editMethod(ids, data)}>Muokkaa</Button>
    </ListGroupItem>)
}

